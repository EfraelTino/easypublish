from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List

# --- AUTH ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "admin" # 'admin' crea orgs, 'colab' solo se une

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- ORGANIZACIÓN ---
class OrganizationCreate(BaseModel):
    user_id: str # ID del usuario creador (Admin)
    name: str

class OrganizationResponse(BaseModel):
    id: str
    name: str
    role: str # El rol del usuario dentro de esa org

# --- PROYECTOS (BRANDS) ---
class ProjectCreate(BaseModel):
    organization_id: str
    name: str
    # Diccionario flexible: {"youtube": "key1", "tiktok": "key2"}
    api_keys: Dict[str, str] = Field(default_factory=dict) 

# --- PUBLICACIÓN ---
class PostCreate(BaseModel):
    project_id: str
    user_id: str # Quién lo sube (puede ser un colab)
    caption: str
    media_url: str