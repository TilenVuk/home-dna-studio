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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      consultation_bookings: {
        Row: {
          consultation_type: string
          created_at: string
          customer_email: string
          customer_email_status: string
          customer_name: string
          customer_phone: string
          customer_resend_id: string | null
          email_attempt_count: number
          email_last_error: string | null
          id: string
          internal_email_status: string
          internal_resend_id: string | null
          message: string
          project_type: string
          slot_end: string
          slot_start: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          consultation_type: string
          created_at?: string
          customer_email: string
          customer_email_status?: string
          customer_name: string
          customer_phone?: string
          customer_resend_id?: string | null
          email_attempt_count?: number
          email_last_error?: string | null
          id?: string
          internal_email_status?: string
          internal_resend_id?: string | null
          message?: string
          project_type?: string
          slot_end: string
          slot_start: string
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          consultation_type?: string
          created_at?: string
          customer_email?: string
          customer_email_status?: string
          customer_name?: string
          customer_phone?: string
          customer_resend_id?: string | null
          email_attempt_count?: number
          email_last_error?: string | null
          id?: string
          internal_email_status?: string
          internal_resend_id?: string | null
          message?: string
          project_type?: string
          slot_end?: string
          slot_start?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_dna_analytics_events: {
        Row: {
          booking_id: string | null
          created_at: string
          details: Json
          device_type: string
          event_name: string
          id: string
          landing_path: string
          locale: string
          referrer_host: string | null
          screen_key: string | null
          session_id: string
          source: string
          step_index: number | null
          step_total: number | null
          submission_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          viewport_width: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          details?: Json
          device_type: string
          event_name: string
          id: string
          landing_path: string
          locale: string
          referrer_host?: string | null
          screen_key?: string | null
          session_id: string
          source: string
          step_index?: number | null
          step_total?: number | null
          submission_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_width: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          details?: Json
          device_type?: string
          event_name?: string
          id?: string
          landing_path?: string
          locale?: string
          referrer_host?: string | null
          screen_key?: string | null
          session_id?: string
          source?: string
          step_index?: number | null
          step_total?: number | null
          submission_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_width?: number
        }
        Relationships: []
      }
      home_dna_report_attempts: {
        Row: {
          created_at: string
          id: number
          request_ip_hash: string
        }
        Insert: {
          created_at?: string
          id?: never
          request_ip_hash: string
        }
        Update: {
          created_at?: string
          id?: never
          request_ip_hash?: string
        }
        Relationships: []
      }
      home_dna_submissions: {
        Row: {
          answers: Json
          attempt_count: number
          consent: boolean
          consent_at: string
          created_at: string
          customer_email: string
          customer_email_status: string
          customer_name: string
          customer_phone: string
          customer_resend_id: string | null
          id: string
          internal_email_status: string
          internal_resend_id: string | null
          last_error: string | null
          locale: string
          report: Json
          request_ip_hash: string
          send_status: string
          summary: string
          updated_at: string
        }
        Insert: {
          answers: Json
          attempt_count?: number
          consent: boolean
          consent_at: string
          created_at?: string
          customer_email: string
          customer_email_status?: string
          customer_name: string
          customer_phone?: string
          customer_resend_id?: string | null
          id: string
          internal_email_status?: string
          internal_resend_id?: string | null
          last_error?: string | null
          locale?: string
          report: Json
          request_ip_hash: string
          send_status?: string
          summary: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          attempt_count?: number
          consent?: boolean
          consent_at?: string
          created_at?: string
          customer_email?: string
          customer_email_status?: string
          customer_name?: string
          customer_phone?: string
          customer_resend_id?: string | null
          id?: string
          internal_email_status?: string
          internal_resend_id?: string | null
          last_error?: string | null
          locale?: string
          report?: Json
          request_ip_hash?: string
          send_status?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      home_dna_funnel_daily: {
        Row: {
          acquisition_campaign: string | null
          acquisition_medium: string | null
          acquisition_source: string | null
          booking_views: number | null
          completions: number | null
          consultations: number | null
          contact_views: number | null
          day: string | null
          locale: string | null
          starts: number | null
          views: number | null
        }
        Relationships: []
      }
      home_dna_step_funnel_daily: {
        Row: {
          completions: number | null
          day: string | null
          locale: string | null
          screen_key: string | null
          step_index: number | null
          views: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      consume_home_dna_report_quota: {
        Args: {
          p_max_requests?: number
          p_request_ip_hash: string
          p_window_seconds?: number
        }
        Returns: boolean
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
