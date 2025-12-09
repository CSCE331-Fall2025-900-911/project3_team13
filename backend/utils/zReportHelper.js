const pool = require('../db/pool');

/**
 * Check if a Z-report has already been generated for today
 */
async function hasZReportBeenGeneratedToday() {
    try {
        const client = await pool.connect();
        const query = `
            SELECT COUNT(*) as count 
            FROM z_reports 
            WHERE DATE(gen_time) = CURRENT_DATE
        `;
        const res = await client.query(query);
        client.release();
        
        return res.rows[0].count > 0;
    } catch (error) {
        console.error('Error checking Z-report status:', error);
        throw error;
    }
}

module.exports = {
    hasZReportBeenGeneratedToday
};
