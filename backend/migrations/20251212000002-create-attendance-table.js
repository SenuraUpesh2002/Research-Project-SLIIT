'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.runSql(`
    CREATE TABLE IF NOT EXISTS attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_email VARCHAR(100) NOT NULL,
        check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        check_out_time TIMESTAMP NULL,
        location_lat DECIMAL(10, 8) DEFAULT 0,
        location_lng DECIMAL(11, 8) DEFAULT 0,
        device_id VARCHAR(255),
        location_verified BOOLEAN DEFAULT FALSE,
        device_verified BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_employee_email (employee_email),
        INDEX idx_check_in_date (check_in_time)
    );
  `);
};

exports.down = function (db) {
    return db.runSql('DROP TABLE IF EXISTS attendance;');
};

exports._meta = {
    'version': 1
};
