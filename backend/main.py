from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import medicines, prescriptions, orders, chat, stock
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
app.include_router(chat.router)
app.include_router(stock.router)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Moon_Light_Medico API"}
