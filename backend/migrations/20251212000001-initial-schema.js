'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.runSql(`
    -- 1. Employees Table
    CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        role ENUM('attendant', 'supervisor', 'manager') NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        device_fingerprint VARCHAR(255),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
    );

    -- 2. Daily QR Codes Table
    CREATE TABLE IF NOT EXISTS daily_qr_codes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        qr_code_data TEXT NOT NULL,
        station_id INT NOT NULL,
        valid_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
    );

    -- 3. Check-ins Table
    CREATE TABLE IF NOT EXISTS check_ins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        check_out_time TIMESTAMP NULL,
        shift_type ENUM('morning', 'afternoon', 'evening') NOT NULL,
        location_validated BOOLEAN DEFAULT FALSE,
        device_validated BOOLEAN DEFAULT FALSE,
        qr_code_id INT,
        status ENUM('active', 'completed') DEFAULT 'active',
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (qr_code_id) REFERENCES daily_qr_codes(id)
    );

    -- 4. Fuel Stocks Table
    CREATE TABLE IF NOT EXISTS fuel_stocks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fuel_type ENUM('petrol', 'diesel', 'super_diesel', 'petrol_95') NOT NULL,
        current_level DECIMAL(10, 2) NOT NULL,
        capacity DECIMAL(10, 2) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        sensor_id VARCHAR(50),
        station_id INT NOT NULL
    );

    -- 5. Fuel Transactions Table
    CREATE TABLE IF NOT EXISTS fuel_transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fuel_type VARCHAR(50) NOT NULL,
        amount_dispensed DECIMAL(10, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        shift_type VARCHAR(20),
        station_id INT NOT NULL
    );

    -- 6. Demand Predictions Table
    CREATE TABLE IF NOT EXISTS demand_predictions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        prediction_date DATE NOT NULL,
        shift_type VARCHAR(20) NOT NULL,
        predicted_demand DECIMAL(10, 2) NOT NULL,
        confidence_score DECIMAL(5, 4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. Staffing Recommendations Table
    CREATE TABLE IF NOT EXISTS staffing_recommendations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        prediction_date DATE NOT NULL,
        shift_type VARCHAR(20) NOT NULL,
        predicted_demand DECIMAL(10, 2) NOT NULL,
        recommended_staff INT NOT NULL,
        confidence VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = function (db) {
    return db.runSql(`
    DROP TABLE IF EXISTS check_ins;
    DROP TABLE IF EXISTS staffing_recommendations;
    DROP TABLE IF EXISTS demand_predictions;
    DROP TABLE IF EXISTS fuel_transactions;
    DROP TABLE IF EXISTS fuel_stocks;
    DROP TABLE IF EXISTS daily_qr_codes;
    DROP TABLE IF EXISTS employees;
  `);
};

exports._meta = {
    'version': 1
};
