import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://edcgvjrwkodxdhwyzwtt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkY2d2anJ3a29keGRod3l6d3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI0MjUsImV4cCI6MjA2NDY5ODQyNX0.kq6wE9mgl0p_Dkq3yYFVQeo2JpKJdI9bxmidwDosGto';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
