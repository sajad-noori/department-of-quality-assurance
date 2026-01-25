import React from 'react';

const NewsSkeleton = () => {
  return (
    <div className="news-card skeleton">
      <div className="skeleton-image"></div>
      <div className="news-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-date"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-link"></div>
      </div>
      
      <style>{`
        .news-card.skeleton {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }

        .skeleton-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        .news-info {
          padding: 1.5rem;
        }

        .skeleton-title {
          width: 80%;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-date {
          width: 40%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .skeleton-description {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-description:last-of-type {
          width: 60%;
        }

        .skeleton-link {
          width: 120px;
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-top: 1rem;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Dark mode skeleton */
        @media (prefers-color-scheme: dark) {
          .news-card.skeleton {
            background: #1a1a1a;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          }

          .skeleton-image,
          .skeleton-title,
          .skeleton-date,
          .skeleton-description,
          .skeleton-link {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 200% 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsSkeleton;
