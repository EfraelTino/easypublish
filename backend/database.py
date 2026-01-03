import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY")

# Esta variable 'supabase' es la que importaremos en los routers
supabase: Client = create_client(url, key)