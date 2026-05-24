-- Jalankan skrip ini di MySQL Anda (misalnya melalui phpMyAdmin atau MySQL Workbench)

CREATE DATABASE IF NOT EXISTS aquaponics_db;
USE aquaponics_db;

CREATE TABLE IF NOT EXISTS fish_types (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    liter_per_fish INT NOT NULL
);

-- Memasukkan data jenis ikan
INSERT IGNORE INTO fish_types (id, name, liter_per_fish) VALUES 
('lele', 'Lele', 50),
('nila', 'Nila', 40),
('gurame', 'Gurame', 30),
('patin', 'Patin', 45),
('mas', 'Ikan Mas', 35);
