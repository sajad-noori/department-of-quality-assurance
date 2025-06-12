const connection = require('../config/db');

function getStartOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getStartOfWeek(date = new Date()) {
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

function getStartOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// POST /api/visit - record a visit
function recordVisit(req, res) {
  const { visitorId } = req.body;
  if (!visitorId) return res.status(400).json({ error: 'visitorId required' });

  const visitorQuery = `
    INSERT INTO visitors (visitor_id, last_active)
    VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE last_active = NOW()
  `;

  connection.query(visitorQuery, [visitorId], (err) => {
    if (err) {
      console.error('Error inserting/updating visitor:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    connection.query(
      'INSERT INTO visits (visitor_id, visit_time) VALUES (?, NOW())',
      [visitorId],
      (err2) => {
        if (err2) {
          console.error('Error inserting visit:', err2);
          return res.status(500).json({ error: 'Server error' });
        }
        res.json({ message: 'Visit recorded' });
      }
    );
  });
}

// GET /api/visitor-stats - return visitor stats
function getVisitorStats(req, res) {
  // Use Promise wrapper to avoid callback hell
  const queryAsync = (sql) =>
    new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

  (async () => {
    try {
      const activeRows = await queryAsync(
        `SELECT COUNT(*) AS activeUsers FROM visitors WHERE last_active >= (NOW() - INTERVAL 15 MINUTE)`
      );

      const totalRows = await queryAsync(
        `SELECT COUNT(DISTINCT visitor_id) AS total FROM visits`
      );

      const dailyRows = await queryAsync(
        `SELECT COUNT(DISTINCT visitor_id) AS daily FROM visits WHERE visit_time >= CURDATE()`
      );

      const weeklyRows = await queryAsync(
        `SELECT COUNT(DISTINCT visitor_id) AS weekly FROM visits WHERE visit_time >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`
      );

      const monthlyRows = await queryAsync(
        `SELECT COUNT(DISTINCT visitor_id) AS monthly FROM visits WHERE visit_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`
      );

      res.json({
        activeUsers: activeRows[0].activeUsers,
        daily: dailyRows[0].daily,
        weekly: weeklyRows[0].weekly,
        monthly: monthlyRows[0].monthly,
        total: totalRows[0].total,
      });
    } catch (err) {
      console.error('Error fetching visitor stats:', err);
      res.status(500).json({ error: 'Server error' });
    }
  })();
}

module.exports = {
  recordVisit,
  getVisitorStats,
};
