from fastapi import APIRouter, BackgroundTasks, HTTPException
from database import supabase
from models.schemas import PostCreate
import time

router = APIRouter(prefix="/publish", tags=["Publicación"])

# --- LÓGICA DE SERVICIO (SIMULADA) ---
def tarea_subir_redes(project_id: str, media_url: str, caption: str):
    print(f"\n🚀 WORKER: Iniciando proceso para proyecto {project_id}")
    
    # 1. Obtener las credenciales de la BD
    res = supabase.table("projects").select("api_keys").eq("id", project_id).execute()
    if not res.data:
        print("❌ ERROR: Proyecto no encontrado")
        return
        
    keys = res.data[0]['api_keys']
    print(f"🔑 WORKER: Usando keys para: {list(keys.keys())}")

    # 2. Simular subida a cada red detectada
    if "youtube" in keys:
        print("  ... Subiendo a YouTube ...")
        time.sleep(2)
    if "tiktok" in keys:
        print("  ... Subiendo a TikTok ...")
        time.sleep(2)
    if "facebook" in keys:
        print("  ... Subiendo a Facebook ...")
        time.sleep(2)

    print(f"✅ WORKER: Finalizado. Video '{caption}' publicado.\n")
    
    # Aquí podríamos actualizar el estado en la tabla 'posts' a 'published'

# --- ENDPOINT ---
# /send-post
@router.post("/send-post")
def send_post(post: PostCreate, background_tasks: BackgroundTasks):
    try:
        # 1. Registrar en BD (Historial)
        post_data = {
            "project_id": post.project_id,
            "content": post.caption,
            "media_url": post.media_url,
            "status": "processing"
        }
        supabase.table("posts").insert(post_data).execute()

        # 2. Enviar al background
        background_tasks.add_task(
            tarea_subir_redes, 
            post.project_id, 
            post.media_url, 
            post.caption
        )

        return {"msg": "Publicación iniciada en segundo plano"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))