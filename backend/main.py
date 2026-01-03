from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos los routers
from routers import auth, management, publishing

app = FastAPI(title="API Publicador Redes Sociales")

# Configurar CORS (Permitir frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar por la URL de tu Astro
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
app.include_router(auth.router)
app.include_router(management.router)
app.include_router(publishing.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "Social Media Publisher Backend"}