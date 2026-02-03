import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};



const formatUploadDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("fa-IR");
};

const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /youtube\.com|youtu\.be/i.test(url);
};

const toYouTubeEmbed = (url) => {
  if (!url) return url;
  const idMatch = url.match(/(?:v=|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  const id = idMatch ? idMatch[1] : null;
  if (id) return `https://www.youtube.com/embed/${id}`;
  if (url.includes("watch")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  return url;
};

const youtubeThumbnail = (url) => {
  if (!url) return "";
  const idMatch = url.match(/(?:v=|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  const id = idMatch ? idMatch[1] : null;
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return "";
};

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(
    location.state?.video || null
  );
  const [videoDurations, setVideoDurations] = useState({});
  const [isYouTubeLoading, setIsYouTubeLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!currentVideo) {
      navigate(-1);
      return;
    }
    
    // Set YouTube loading state when video changes
    if (isYouTubeUrl(currentVideo.videoUrl)) {
      setIsYouTubeLoading(true);
    }
  }, [currentVideo, navigate]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/media/videos`);
        const data = await response.json();

        const currentCat = currentVideo.category
          ?.toString()
          .trim()
          .toLowerCase();

        const recVideos = data
          .filter((video) => {
            if (!video.category) return false;
            const videoCat = video.category.toString().trim().toLowerCase();
            const videoId = video.id?.toString();
            const currentId = currentVideo.id?.toString();
            return videoCat === currentCat && videoId !== currentId;
          })
          .slice(0, 10);

        setRecommendedVideos(recVideos);
      } catch (err) {
        console.error("Error fetching recommended videos:", err);
      }
    };

    if (currentVideo) {
      fetchRecommended();
    }
  }, [currentVideo]);

  useEffect(() => {
    recommendedVideos.forEach((video) => {
      // Skip duration calculation for YouTube videos
      if (isYouTubeUrl(video.videoUrl)) {
        setVideoDurations((prev) => ({
          ...prev,
          [video.id]: "YouTube",
        }));
        return;
      }

      const vid = document.createElement("video");
      vid.src = video.videoUrl;
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        setVideoDurations((prev) => ({
          ...prev,
          [video.id]: formatDuration(vid.duration),
        }));
      };
    });
  }, [recommendedVideos]);

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    window.scrollTo(0, 0);
  };

  if (!currentVideo) return null;

  return (
    <>
      <style>{`
        .dark-container {
          background: #121212;
          color: #eee;
        }
        .light-container {
          background: #fff;
          color: #222;
        }
        .dark-container .page-container {
          color: #eee;
        }
        .light-container .page-container {
          color: #222;
        }
        .dark-container .video-player-container {
          background: rgba(255,255,255,0.05);
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
        }
        .light-container .video-player-container {
          background: rgba(0,0,0,0.03);
          box-shadow: 0 8px 32px rgba(13, 202, 240, 0.08);
        }
        .light-container .video-title {
          background: linear-gradient(45deg, #0dcaf0, #20c997);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(13, 202, 240, 0.08);
        }
        .dark-container .video-title {
          background: linear-gradient(45deg, #0dcaf0, #00b5d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(13, 202, 240, 0.2);
        }
        .light-container .video-description {
          color: #555;
        }
        .dark-container .video-description {
          color: #a9e5ff;
        }
        .light-container .recommended-videos {
          background: rgba(0,0,0,0.03);
          box-shadow: 0 8px 32px rgba(13, 202, 240, 0.08);
        }
        .dark-container .recommended-videos {
          background: rgba(255,255,255,0.05);
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
        }
        .light-container .recommended-title {
          color: #0dcaf0;
          border-bottom: 1px solid #0dcaf0;
        }
        .dark-container .recommended-title {
          color: #0dcaf0;
          border-bottom: 1px solid #0dcaf0;
        }
        .light-container .recommended-video-card {
          background: rgba(13,202,240,0.04);
          box-shadow: 0 1px 6px rgba(13,202,240,0.04);
        }
        .dark-container .recommended-video-card {
          background: rgba(0,212,255,0.04);
          box-shadow: 0 1px 6px rgba(13,202,240,0.04);
        }
        .light-container .recommended-video-card:hover {
          background: rgba(13,202,240,0.10);
          box-shadow: 0 4px 16px rgba(13,202,240,0.10);
        }
        .dark-container .recommended-video-card:hover {
          background: rgba(13,202,240,0.10);
          box-shadow: 0 4px 16px rgba(13,202,240,0.10);
        }
        .light-container .recommended-video-title {
          color: #0dcaf0;
        }
        .dark-container .recommended-video-title {
          color: #a9e5ff;
        }
        .light-container .recommended-video-meta {
          color: #20c997;
        }
        .dark-container .recommended-video-meta {
          color: #00b5d7;
        }
        .page-container {
          display: flex;
          max-width: 1200px;
          margin: 0rem auto;
          gap: 2rem;
          padding: 0 1rem;
          flex-wrap: wrap;
        }
        .video-player-container {
          flex: 3 1 600px;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          padding: 2rem 2rem 1.5rem 2rem;
          backdrop-filter: blur(10px);
          min-width: 320px;
          animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        video {
          width: 100%;
          border-radius: 16px;
          background: black;
          max-height: 600px;
          box-shadow: 0 4px 24px rgba(13,202,240,0.10);
        }
        .video-title {
          margin-top: 1.5rem;
          font-size: 2rem;
          font-weight: 900;
        }
        .video-description {
          margin-top: 0.7rem;
          font-size: 1.1rem;
          line-height: 1.6;
          white-space: pre-line;
        }
        .recommended-videos {
          flex: 1.5 1 300px;
          min-width: 260px;
          border-radius: 20px;
          padding: 1.5rem 1rem 1rem 1rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s both;
        }
        .recommended-title {
          font-size: 1.3rem;
          font-weight: 900;
          margin-bottom: 1.2rem;
          padding-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        .recommended-video-card {
          display: flex;
          margin-bottom: 1.1rem;
          cursor: pointer;
          gap: 1rem;
          align-items: flex-start;
          border-radius: 12px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          padding: 0.5rem;
        }
        .recommended-video-card:hover {
          transform: translateY(-2px) scale(1.02);
        }
        .recommended-video-thumb {
          width: 120px;
          height: 70px;
          background: black;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(13,202,240,0.08);
        }
        
        .recommended-video-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        .recommended-video-info {
          flex: 1;
        }
        .recommended-video-title {
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.2;
          max-height: 2.4em;
        }
        .recommended-video-meta {
          font-size: 0.9rem;
          white-space: pre-line;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .page-container {
            flex-direction: column;
            gap: 2rem;
          }
          .video-player-container, .recommended-videos {
            min-width: 0;
            width: 100%;
            padding: 1.2rem 0.5rem;
          }
        }
        @media (max-width: 600px) {
          .video-title {
            font-size: 1.2rem;
          }
          .video-player-container, .recommended-videos {
            padding: 0.7rem 0.2rem;
          }
          .recommended-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="page-container">
          <div className="video-player-container">
            {isYouTubeUrl(currentVideo.videoUrl) ? (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  background: `black url(${youtubeThumbnail(currentVideo.videoUrl)}) center/cover no-repeat`,
                }}
              >
                {isYouTubeLoading && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0, 0, 0, 0.7)",
                      zIndex: 10,
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        border: "3px solid rgba(255, 255, 255, 0.1)",
                        borderTop: "3px solid #0dcaf0",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginBottom: "1rem",
                      }}
                    />
                    <div
                      style={{
                        color: theme === "light" ? "#222" : "#fff",
                        fontSize: "1rem",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      در حال بارگذاری ویدیوی YouTube...
                    </div>
                  </div>
                )}
                <iframe
                  title={`player-${currentVideo.id}`}
                  src={toYouTubeEmbed(currentVideo.videoUrl)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: 12,
                  }}
                  allowFullScreen
                  onLoad={() => setIsYouTubeLoading(false)}
                />
              </div>
            ) : (
              <video src={currentVideo.videoUrl} controls ref={videoRef} />
            )}
            <div className="video-title">{currentVideo.title}</div>
            <div className="video-description">{currentVideo.description}</div>
          </div>

          <aside className="recommended-videos">
            <h3 className="recommended-title">ویدیوهای پیشنهادی</h3>
            {recommendedVideos.map((video) => (
              <div
                key={video.id}
                className="recommended-video-card"
                onClick={() => handleVideoSelect(video)}
              >
                {isYouTubeUrl(video.videoUrl) ? (
                  <img
                    className="recommended-video-thumb"
                    src={youtubeThumbnail(video.videoUrl)}
                    alt={video.title}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <video
                    className="recommended-video-thumb"
                    src={video.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className="recommended-video-info">
                  <div className="recommended-video-title">{video.title}</div>
                  <div className="recommended-video-meta">
                    {videoDurations[video.id] === "YouTube" ? (
                      <>
                        منبع: YouTube
                        <br />
                        تاریخ:{" "}
                        {formatUploadDate(
                          video.uploadedAt || video.uploaded_at
                        )}
                      </>
                    ) : (
                      <>
                        مدت: {videoDurations[video.id] || "--:--"}
                        <br />
                        تاریخ:{" "}
                        {formatUploadDate(
                          video.uploadedAt || video.uploaded_at
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
