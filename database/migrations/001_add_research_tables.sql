-- Migration: Add tables for Research Focus Enhancements
-- Created: 2024-12-07

USE fuelwatch_db;

-- 1. Weather Data Table
CREATE TABLE IF NOT EXISTS weather_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    hour INT,
    temperature DECIMAL(4,1),
    humidity INT,
    rainfall_probability INT,
    weather_condition VARCHAR(50),
    wind_speed DECIMAL(4,1),
    visibility DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- 2. Holidays Calendar Table
CREATE TABLE IF NOT EXISTS holidays_calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL UNIQUE,
    holiday_name VARCHAR(200),
    holiday_type ENUM('public', 'school', 'festival', 'local'),
    is_long_weekend BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Busy Time Patterns Table
CREATE TABLE IF NOT EXISTS busy_time_patterns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    hour INT,
    shift_type VARCHAR(20),
    actual_demand DECIMAL(10,2),
    transaction_count INT,
    average_wait_time INT,
    staff_count INT,
    busy_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date_hour (date, hour)
);
