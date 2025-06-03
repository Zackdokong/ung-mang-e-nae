import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jecfqvqrtgtueuqmncms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplY2ZxdnFydGd0dWV1cW1uY21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDU1MzQsImV4cCI6MjA2NDQyMTUzNH0.KusvcMknBxp30Ztnw8ChTaWH6mpU6gTXTXPlJp1etHw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
