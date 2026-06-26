import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  description: string;
  short_description: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  nightly_rate: string;
  amenities: string[];
  featured_image: string;
  gallery: string[];
  availability_notes: string | null;
  property_type: string;
  created_at: string;
}

export interface EnquiryInsert {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_interest?: string;
}

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function submitEnquiry(enquiry: EnquiryInsert): Promise<void> {
  const { error } = await supabase.from('enquiries').insert(enquiry);
  if (error) throw error;
}
