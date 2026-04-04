from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from database import Base
import datetime

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String(255), index=True)
    generic_name = Column(String(255), index=True)
    category = Column(String(255), index=True)
    strength = Column(String(100))
    is_rx = Column(Boolean, default=False)
    price = Column(Float)
    stock_quantity = Column(Integer, default=0)
    stock_date = Column(Date, default=datetime.date.today)
    opening_stock = Column(Integer, default=0)
    total_sales_quantity = Column(Integer, default=0)
    closing_stock = Column(Integer, default=0)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(500))
    status = Column(String(50), default="Pending")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    customer_name = Column(String(255))
    phone_number = Column(String(50))
    address = Column(String(500))
    total_cost = Column(Float)
    payment_mode = Column(String(100))
    status = Column(String(50), default="Pending")
    order_date = Column(Date, default=datetime.date.today)
