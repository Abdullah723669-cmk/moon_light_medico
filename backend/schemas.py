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
    today_added: Optional[int] = None
    today_returns: Optional[int] = None

class MedicineResponse(MedicineBase):
    id: int
    today_opening: Optional[int] = 0
    today_added: Optional[int] = 0
    today_sales: Optional[int] = 0
    today_returns: Optional[int] = 0
    today_closing: Optional[int] = 0

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    medicine_id: int
    quantity: int

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    brand_name: str
    price: float

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    phone_number: str
    address: str
    total_cost: float
    discount_amount: float = 0.0
    delivery_charge: float = 0.0
    payment_mode: str

class OrderCreate(OrderBase):
    items: List[OrderItemBase] = []

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    total_cost: Optional[float] = None
    discount_amount: Optional[float] = None
    delivery_charge: Optional[float] = None
    payment_mode: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    items: Optional[List[OrderItemBase]] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    invoice_number: Optional[str] = None
    status: str
    order_date: Optional[date] = None
    notes: Optional[str] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class PrescriptionResponse(BaseModel):
    id: int
    file_path: str
    status: str

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class StockBase(BaseModel):
    date: date
    medicine_id: int
    brand_name: str
    opening_stock: int
    sales_quantity: int
    return_sales_quantity: int
    added_quantity: int
    closing_stock: int

class StockResponse(StockBase):
    id: int

    class Config:
        from_attributes = True
