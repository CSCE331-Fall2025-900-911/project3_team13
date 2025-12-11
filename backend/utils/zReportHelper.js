const pool = require('../db/pool');

/**
 * Check if a Z-report has already been generated for today
 */
async function hasZReportBeenGeneratedToday() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT COUNT(*) as count 
            FROM z_reports 
            WHERE DATE(gen_time) = CURRENT_DATE
        `;
        const res = await client.query(query);
        
        return res.rows[0].count > 0;
    } catch (error) {
        console.error('Error checking Z-report status:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    hasZReportBeenGeneratedToday
};
