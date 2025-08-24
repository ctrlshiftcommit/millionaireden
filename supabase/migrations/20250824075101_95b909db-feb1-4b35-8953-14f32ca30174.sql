-- Create tables for managing frontend elements and configuration

-- UI configuration table for managing frontend elements from backend
CREATE TABLE public.ui_configuration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sitemap table for backend management (not visible to end users)
CREATE TABLE public.sitemap (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  priority DECIMAL(2,1) DEFAULT 0.5,
  change_frequency TEXT DEFAULT 'weekly',
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_public BOOLEAN DEFAULT true,
  parent_path TEXT,
  sort_order INTEGER DEFAULT 0,
  meta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table for system notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences for notifications and UI settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  notification_settings JSONB DEFAULT '{"daily_progress": true, "achievements": true, "reminders": true}',
  ui_settings JSONB DEFAULT '{"theme": "dark", "animations": true, "sound": false}',
  privacy_settings JSONB DEFAULT '{"share_progress": false, "public_profile": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ui_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitemap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ui_configuration (admin/public read)
CREATE POLICY "Anyone can view ui configuration"
ON public.ui_configuration
FOR SELECT
USING (is_active = true);

-- RLS Policies for sitemap (admin only for now)
CREATE POLICY "Admins can manage sitemap"
ON public.sitemap
FOR ALL
USING (false); -- Will be updated when admin roles are implemented

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for user_preferences  
CREATE POLICY "Users can manage their own preferences"
ON public.user_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_ui_configuration_updated_at
  BEFORE UPDATE ON public.ui_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sitemap_updated_at
  BEFORE UPDATE ON public.sitemap
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default UI configuration
INSERT INTO public.ui_configuration (key, value, description, category) VALUES
('app_name', '"Millionaire Den"', 'Application name', 'branding'),
('theme_colors', '{"primary": "0 85% 58%", "secondary": "0 0% 14%"}', 'Theme color configuration', 'design'),
('navigation_items', '[
  {"icon": "Home", "label": "Home", "path": "/", "order": 1},
  {"icon": "Quote", "label": "Motivation", "path": "/motivation", "order": 2},
  {"icon": "BookOpen", "label": "Journal", "path": "/journal", "order": 3},
  {"icon": "Gift", "label": "Rewards", "path": "/rewards", "order": 4},
  {"icon": "User", "label": "Profile", "path": "/profile", "order": 5}
]', 'Bottom navigation configuration', 'navigation'),
('level_definitions', '[
  {"id": 1, "name": "Peasant", "req_exp": 1000, "image": "assets/levels/1.png"},
  {"id": 2, "name": "Servant", "req_exp": 5000, "image": "assets/levels/2.png"},
  {"id": 3, "name": "Merchant", "req_exp": 10000, "image": "assets/levels/3.png"},
  {"id": 4, "name": "Noble", "req_exp": 20000, "image": "assets/levels/4.png"},
  {"id": 5, "name": "Baron", "req_exp": 40000, "image": "assets/levels/5.png"},
  {"id": 6, "name": "Earl", "req_exp": 80000, "image": "assets/levels/6.png"},
  {"id": 7, "name": "Duke", "req_exp": 160000, "image": "assets/levels/7.png"},
  {"id": 8, "name": "Prince", "req_exp": 320000, "image": "assets/levels/8.png"},
  {"id": 9, "name": "King", "req_exp": 640000, "image": "assets/levels/9.png"},
  {"id": 10, "name": "Emperor", "req_exp": 1000000, "image": "assets/levels/10.png"}
]', 'Level definitions for gamification', 'gamification'),
('notification_triggers', '{"daily_progress_threshold": 0.5, "streak_milestones": [3, 7, 14, 30]}', 'Notification trigger configuration', 'notifications');

-- Insert sitemap entries
INSERT INTO public.sitemap (path, title, description, priority, is_public, sort_order) VALUES
('/', 'Home', 'Main dashboard and overview', 1.0, true, 1),
('/profile', 'Profile', 'User profile and habit management', 0.8, true, 2),
('/journal', 'Journal', 'Personal journaling space', 0.7, true, 3),
('/motivation', 'Motivation', 'Daily quotes and inspiration', 0.6, true, 4),
('/rewards', 'Rewards', 'Rewards and achievements', 0.7, true, 5),
('/shop', 'Shop', 'Crystal shop and conversions', 0.6, true, 6),
('/level-history', 'Progress History', 'Level and EXP progress tracking', 0.5, true, 7),
('/settings', 'Settings', 'Account and app settings', 0.4, true, 8),
('/auth', 'Authentication', 'Login and signup', 0.3, false, 9);

-- Function to initialize new user data with zero stats
CREATE OR REPLACE FUNCTION public.initialize_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user experience record with zero values
  INSERT INTO public.user_experience (user_id, total_exp, current_level, lunar_crystals)
  VALUES (NEW.id, 0, 0, 0);
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create initial welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id, 
    'Welcome to Millionaire Den!', 
    'Start your journey by creating your first habit and begin earning EXP and Lunar Crystals.',
    'welcome'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize new users
CREATE TRIGGER on_auth_user_created_initialize
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_new_user();

-- Function to check daily progress and send notifications
CREATE OR REPLACE FUNCTION public.check_daily_progress_notification(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  daily_completion_rate DECIMAL;
  total_habits INTEGER;
  completed_habits INTEGER;
BEGIN
  -- Get today's habit completion stats
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN hc.completed_date = CURRENT_DATE THEN 1 END) as completed
  INTO total_habits, completed_habits
  FROM public.habits h
  LEFT JOIN public.habit_completions hc ON h.id = hc.habit_id AND hc.user_id = p_user_id
  WHERE h.user_id = p_user_id AND h.is_active = true;
  
  -- Calculate completion rate
  IF total_habits > 0 THEN
    daily_completion_rate := completed_habits::DECIMAL / total_habits::DECIMAL;
    
    -- Send notification if > 50% completed and no notification sent today
    IF daily_completion_rate > 0.5 THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      SELECT p_user_id, 'Great Progress!', 
             'You''ve completed ' || ROUND(daily_completion_rate * 100) || '% of your daily habits!',
             'progress'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.notifications 
        WHERE user_id = p_user_id 
        AND type = 'progress' 
        AND created_at::DATE = CURRENT_DATE
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;