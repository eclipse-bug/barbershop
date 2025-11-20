-- =====================================================
-- BARBERSHOP DATABASE TABLES
-- =====================================================

-- Table: services
-- Used by: get_services.php
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: barbers
-- Used by: get_barbers.php, get_holidays.php, set_holiday.php, delete_holiday.php
CREATE TABLE IF NOT EXISTS barbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    specializare VARCHAR(255) DEFAULT NULL,
    imagine VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: admins
-- Used by: admin_login.php
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    prenume VARCHAR(100) NOT NULL,
    telefon VARCHAR(20) NOT NULL UNIQUE,
    cod_acces VARCHAR(255) NOT NULL COMMENT 'Hashed password using password_hash()'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: appointments
-- Used by: book_appointment.php, get_booked_times.php, update_appointment.php,
--          delete_appointment.php, delete_old_appointments.php, get_barber_appointments.php
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    client_nume VARCHAR(100) DEFAULT NULL,
    client_prenume VARCHAR(100) DEFAULT NULL,
    client_telefon VARCHAR(20) DEFAULT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    barber_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: simple_appointments
-- Used by: get_all_appointments.php
CREATE TABLE IF NOT EXISTS simple_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    barber_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: holidays
-- Used by: get_holidays.php, set_holiday.php, delete_holiday.php
CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barber_id INT NOT NULL,
    date DATE NOT NULL,
    UNIQUE KEY unique_barber_date (barber_id, date),
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
