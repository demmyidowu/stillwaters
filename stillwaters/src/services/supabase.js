import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

/**
 * Supabase Client Configuration
 * 
 * Initializes the Supabase client for interacting with the backend database and auth services.
 * Uses 'react-native-url-polyfill' to ensure compatibility with React Native's environment.
 * 
 * Environment variables are loaded via 'react-native-dotenv'.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
