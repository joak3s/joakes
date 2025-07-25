export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          metadata: Json | null
          search_results: Json | null
          sequence_number: number
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          metadata?: Json | null
          search_results?: Json | null
          sequence_number: number
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          search_results?: Json | null
          sequence_number?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          created_at: string
          id: string
          last_updated: string
          metadata: Json | null
          session_key: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          session_key: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          session_key?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          chunk_index: number | null
          chunk_metadata: Json | null
          chunk_text: string | null
          content: string
          content_id: string | null
          content_type: string | null
          created_at: string | null
          embedding: string | null
          embedding_model: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          chunk_index?: number | null
          chunk_metadata?: Json | null
          chunk_text?: string | null
          content: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          chunk_index?: number | null
          chunk_metadata?: Json | null
          chunk_text?: string | null
          content?: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      general_info: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          keywords: string[] | null
          priority: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          priority?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          priority?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      journey: {
        Row: {
          color: string
          created_at: string | null
          description: string
          display_order: number
          icon: string
          id: string
          skills: string[]
          subtitle: string | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          color: string
          created_at?: string | null
          description: string
          display_order: number
          icon: string
          id?: string
          skills: string[]
          subtitle?: string | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string
          display_order?: number
          icon?: string
          id?: string
          skills?: string[]
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      journey_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          journey_id: string
          order_index: number
          updated_at: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          journey_id: string
          order_index: number
          updated_at?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          journey_id?: string
          order_index?: number
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_images_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey"
            referencedColumns: ["id"]
          },
        ]
      }
      message_contexts: {
        Row: {
          content: Json
          content_id: string | null
          context_type: string
          created_at: string
          id: string
          message_id: string
          relevance: number | null
        }
        Insert: {
          content: Json
          content_id?: string | null
          context_type: string
          created_at?: string
          id?: string
          message_id: string
          relevance?: number | null
        }
        Update: {
          content?: Json
          content_id?: string | null
          context_type?: string
          created_at?: string
          id?: string
          message_id?: string
          relevance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_contexts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_projects: {
        Row: {
          message_id: string
          project_id: string
          project_image: string | null
          relevance: number | null
        }
        Insert: {
          message_id: string
          project_id: string
          project_image?: string | null
          relevance?: number | null
        }
        Update: {
          message_id?: string
          project_id?: string
          project_image?: string | null
          relevance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_projects_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          order_index: number | null
          project_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          project_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          project_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tags: {
        Row: {
          project_id: string
          tag_id: string
        }
        Insert: {
          project_id: string
          tag_id: string
        }
        Update: {
          project_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tools: {
        Row: {
          project_id: string
          tool_id: string
        }
        Insert: {
          project_id: string
          tool_id: string
        }
        Update: {
          project_id?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tools_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approach: string | null
          challenge: string | null
          created_at: string | null
          description: string | null
          featured_order: number | null
          id: string
          priority: number | null
          results: string | null
          slug: string
          solution: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          approach?: string | null
          challenge?: string | null
          created_at?: string | null
          description?: string | null
          featured_order?: number | null
          id?: string
          priority?: number | null
          results?: string | null
          slug: string
          solution?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          approach?: string | null
          challenge?: string | null
          created_at?: string | null
          description?: string | null
          featured_order?: number | null
          id?: string
          priority?: number | null
          results?: string | null
          slug?: string
          solution?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          description: string | null
          display_priority: number | null
          id: string
          name: string
          show_in_filter: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_priority?: number | null
          id?: string
          name: string
          show_in_filter?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_priority?: number | null
          id?: string
          name?: string
          show_in_filter?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          created_at: string | null
          description: string | null
          display_priority: number | null
          icon: string | null
          id: string
          name: string
          show_in_filter: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_priority?: number | null
          icon?: string | null
          id?: string
          name: string
          show_in_filter?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_priority?: number | null
          icon?: string | null
          id?: string
          name?: string
          show_in_filter?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      aal_level: {
        level_name: string | null
        level_value: number | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const 