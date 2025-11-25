const db = require('../config/db');

class FuelStock {
    static async getAll() {
        const sql = 'SELECT * FROM fuel_stocks ORDER BY id';
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async updateLevel(id, current_level) {
        const sql = 'UPDATE fuel_stocks SET current_level = ? WHERE id = ?';
        const [result] = await db.execute(sql, [current_level, id]);
        return result.affectedRows > 0;
    }
}

module.exports = FuelStock;
