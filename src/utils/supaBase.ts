import "../loadEnvironment";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xndcfugwxpmotioyqizw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZGNmdWd3eHBtb3Rpb3lxaXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI5MDY1OTcsImV4cCI6MTk3ODQ4MjU5N30.2h5YHUb6FzmPujSi3AFfHi8PFNIsaCS-u1mKdOicr6s"
);

export default supabase;
