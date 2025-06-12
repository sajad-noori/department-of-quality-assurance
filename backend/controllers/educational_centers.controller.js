const db = require("../config/db");

exports.saveCenter = (req, res) => {
  const {
    centerName,
    province,
    district,
    village,
    centerType,
    programType,
    foundingYear,
    contactName,
    phoneNumber,
    email,
  } = req.body;

  const sql = `
    INSERT INTO educational_centers 
    (centerName, province, district, village, centerType, programType, foundingYear, contactName, phoneNumber, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [centerName, province, district, village, centerType, programType, foundingYear, contactName, phoneNumber, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "خطا در ذخیره‌سازی اطلاعات" });
    }
    console.log("message saved")
    res.status(201).json({ message: "مرکز آموزشی با موفقیت ذخیره شد" });

  });
};
