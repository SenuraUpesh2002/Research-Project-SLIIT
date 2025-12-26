const cron = require('node-cron');
const db = require('../config/db');

const setupAutoCheckout = () => {
    // Run every minute to check for shifts exceeding 8 hours
    cron.schedule('* * * * *', async () => {
        try {
            console.log('Running auto-checkout job...');

            // Calculate time 8 hours ago
            // We want to find records where check_in_time < col - 8 hours
            // And check_out_time is NULL

            // In SQL: check_in_time <= DATE_SUB(NOW(), INTERVAL 8 HOUR)

            const [records] = await db.execute(
                `SELECT id, check_in_time, employee_email 
                 FROM attendance 
                 WHERE check_out_time IS NULL 
                 AND check_in_time <= DATE_SUB(NOW(), INTERVAL 8 HOUR)`
            );

            if (records.length > 0) {
                console.log(`Found ${records.length} records to auto-checkout.`);

                for (const record of records) {
                    // Calculate auto checkout time: check_in_time + 8 hours
                    const checkInTime = new Date(record.check_in_time);
                    const autoCheckoutTime = new Date(checkInTime.getTime() + 8 * 60 * 60 * 1000);

                    await db.execute(
                        'UPDATE attendance SET check_out_time = ? WHERE id = ?',
                        [autoCheckoutTime, record.id]
                    );

                    console.log(`Auto-checked out ${record.employee_email} (ID: ${record.id}) at ${autoCheckoutTime}`);
                }
            }
        } catch (error) {
            console.error('Error in auto-checkout cron job:', error);
        }
    });
};

module.exports = setupAutoCheckout;
