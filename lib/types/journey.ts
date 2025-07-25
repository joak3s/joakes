import type { Database } from './database'

export type Journey = Database['public']['Tables']['journey']['Row'] & {
  journey_images?: Database['public']['Tables']['journey_images']['Row'][];
}

export type CreateJourneyInput = Database['public']['Tables']['journey']['Insert'] & {
  images?: { url: string; alt_text?: string; order_index: number }[];
}

export type UpdateJourneyInput = Database['public']['Tables']['journey']['Update'] & {
  images?: { url: string; alt_text?: string; order_index: number }[];
}

export type AddJourneyImageInput = {
  journey_id: string;
  url: string;
  alt_text?: string;
  order_index: number;
} 