const db = require('../config/db');

class CheckIn {
    // Get today's active check-ins from attendance table
    static async getTodayActiveCheckIns() {
        const sql = `
      SELECT 
        a.id,
        a.employee_email as email,
        r.name as full_name,
        a.employee_email as emp_code,
        'attendant' as role,
        a.check_in_time,
        CASE 
          WHEN HOUR(a.check_in_time) < 14 THEN 'morning'
          WHEN HOUR(a.check_in_time) < 22 THEN 'afternoon'
          ELSE 'evening'
        END as shift_type,
        'active' as status
      FROM attendance a 
      JOIN registration r ON a.employee_email = r.email 
      WHERE DATE(a.check_in_time) = CURDATE()
      AND a.check_out_time IS NULL
      ORDER BY a.check_in_time ASC
    `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = CheckIn;
