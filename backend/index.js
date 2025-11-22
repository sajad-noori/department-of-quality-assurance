const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const authRoutes = require("./routes/auth.route");
const newsRoutes = require("./routes/news.route");
const path = require("path");
const visitorRoutes = require("./routes/visitorRoutes");
const feedbackRoute = require("./routes/feedback.route");
const commentsRoutes = require("./routes/comments.route");
const docsRoutes = require("./routes/docs.route");
const docsCenterPublicRoutes = require("./routes/docs_center_public.routes");
const videosRoutes = require("./routes/video.route");
const educational_centers = require("./routes/educational_centers.route");
const usersRoutes = require("./routes/users.route");
const cookieParser = require("cookie-parser");
const personnelRoutes = require("./routes/personnel.route");
const studentRoutes = require("./routes/student.routes");
const layliaRoutes = require("./routes/laylia.routes");
const visionMissionRoutes = require("./routes/visionMission.routes");
const standardRoutes = require("./routes/standard.routes");
const departmentRoutes = require("./routes/department.routes");
const academyFacilityRoutes = require("./routes/academy_facility.routes");
const classFacilityRoutes = require("./routes/class_facility.routes");
const practicalFacilityRoutes = require("./routes/practical_facility.routes");
const stakeholderInvolvementRoutes = require("./routes/stakeholder_involvement.routes");
const documentRoutes = require("./routes/document.routes");
const profileDocumentRoutes = require("./routes/profile_document.routes");
const profileImageRoutes = require("./routes/profile_image.routes");
const stageRoutes = require("./routes/stage.routes");
const stepProgressRoutes = require("./routes/stepProgress.routes");
const questionsRoutes = require("./routes/questions.route");
const announcementRoutes = require("./routes/announcement.routes");
const questionnairesRoutes = require("./routes/questionnaires.routes");
const filledQuestionnaireRoutes = require("./routes/filled_questionnaire.routes");
const logsRoutes = require("./routes/logs.routes");

const fs = require("fs");

require("dotenv").config();

const app = express();

// Basic security headers
app.disable("x-powered-by");
app.use(helmet());

// Global rate limiter (adjust limits for your environment)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Compression for responses
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Remove port from origin for comparison
      const originWithoutPort = origin.replace(/:\d+$/, "");

      const allowedOrigins = [
        "http://localhost",
        "http://qa.tveta.edu.af",
        "https://qa.tveta.edu.af",
        "http://ca.tveta.edu.af",
        "https://ca.tveta.edu.af",
        "http://localhost:5000/",
      ];

      if (allowedOrigins.includes(originWithoutPort)) {
        // Return the exact origin that was requested (without modifying it)
        callback(null, origin);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Middleware
// Increase body parser size slightly for API JSON payloads; uploads still handled by multer
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, "uploads", "documents");
const profileUploadsDir = path.join(__dirname, "uploads", "profile");
const tempUploadsDir = path.join(__dirname, "uploads", "temp");

[uploadsDir, profileUploadsDir, tempUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Static files
// Serve uploads with reasonable caching headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      // Cache static assets for 1 day
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
  })
);
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "uploads/files"), {
    setHeaders: (res) =>
      res.setHeader("Cache-Control", "public, max-age=86400"),
  })
);
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads/videos"), {
    setHeaders: (res) =>
      res.setHeader("Cache-Control", "public, max-age=86400"),
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/feedback", feedbackRoute);
app.use("/api/news/:newsId/comments", commentsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/docs-center-and-uploads", docsCenterPublicRoutes);
app.use("/api/educational-centers", educational_centers);
app.use("/api/users", usersRoutes);
app.use("/api/media", videosRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/laylia", layliaRoutes);
app.use("/api/vision-mission", visionMissionRoutes);
app.use("/api/standards", standardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/academy-facilities", academyFacilityRoutes);
app.use("/api/class-facilities", classFacilityRoutes);
app.use("/api/practical-facilities", practicalFacilityRoutes);
app.use("/api/stakeholder-involvement", stakeholderInvolvementRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/profile-documents", profileDocumentRoutes);
app.use("/api", profileImageRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/step-progress", stepProgressRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/questionnaires", questionnairesRoutes);
app.use("/api/questionnaires", filledQuestionnaireRoutes);
app.use("/api/logs", logsRoutes);

// Trust proxy for rate limiting
app.set("trust proxy", 1);

const port = process.env.PORT || 5000;

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log("✅ Server is running on port " + port);
});
