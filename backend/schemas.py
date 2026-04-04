from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class MedicineBase(BaseModel):
    brand_name: str
    generic_name: str
    category: str
    strength: str
    is_rx: bool
    price: float
    stock_quantity: int
    stock_date: Optional[date] = None
    opening_stock: Optional[int] = 0
    total_sales_quantity: Optional[int] = 0
    closing_stock: Optional[int] = 0

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    brand_name: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    strength: Optional[str] = None
    is_rx: Optional[bool] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    stock_date: Optional[date] = None
    opening_stock: Optional[int] = None
    total_sales_quantity: Optional[int] = None
    closing_stock: Optional[int] = None

class MedicineResponse(MedicineBase):
    id: int

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    medicine_id: int
    quantity: int

class OrderBase(BaseModel):
    customer_name: str
    phone_number: str
    address: str
    total_cost: float
    payment_mode: str

class OrderCreate(OrderBase):
    items: List[OrderItemBase] = []

class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: str
    order_date: Optional[date] = None

    class Config:
        from_attributes = True
