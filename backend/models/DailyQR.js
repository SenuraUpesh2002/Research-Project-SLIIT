const db = require('../config/db');

class DailyQR {
    static async create(qrData) {
        const { qr_code_data, station_id, valid_date, expires_at } = qrData;
        const sql = `
      INSERT INTO daily_qr_codes 
      (qr_code_data, station_id, valid_date, expires_at) 
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.execute(sql, [qr_code_data, station_id, valid_date, expires_at]);
        return result.insertId;
    }

    static async findByDate(date) {
        const sql = 'SELECT * FROM daily_qr_codes WHERE valid_date = ? ORDER BY created_at DESC LIMIT 1';
        const [rows] = await db.execute(sql, [date]);
        return rows[0];
    }

    static async findById(id) {
        const sql = 'SELECT * FROM daily_qr_codes WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
}

module.exports = DailyQR;
