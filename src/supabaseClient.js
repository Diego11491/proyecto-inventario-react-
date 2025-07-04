// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wudtxqcbqzpbojgauigk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHR4cWNicXpwYm9qZ2F1aWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Njg1NjYsImV4cCI6MjA2MTQ0NDU2Nn0.eiUwpxtXxxUtb7D9d20pvLVjtOgCDDcQNiDGI2EwcTA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);