from fastapi import APIRouter, HTTPException
from database import supabase
from models.schemas import UserRegister, UserLogin

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/create-account")
def create_account(user: UserRegister):
    try:
        # Auth de Supabase (Esto dispara el Trigger SQL que creamos antes)
        res = supabase.auth.sign_up({
            "email": user.email, 
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name,
                    "role": user.role # Guardamos si es admin o colab
                }
            }
        })
        return {"msg": "Usuario creado. Revisa tu email.", "user_id": res.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(user: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user.email, 
            "password": user.password
        })
        return {
            "msg": "Login exitoso", 
            "access_token": res.session.access_token,
            "user": res.user
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")