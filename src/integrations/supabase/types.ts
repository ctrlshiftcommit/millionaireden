export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          frequency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          frequency?: string
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          created_at?: string
        }
      }
      user_experience: {
        Row: {
          id: string
          user_id: string
          total_exp: number
          current_level: number
          lunar_crystals: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_exp?: number
          current_level?: number
          lunar_crystals?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_exp?: number
          current_level?: number
          lunar_crystals?: number
          created_at?: string
          updated_at?: string
        }
      }
      exp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          reason?: string
          created_at?: string
        }
      }
      level_history: {
        Row: {
          id: string
          user_id: string
          level: number
          exp_at_level: number
          reached_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: number
          exp_at_level: number
          reached_at: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: number
          exp_at_level?: number
          reached_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cost: number
          is_claimed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          cost: number
          is_claimed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          cost?: number
          is_claimed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reward_purchases: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          purchased_at: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          purchased_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          content: string
          mood: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          mood?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          mood?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          criteria: string
          exp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          criteria: string
          exp_reward: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          criteria?: string
          exp_reward?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_user_stats: {
        Args: {
          p_user_id: string
          p_reset_crystals?: boolean
        }
        Returns: undefined
      }
      check_daily_progress_notification: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}