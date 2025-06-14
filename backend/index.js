const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/auth.route');
const newsRoutes = require('./routes/news.route');
const path = require('path');
const visitorRoutes = require("./routes/visitorRoutes");
const feedbackRoute = require('./routes/feedback.route');
const commentsRoutes = require('./routes/comments.route');
const docsRoutes = require("./routes/docs.route");
const videosRoutes = require("./routes/video.route")
const educational_centers = require("./routes/educational_centers.route")
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use("/api", visitorRoutes);
app.use('/api/feedback', feedbackRoute);
app.use('/api/news/:newsId/comments', commentsRoutes);

app.use("/api/docs-center-and-uploads", docsRoutes);
app.use("/uploads/files", express.static(path.join(__dirname, "uploads/files"))); 
app.use("/api", docsRoutes);

// profile
app.use("/api", educational_centers);

app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));
app.use('/api/media', videosRoutes);



app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('✅ Server is running on port 5000');
});
