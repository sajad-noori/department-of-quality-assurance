import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { type } = useParams();

  useEffect(() => {
    const fetchVideos = async () => {
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
        setCurrentPage(1); // Reset to first page on type change
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [type]);

  const handleVideoClick = (video) => {
    navigate("/video", { state: { video } });
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <style>{`
        body {
          background-color: #121212;
          margin: 0;
        }
        .container {
          max-width: 960px;
          margin: auto;
          padding: 2rem 1rem;
          color: white;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #444;
          background-color: #1e1e1e;
          color: #eee;
          outline: none;
          transition: border 0.3s ease;
        }
        .search-input::placeholder {
          color: #888;
        }
        .search-input:focus {
          border-color: #ff0000;
        }
        .video-card {
          background-color: #222;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.7);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
          outline: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .video-card:hover,
        .video-card:focus {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(255,255,255,0.2);
        }
        .video-card video {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          border-radius: 16px 16px 0 0;
          background: black;
        }
        .video-info {
          padding: 1rem;
          width: 100%;
        }
        .video-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin: 0;
          color: #eee;
          text-align: center;
        }
        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 0, 0, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
          z-index: 2;
          pointer-events: none;
        }
        .play-button svg {
          fill: white;
          width: 24px;
          height: 24px;
          margin-left: 4px;
        }
        .video-card:hover .play-button,
        .video-card:focus .play-button {
          background: rgba(255, 0, 0, 1);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          gap: 1rem;
        }
        .pagination button {
          background-color: #1e1e1e;
          border: 1px solid #444;
          color: #eee;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .pagination button:hover {
          background-color: #333;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="container">
        <h2 className="mb-4" style={{ textAlign: "center", fontSize: "2rem" }}>
          ویدیو های آموزشی
        </h2>

        <input
          type="text"
          className="search-input"
          placeholder="جستجوی ویدیو..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="grid">
          {paginatedVideos.map((video) => (
            <div
              key={video.id}
              className="video-card"
              tabIndex={0}
              role="button"
              onClick={() => handleVideoClick(video)}
            >
              <video
                src={video.videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="play-button" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoGallery;
