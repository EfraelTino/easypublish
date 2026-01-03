from fastapi import APIRouter, HTTPException
from database import supabase
from models.schemas import OrganizationCreate, ProjectCreate

router = APIRouter(prefix="/management", tags=["Gestión de Cuentas"])

# /create-organization
@router.post("/create-organization")
def create_organization(org: OrganizationCreate):
    """
    Crea la organización y vincula al creador como miembro ADMIN
    """
    try:
        # 1. Crear la Org
        org_data = {"name": org.name, "owner_id": org.user_id}
        res_org = supabase.table("organizations").insert(org_data).execute()
        new_org_id = res_org.data[0]['id']

        # 2. Vincular al usuario en la tabla intermedia (organization_members)
        member_data = {
            "organization_id": new_org_id,
            "user_id": org.user_id,
            "role": "admin"
        }
        supabase.table("organization_members").insert(member_data).execute()

        return {"msg": "Organización creada", "data": res_org.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# /create-project
@router.post("/create-project")
def create_project(proj: ProjectCreate):
    """
    Crea un proyecto (Brand) con sus API Keys dentro de una organización
    """
    try:
        data = {
            "organization_id": proj.organization_id,
            "name": proj.name,
            "api_keys": proj.api_keys
        }
        res = supabase.table("projects").insert(data).execute()
        return {"msg": "Proyecto creado", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# /get-brands (Obtener proyectos a los que tengo acceso)
@router.get("/get-brands/{user_id}")
def get_brands(user_id: str):
    """
    Lógica:
    1. Buscar en qué organizaciones está el usuario.
    2. Buscar todos los proyectos de esas organizaciones.
    """
    try:
        # Supabase nos permite hacer esto con 'select' relacional si configuramos FKs,
        # pero haremos una consulta directa usando las policies RLS que creamos.
        
        # Gracias a la RLS de Supabase, si hago select a projects, 
        # solo me devolverá los que tengo permiso de ver.
        res = supabase.table("projects").select("*").execute()
        
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))