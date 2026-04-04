from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import medicines, prescriptions, orders
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Moon_Light_Medico API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medicines.router)
app.include_router(prescriptions.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Moon_Light_Medico API"}
