from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from sqlalchemy import or_

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])

@router.get("/search", response_model=List[schemas.MedicineResponse])
def search_medicines(q: str = "", db: Session = Depends(get_db)):
    medicines = db.query(models.Medicine).filter(
        or_(
            models.Medicine.brand_name.ilike(f"%{q}%"),
            models.Medicine.generic_name.ilike(f"%{q}%"),
            models.Medicine.category.ilike(f"%{q}%")
        )
    ).all()
    return medicines

@router.get("/", response_model=List[schemas.MedicineResponse])
def get_all_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Medicine).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=schemas.MedicineResponse)
def get_medicine(id: int, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine

@router.post("/", response_model=schemas.MedicineResponse, status_code=201)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = models.Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.put("/{id}", response_model=schemas.MedicineResponse)
def update_medicine(id: int, medicine: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    update_data = medicine.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_medicine, key, value)

    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.delete("/{id}")
def delete_medicine(id: int, db: Session = Depends(get_db)):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_medicine)
    db.commit()
    return {"message": "Deleted successfully"}
