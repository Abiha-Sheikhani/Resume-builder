
import { createClient } from "@supabase/supabase-js";
const apiUrl = 'https://iafbggwpxnbilmpypkpt.supabase.co'
let apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZmJnZ3dweG5iaWxtcHlwa3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTA1NjAsImV4cCI6MjA4NTM2NjU2MH0.HlDzvvA443ZjRY6gFYLGSBElHCQnyejEnxBRix8wrWE'

const supabase = createClient(apiUrl, apikey);


export default supabase

