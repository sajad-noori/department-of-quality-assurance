import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const formatUploadTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const formatUploadDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('fa-IR');
};

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(location.state?.video || null);
  const [videoDurations, setVideoDurations] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    if (!currentVideo) {
      navigate(-1);
      return;
    }
  }, [currentVideo?.id, navigate]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch("/api/media/videos");
        const data = await response.json();

        const currentCat = currentVideo.category?.toString().trim().toLowerCase();

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
        body {
          background: #121212;
                    margin: 0;
          color: #eee;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .page-container {
          display: flex;
          max-width: 1200px;
          margin: 2rem auto;
          gap: 2rem;
          padding: 0 1rem;
          flex-wrap: wrap;
        }
        .video-player-container {
          flex: 3 1 600px;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
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
          background: linear-gradient(45deg, #0dcaf0, #00b5d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(13, 202, 240, 0.2);
        }
        .video-description {
          margin-top: 0.7rem;
          color: #a9e5ff;
          font-size: 1.1rem;
          line-height: 1.6;
          white-space: pre-line;
        }
        .recommended-videos {
          flex: 1.5 1 300px;
          min-width: 260px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
          padding: 1.5rem 1rem 1rem 1rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s both;
        }
        .recommended-title {
          font-size: 1.3rem;
          font-weight: 900;
          margin-bottom: 1.2rem;
          color: #0dcaf0;
          border-bottom: 1px solid #0dcaf0;
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
          background: rgba(0,212,255,0.04);
          box-shadow: 0 1px 6px rgba(13,202,240,0.04);
        }
        .recommended-video-card:hover {
          background: rgba(13,202,240,0.10);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 16px rgba(13,202,240,0.10);
        }
        .recommended-video-thumb {
          width: 120px;
          height: 70px;
          background: black;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(13,202,240,0.08);
        }
        .recommended-video-info {
          flex: 1;
          color: #eee;
        }
        .recommended-video-title {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.3rem;
          color: #a9e5ff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recommended-video-meta {
          font-size: 0.9rem;
          color: #00b5d7;
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

      <div className="page-container">
        <div className="video-player-container">
          <video src={currentVideo.videoUrl} controls ref={videoRef} />
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
              <div className="recommended-video-info">
                <div className="recommended-video-title">{video.title}</div>
                <div className="recommended-video-meta">
                  مدت: {videoDurations[video.id] || "--:--"}
                  <br />
                  تاریخ: {formatUploadDate(video.uploadedAt || video.uploaded_at)}
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
};

export default VideoPlayer;
