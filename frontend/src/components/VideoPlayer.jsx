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

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(location.state?.video || null);
  const [videoDurations, setVideoDurations] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
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

  useEffect(() => {
    if (!currentVideo) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/media/${currentVideo.id}/comments`
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments:", res.status);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [currentVideo.id]);

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    window.scrollTo(0, 0);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      console.error("User not logged in or missing ID.");
      return;
    }

    const body = {
      userId: user.id,
      comment: newComment.trim(),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/media/${currentVideo.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        const savedComment = await res.json();
        const refreshedCommentsRes = await fetch(
          `http://localhost:5000/api/media/${currentVideo.id}/comments`
        );
        if (refreshedCommentsRes.ok) {
          const refreshedComments = await refreshedCommentsRes.json();
          setComments(refreshedComments);
        } else {
          setComments((prev) => [...prev, savedComment]);
        }
        setNewComment("");
      } else {
        console.error("Failed to post comment. Server responded with:", res.status);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  if (!currentVideo) return null;

  return (
    <>
      <style>{`
        body {
          background-color: #121212;
          margin: 0;
          color: white;
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
        }
        video {
          width: 100%;
          border-radius: 12px;
          background: black;
          max-height: 600px;
        }
        .video-title {
          margin-top: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .video-description {
          margin-top: 0.5rem;
          color: #bbb;
          font-size: 1rem;
          line-height: 1.4;
          white-space: pre-line;
        }
        .video-meta {
          display: none;
        }
        .comments-section {
          margin-top: 2rem;
        }
        .comments-section textarea {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: none;
          resize: vertical;
        }
        .comments-section button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: #444;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .comment {
          background: #1e1e1e;
          padding: 0.5rem;
          border-radius: 6px;
          margin-top: 0.5rem;
        }
        .recommended-videos {
          flex: 1.5 1 300px;
        }
        .recommended-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border-bottom: 1px solid #444;
          padding-bottom: 0.5rem;
        }
        .recommended-video-card {
          display: flex;
          margin-bottom: 1rem;
          cursor: pointer;
          gap: 1rem;
          align-items: flex-start;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          padding: 0.5rem;
          background-color: #1a1a1a;
        }
        .recommended-video-card:hover {
          background-color: #222;
        }
        .recommended-video-thumb {
          width: 120px;
          height: 70px;
          background: black;
          border-radius: 8px;
          object-fit: cover;
        }
        .recommended-video-info {
          flex: 1;
          color: #ddd;
        }
        .recommended-video-title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.3rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recommended-video-meta {
          font-size: 0.8rem;
          color: #999;
          white-space: pre-line;
        }
      `}</style>

      <div className="page-container">
        <div className="video-player-container">
          <video src={currentVideo.videoUrl} controls ref={videoRef} />
          <div className="video-title">{currentVideo.title}</div>
          <div className="video-description">{currentVideo.description}</div>

          <div className="comments-section">
            <h3>Comments</h3>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>

            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <b>{JSON.parse(localStorage.getItem("user")).name || "User"}:</b>{" "}
                {comment.comment}
              </div>
            ))}
          </div>
        </div>

        <aside className="recommended-videos">
          <h3 className="recommended-title">Recommended Videos</h3>
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
                  Duration: {videoDurations[video.id] || "--:--"}{"\n"}
                  Uploaded: {formatUploadTime(video.uploadedAt)}
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
