import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kzskgrntpuybblskneoe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6c2tncm50cHV5YmJsc2tuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjE0NDIsImV4cCI6MjA2Njc5NzQ0Mn0.IwQij9_QT6cDnABhXL5Js4SNr_DjfJtBGN2PUU7wKuU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);