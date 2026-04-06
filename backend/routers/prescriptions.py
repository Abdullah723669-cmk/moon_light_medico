from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import shutil
import os
import uuid

router = APIRouter(prefix="/api/prescriptions", tags=["Prescriptions"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_prescription(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf')):
        raise HTTPException(status_code=400, detail="Invalid file type")

    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_prescription = models.Prescription(file_path=file_path)
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)

    return {"id": db_prescription.id, "file_path": file_path, "status": db_prescription.status}

@router.get("/", response_model=List[schemas.PrescriptionResponse])
def get_all_prescriptions(db: Session = Depends(get_db)):
    return db.query(models.Prescription).all()

@router.delete("/{id}")
def delete_prescription(id: int, db: Session = Depends(get_db)):
    db_prescription = db.query(models.Prescription).filter(models.Prescription.id == id).first()
    if not db_prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    # Optional: Delete file from local storage
    if os.path.exists(db_prescription.file_path):
        os.remove(db_prescription.file_path)
        
    db.delete(db_prescription)
    db.commit()
    return {"message": "Deleted successfully"}
