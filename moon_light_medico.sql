-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: moon_light_medico
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) DEFAULT NULL,
  `generic_name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `strength` varchar(100) DEFAULT NULL,
  `is_rx` tinyint(1) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `stock_date` date DEFAULT NULL,
  `opening_stock` int DEFAULT '0',
  `total_sales_quantity` int DEFAULT '0',
  `closing_stock` int DEFAULT '0',
  `stock_quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ix_medicines_id` (`id`),
  KEY `ix_medicines_generic_name` (`generic_name`),
  KEY `ix_medicines_brand_name` (`brand_name`),
  KEY `ix_medicines_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (1,'Maxpro Capsule','Esomeprazole','Anti GERD ','20mg',0,15,'2026-04-05',500,80,420,420),(2,'Amxomin','Losartan','Antihypertensive','40mg',0,143.74,'2026-04-05',500,0,500,500),(3,'Healtan','Azithromycin','Vitamin','20mg',0,41.72,'2026-04-05',500,5,495,495),(4,'Amxomin','Metformin','Vitamin','40mg',0,65.78,'2026-04-05',500,0,500,500),(5,'Cardicin','Amoxicillin','Analgesic','20mg',0,81.24,'2026-04-05',500,10,490,490),(6,'Amxozole','Amoxicillin','Vitamin','10mg',1,117.12,'2026-04-05',500,0,500,500),(7,'Curevit','Pantoprazole','Analgesic','40mg',0,52.97,'2026-04-05',500,0,500,500),(8,'Amxomin','Metformin','Analgesic','40mg',1,46.35,'2026-04-05',500,0,500,500),(9,'Vitocin','Amoxicillin','Antidiabetic','10mg',0,114.48,'2026-04-05',500,0,500,500),(10,'Amxopine','Metformin','Analgesic','500mg',0,134.25,'2026-04-05',500,0,500,500),(11,'Cardimin','Vitamin C','Antidiabetic','20mg',0,68.23,'2026-04-05',500,5,495,495),(12,'Vitocin','Ibuprofen','Antihypertensive','500mg',1,47.43,'2026-04-05',500,0,500,500),(13,'Vitofen','Vitamin C','Antihypertensive','5mg',1,89.59,'2026-04-05',500,0,500,500),(14,'Amxotan','Amoxicillin','Antidiabetic','10mg',1,80.56,'2026-04-05',500,0,500,500),(15,'Losatan','Amlodipine','Analgesic','20mg',1,111.34,'2026-04-05',500,0,500,500),(16,'Zitromol','Amoxicillin','Antidiabetic','20mg',1,53.72,'2026-04-05',500,0,500,500),(17,'Vitomin','Losartan','Analgesic','20mg',1,34.95,'2026-04-05',500,0,500,500),(18,'Paravit','Azithromycin','Vitamin','5mg',0,97.06,'2026-04-05',500,0,500,500),(19,'Losamol','Glimepiride','Antibiotic','5mg',1,100.6,'2026-04-05',500,0,500,500),(20,'Vitofen','Omeprazole','Antidiabetic','40mg',0,37.94,'2026-04-05',500,0,500,500),(21,'Parapine','Pantoprazole','Antidiabetic','10mg',1,148.74,'2026-04-05',500,0,500,500),(22,'Healmol','Amoxicillin','Vitamin','5mg',1,49.31,'2026-04-05',500,0,500,500),(23,'Losapine','Vitamin C','Antidiabetic','40mg',1,25.34,'2026-04-05',500,0,500,500),(24,'Healpine','Azithromycin','Antidiabetic','5mg',1,138.04,'2026-04-05',500,0,500,500),(25,'Parapine','Multivitamin','Analgesic','500mg',0,52.91,'2026-04-05',500,0,500,500),(26,'Vitotan','Amlodipine','Antacid','40mg',0,38.42,'2026-04-05',500,10,490,490),(27,'Losapine','Omeprazole','Antacid','40mg',1,136.53,'2026-04-05',500,0,500,500),(28,'Zitromol','Amlodipine','Antibiotic','20mg',0,144.26,'2026-04-05',500,0,500,500),(29,'Cardimol','Omeprazole','Vitamin','500mg',1,97.35,'2026-04-05',500,0,500,500),(30,'Cardimol','Azithromycin','Antihypertensive','5mg',1,22.71,'2026-04-05',500,0,500,500),(31,'Curezole','Omeprazole','Antidiabetic','40mg',1,137.89,'2026-04-05',500,0,500,500),(32,'Losazole','Omeprazole','Anti GERD ','20mg',0,5.33,'2026-04-05',500,0,500,500),(33,'Parapine','Paracetamol','Antacid','500mg',0,66.95,'2026-04-05',500,0,500,500),(34,'Amxofen','Pantoprazole','Antidiabetic','500mg',0,93.55,'2026-04-05',500,0,500,500),(35,'Healvit','Metformin','Antibiotic','40mg',1,107.91,'2026-04-05',500,0,500,500),(36,'Betafen','Amoxicillin','Vitamin','40mg',1,52.4,'2026-04-05',500,0,500,500),(37,'Healpine','Glimepiride','Antihypertensive','5mg',1,9.2,'2026-04-05',500,0,500,500),(38,'Zitropine','Glimepiride','Antibiotic','5mg',1,119.58,'2026-04-05',500,0,500,500),(39,'Betamol','Ibuprofen','Vitamin','40mg',0,115.6,'2026-04-05',500,0,500,500),(40,'Healmin','Azithromycin','Antibiotic','40mg',0,139.44,'2026-04-05',500,0,500,500),(41,'Healfen','Vitamin C','Vitamin','10mg',1,119.66,'2026-04-05',500,0,500,500),(42,'Losazole','Ibuprofen','Antihypertensive','10mg',0,33.91,'2026-04-05',500,0,500,500),(43,'Curezole','Glimepiride','Antibiotic','500mg',0,146.55,'2026-04-05',500,0,500,500),(44,'Parapine','Ibuprofen','Antihypertensive','20mg',1,115.28,'2026-04-05',500,0,500,500),(45,'Losatan','Amoxicillin','Antibiotic','5mg',1,108.24,'2026-04-05',500,0,500,500),(46,'Paracin','Omeprazole','Antihypertensive','40mg',1,56.77,'2026-04-05',500,0,500,500),(47,'Nuramol','Ibuprofen','Analgesic','5mg',1,104.47,'2026-04-05',500,0,500,500),(48,'Curefen','Vitamin C','Antihypertensive','500mg',0,65.54,'2026-04-05',500,0,500,500),(49,'Nurapine','Ibuprofen','Antibiotic','40mg',0,99.96,'2026-04-05',500,0,500,500),(50,'Cardifen','Glimepiride','Analgesic','5mg',0,12.22,'2026-04-05',500,0,500,500),(51,'Test2','Test2','Test2','Test2',0,1,'2026-04-05',500,0,500,500),(52,'Betafen','Ibuprofen','Pain Killer','200mg',0,15,'2026-04-05',500,30,470,470);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `medicine_id` int DEFAULT NULL,
  `brand_name` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `medicine_id` (`medicine_id`),
  KEY `ix_order_items_id` (`id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,12,1,'Maxpro Capsule',20,15),(2,13,11,'Cardimin',5,68.23),(3,14,1,'Maxpro Capsule',10,15),(4,14,52,'Betafen',10,15);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `total_cost` float DEFAULT NULL,
  `payment_mode` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `discount_amount` float DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_orders_order_number` (`order_number`),
  KEY `ix_orders_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-000001','Abdullah Al Nayeem','01711355387','Succeed Nazrul Castle, Shoshan Road, Joydebpur, Gazipur-1700',288.52,'COD','Completed',NULL,NULL,0),(2,'ORD-000002','Nasir Uddin','01772235689','Renata Limited, 808, Bhairabpur Uttar, Bhairab, Kishoreganj',87.5,'COD','Pending',NULL,NULL,0),(3,'ORD-000003','Sohel Rana','01819225588','Succeed Nazrul Castle, Shoshan Road, Joydebpur, Gazipur-1700',89.3,'Mobile Banking','Pending',NULL,NULL,0),(4,'ORD-000004','Nahid Islam','01722334455','Nazrul Villa, Vurulia, Joydebpur, Gazipue-1700',150,'COD','Pending','2026-04-05',NULL,0),(5,'ORD-000005','Sumon Mia','01678224466','Borsha Cenema Hall, Chowrasta, Gazipur-1700',300,'COD','Pending','2026-04-05',NULL,0),(6,'ORD-000006','Subaita Sohel','01934556677','Vurulia, Joydebpur, Gazipur-1700',384.2,'COD','Pending','2026-04-05',NULL,0),(7,'ORD-000007','Raida Hossain','01345676778','Chayabithi, Gazipur-1700',150,'COD','Pending','2026-04-05',NULL,0),(8,'ORD-000008','Raida Hossain','01934556677','Chayabithi, Gazipur-1700',150,'COD','Pending','2026-04-05',NULL,0),(9,'ORD-000009','Sabuz Hossain','014352346455','Chayabithi, Gazipur-1700',450,'COD','Pending','2026-04-05',NULL,0),(10,'ORD-000010','Dulal Mia','01734556677','Agargaon, Dhaka-1206',812.4,'COD','Pending','2026-04-05',NULL,0),(11,'ORD-000011','Tofazzal Hossain','01678223344','Tongi rail gate, Gazipur-1736',208.6,'COD','Pending','2026-04-05',NULL,0),(12,'ORD-000012','Anisur Rahman','01988776655','Chapulia, Joydebpur, Gazipur-1700',300,'COD','Pending','2026-04-05','INV-000012',0),(13,'ORD-000013','Zafar Kamal','01788567890','Chowrasta, Gazipur-1700',341.15,'COD','Pending','2026-04-05','INV-000013',0),(14,'ORD-000014','Dildar Khan','01345623344','Succeed Nazrul Castle, Shoshan Road,Gazipur-1710',285,'COD','Pending','2026-04-05','INV-000014',15);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_path` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_prescriptions_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  8:28:24

-- Grant privileges to the Docker-created user
GRANT ALL PRIVILEGES ON moon_light_medico.* TO 'moonlight_user'@'%';
FLUSH PRIVILEGES;

