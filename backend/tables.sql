-- =====================================================
-- BARBERSHOP DATABASE TABLES
-- =====================================================

-- Table: services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: barbers
CREATE TABLE IF NOT EXISTS barbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    specializare VARCHAR(255) DEFAULT NULL,
    imagine VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: clients
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    prenume VARCHAR(100) NOT NULL,
    telefon VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT DEFAULT NULL,
    nume VARCHAR(100) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    barber_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: holidays
CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barber_id INT NOT NULL,
    date DATE NOT NULL,
    UNIQUE KEY unique_barber_date (barber_id, date),
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
