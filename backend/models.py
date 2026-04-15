from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
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

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    brand_name = Column(String(255))
    quantity = Column(Integer)
    price = Column(Float)

    order = relationship("Order", back_populates="items")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True)
    customer_name = Column(String(255))
    phone_number = Column(String(50))
    address = Column(String(500))
    total_cost = Column(Float)
    discount_amount = Column(Float, default=0.0)
    delivery_charge = Column(Float, default=0.0)
    payment_mode = Column(String(100))
    status = Column(String(50), default="Pending")
    order_date = Column(Date, default=datetime.date.today)
    notes = Column(String(1000), nullable=True)

    items = relationship("OrderItem", back_populates="order")

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    brand_name = Column(String(255))
    opening_stock = Column(Integer, default=0)
    sales_quantity = Column(Integer, default=0)
    return_sales_quantity = Column(Integer, default=0)
    added_quantity = Column(Integer, default=0)
    closing_stock = Column(Integer, default=0)
