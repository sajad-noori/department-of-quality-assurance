import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlay, FaSearch, FaCalendarAlt, FaTag } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const ITEMS_PER_PAGE = 12;

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { type } = useParams();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/media/videos");
        const data = await response.json();
        const filtered = data.filter(
          (video) =>
            video.category?.toLowerCase().replace(/\s+/g, "-") ===
            type.toLowerCase()
        );

        const mapped = filtered.map((video) => ({
          id: video.id,
          title: video.title,
          videoUrl: video.videoUrl,
          description: video.description,
          category: video.category,
          uploaded_at: video.uploaded_at
        }));

        setVideos(mapped);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [type]);

  const handleVideoClick = (video) => {
    navigate("/video", { state: { video } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری ویدیوها...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .dark-container {
          background: #121212;
          min-height: 100vh;
          color: #eee;
        }
        .light-container {
          background: #fff;
          min-height: 100vh;
          color: #222;
        }
        .dark-container .container {
          color: #fff;
        }
        .light-container .container {
          color: #222;
        }
        .dark-container .page-title {
          background: linear-gradient(45deg, #00d4ff, #0099cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        .light-container .page-title {
          background: linear-gradient(45deg, #0dcaf0, #20c997);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(13, 202, 240, 0.08);
        }
        .dark-container .page-subtitle {
          color: #a0a0a0;
        }
        .light-container .page-subtitle {
          color: #20c997;
        }
        .dark-container .search-input {
          background: rgba(255, 255, 255, 0.05);
          color: #eee;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .light-container .search-input {
          background: rgba(0, 0, 0, 0.03);
          color: #222;
          border: 2px solid #0dcaf0;
        }
        .light-container .search-input:focus {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.08);
          color: #222;
        }
        .light-container .search-input::placeholder {
          color: #888;
        }
        .dark-container .search-input::placeholder {
          color: #888;
        }
        .dark-container .video-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #eee;
        }
        .light-container .video-card {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid #0dcaf0;
          color: #222;
        }
        .light-container .video-card:hover {
          box-shadow: 0 20px 40px rgba(13, 202, 240, 0.12);
          border-color: #20c997;
        }
        .light-container .play-button {
          background: #0dcaf0;
        }
        .light-container .play-button:hover {
          background: #20c997;
        }
        .light-container .video-title {
          color: #222;
        }
        .light-container .video-description {
          color: #555;
        }
        .light-container .video-meta {
          color: #20c997;
        }
        .light-container .video-category {
          background: rgba(13, 202, 240, 0.08);
          color: #0dcaf0;
        }
        .light-container .pagination button {
          background: #fff;
          border: 1px solid #0dcaf0;
          color: #0dcaf0;
        }
        .light-container .pagination button:hover:not(:disabled) {
          background: #0dcaf0;
          color: #fff;
          border-color: #20c997;
        }
        .light-container .pagination .page-info {
          background: rgba(13, 202, 240, 0.08);
          color: #20c997;
        }
        .light-container .loading-container {
          color: #0dcaf0;
        }
        .light-container .loading-spinner {
          border: 3px solid #e0f7fa;
          border-top: 3px solid #0dcaf0;
        }
        body {
          background: #121212;
          margin: 0;
        }
        
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 2rem 1rem;
          color: white;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.8s ease-out;
        }
        
        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00d4ff, #0099cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        
        .page-subtitle {
          color: #a0a0a0;
          font-size: 1.1rem;
          margin: 0;
        }
        
        .search-container {
          position: relative;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #eee;
          outline: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .search-input:focus {
          border-color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
          font-size: 1.2rem;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
          color: #888;
          font-size: 1.1rem;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .video-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }
        
        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.3);
        }
        
        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        
        .video-thumbnail video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .video-card:hover .video-thumbnail video {
          transform: scale(1.1);
        }
        
        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(0, 212, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 2;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        }
        
        .play-button svg {
          color: white;
          font-size: 1.2rem;
          margin-left: 2px;
        }
        
        .video-card:hover .play-button {
          background: rgba(0, 212, 255, 1);
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 6px 25px rgba(0, 212, 255, 0.6);
        }
        
        .video-info {
          padding: 1.5rem;
        }
        
        .video-title {
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
          color: #eee;
          line-height: 1.4;
        }
        
        .video-description {
          color: #a0a0a0;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .video-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #888;
        }
        
        .video-category {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(0, 212, 255, 0.1);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          color: #00d4ff;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
        }
        
        .pagination button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #eee;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .pagination button:hover:not(:disabled) {
          background: rgba(0, 212, 255, 0.1);
          border-color: rgba(0, 212, 255, 0.3);
          color: #00d4ff;
        }
        
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-info {
          color: #a0a0a0;
          font-weight: 500;
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: #eee;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 2rem;
          }
          
          .grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .pagination {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
      <div className={theme === "light" ? "light-container" : "dark-container"}>
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">ویدیو های آموزشی</h1>
            <p className="page-subtitle">مجموعه کامل ویدیوهای آموزشی و تخصصی</p>
          </div>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="جستجوی ویدیو بر اساس عنوان یا توضیحات..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {filteredVideos.length === 0 && !isLoading && (
            <div className="no-results">
              {searchTerm ? 'هیچ ویدیویی با این جستجو یافت نشد.' : 'هیچ ویدیویی در این دسته موجود نیست.'}
            </div>
          )}

          {filteredVideos.length > 0 && (
            <div className="grid">
              {paginatedVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="video-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleVideoClick(video)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleVideoClick(video);
                    }
                  }}
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="video-thumbnail">
                    <video
                      src={video.videoUrl}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <div className="play-button">
                      <FaPlay />
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    {video.description && (
                      <p className="video-description">{video.description}</p>
                    )}
                    <div className="video-meta">
                      <span className="video-category">
                        <FaTag />
                        {video.category}
                      </span>
                      {video.uploaded_at && (
                        <span>
                          <FaCalendarAlt style={{ marginLeft: '0.3rem' }} />
                          {formatDate(video.uploaded_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => p - 1)} 
                disabled={currentPage === 1}
              >
                قبلی
              </button>
              <div className="page-info">
                صفحه {currentPage} از {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => p + 1)} 
                disabled={currentPage === totalPages}
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoGallery;
