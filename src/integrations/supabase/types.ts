export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      exp_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          new_level: number | null
          old_level: number | null
          source: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          new_level?: number | null
          old_level?: number | null
          source?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          new_level?: number | null
          old_level?: number | null
          source?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string
          completed_date: string
          crystals_gained: number | null
          exp_gained: number | null
          habit_id: string
          id: string
          streak_at_completion: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          completed_date?: string
          crystals_gained?: number | null
          exp_gained?: number | null
          habit_id: string
          id?: string
          streak_at_completion?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          completed_date?: string
          crystals_gained?: number | null
          exp_gained?: number | null
          habit_id?: string
          id?: string
          streak_at_completion?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string
          crystal_reward: number
          description: string | null
          exp_reward: number
          goal: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          crystal_reward?: number
          description?: string | null
          exp_reward?: number
          goal?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          crystal_reward?: number
          description?: string | null
          exp_reward?: number
          goal?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_important: boolean | null
          mood: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_important?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_important?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      level_history: {
        Row: {
          exp_at_levelup: number
          id: string
          level_up_at: string
          new_level: number
          old_level: number
          user_id: string
        }
        Insert: {
          exp_at_levelup: number
          id?: string
          level_up_at?: string
          new_level: number
          old_level: number
          user_id: string
        }
        Update: {
          exp_at_levelup?: number
          id?: string
          level_up_at?: string
          new_level?: number
          old_level?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_purchases: {
        Row: {
          crystals_spent: number
          id: string
          is_used: boolean | null
          purchased_at: string
          reward_id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          crystals_spent: number
          id?: string
          is_used?: boolean | null
          purchased_at?: string
          reward_id: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          crystals_spent?: number
          id?: string
          is_used?: boolean | null
          purchased_at?: string
          reward_id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_purchases_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          category: string | null
          cost: number
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cost: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sitemap: {
        Row: {
          change_frequency: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          last_modified: string | null
          meta_data: Json | null
          parent_path: string | null
          path: string
          priority: number | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          change_frequency?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_modified?: string | null
          meta_data?: Json | null
          parent_path?: string | null
          path: string
          priority?: number | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          change_frequency?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_modified?: string | null
          meta_data?: Json | null
          parent_path?: string | null
          path?: string
          priority?: number | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ui_configuration: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_experience: {
        Row: {
          created_at: string
          current_level: number
          id: string
          lunar_crystals: number
          total_exp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          lunar_crystals?: number
          total_exp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          lunar_crystals?: number
          total_exp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          notification_settings: Json | null
          privacy_settings: Json | null
          ui_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_settings?: Json | null
          privacy_settings?: Json | null
          ui_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_settings?: Json | null
          privacy_settings?: Json | null
          ui_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_daily_progress_notification: {
        Args: { p_user_id: string }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
