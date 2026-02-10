import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// DO NOT hard-code secrets in repo. Use environment variables in production.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://edcgvjrwkodxdhwyzwtt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkY2d2anJ3a29keGRod3l6d3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI0MjUsImV4cCI6MjA2NDY5ODQyNX0.kq6wE9mgl0p_Dkq3yYFVQeo2JpKJdI9bxmidwDosGto';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
