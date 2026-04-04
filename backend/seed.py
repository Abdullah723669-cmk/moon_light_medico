import random
from database import SessionLocal, engine
import models

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.Medicine).count() > 0:
        print("Database already contains data.")
        return

    categories = ["Antihypertensive", "Antibiotic", "Analgesic", "Antidiabetic", "Antacid", "Vitamin"]
    generic_names = [
        "Amlodipine", "Losartan", "Amoxicillin", "Azithromycin", 
        "Paracetamol", "Ibuprofen", "Metformin", "Glimepiride",
        "Omeprazole", "Pantoprazole", "Vitamin C", "Multivitamin"
    ]
    
    brands_prefix = ["Vito", "Cure", "Heal", "Nura", "Cardi", "Zitro", "Para", "Beta", "Losa", "Amxo"]
    brands_suffix = ["pine", "tan", "cin", "mol", "fen", "min", "zole", "vit"]

    medicines = []
    for _ in range(50):
        generic = random.choice(generic_names)
        brand = random.choice(brands_prefix) + random.choice(brands_suffix)
        category = random.choice(categories)
        strength = random.choice(["5mg", "10mg", "20mg", "40mg", "500mg"])
        is_rx = random.choice([True, False])
        price = round(random.uniform(5.0, 150.0), 2)
        stock_quantity = random.randint(10, 500)
        
        med = models.Medicine(
            brand_name=brand,
            generic_name=generic,
            category=category,
            strength=strength,
            is_rx=is_rx,
            price=price,
            stock_quantity=stock_quantity
        )
        medicines.append(med)
    
    db.add_all(medicines)
    db.commit()
    print("Seeded 50 medicines successfully.")

if __name__ == "__main__":
    seed_data()
