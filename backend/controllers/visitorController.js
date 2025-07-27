const { promise } = require("../config/db");

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
async function recordVisit(req, res) {
  try {
    const { visitorId } = req.body;
    if (!visitorId)
      return res.status(400).json({ error: "visitorId required" });

    const visitorQuery = `
      INSERT INTO visitors (visitor_id, last_active)
      VALUES (?, NOW())
      ON DUPLICATE KEY UPDATE last_active = NOW()
    `;

    await promise.execute(visitorQuery, [visitorId]);

    await promise.execute(
      "INSERT INTO visits (visitor_id, visit_time) VALUES (?, NOW())",
      [visitorId]
    );

    res.json({ message: "Visit recorded" });
  } catch (error) {
    console.error("Error recording visit:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// GET /api/visitor-stats - return visitor stats
async function getVisitorStats(req, res) {
  try {
    const [activeRows] = await promise.execute(
      `SELECT COUNT(*) AS activeUsers FROM visitors WHERE last_active >= (NOW() - INTERVAL 15 MINUTE)`
    );

    const [totalRows] = await promise.execute(
      `SELECT COUNT(*) AS total FROM visits`
    );

    const [dailyRows] = await promise.execute(
      `SELECT COUNT(*) AS daily FROM visits WHERE visit_time >= CURDATE()`
    );

    const [weeklyRows] = await promise.execute(
      `SELECT COUNT(*) AS weekly FROM visits WHERE visit_time >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`
    );

    const [monthlyRows] = await promise.execute(
      `SELECT COUNT(*) AS monthly FROM visits WHERE visit_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`
    );

    res.json({
      activeUsers: activeRows[0].activeUsers,
      daily: dailyRows[0].daily,
      weekly: weeklyRows[0].weekly,
      monthly: monthlyRows[0].monthly,
      total: totalRows[0].total,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  recordVisit,
  getVisitorStats,
};
