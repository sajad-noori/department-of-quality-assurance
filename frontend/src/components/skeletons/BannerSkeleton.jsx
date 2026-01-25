import React from 'react';

const BannerSkeleton = () => {
  return (
    <section className="banner-skeleton" dir="rtl">
      <div className="banner-skeleton__content">
        <div className="banner-skeleton__text">
          <div className="banner-skeleton__subtitle"></div>
          <div className="banner-skeleton__title"></div>
          <div className="banner-skeleton__typed"></div>
          <div className="banner-skeleton__description"></div>
          <div className="banner-skeleton__list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="banner-skeleton__list-item">
                <div className="banner-skeleton__icon"></div>
                <div className="banner-skeleton__item-text"></div>
              </div>
            ))}
          </div>
          <div className="banner-skeleton__buttons">
            <div className="banner-skeleton__button"></div>
            <div className="banner-skeleton__button banner-skeleton__button--outline"></div>
          </div>
        </div>
        <div className="banner-skeleton__image-wrapper">
          <div className="banner-skeleton__image"></div>
          <div className="banner-skeleton__progress">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="banner-skeleton__dot"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="banner-skeleton__stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="banner-skeleton__stat">
            <div className="banner-skeleton__stat-icon"></div>
            <div className="banner-skeleton__stat-text"></div>
          </div>
        ))}
      </div>
      
      <style>{`
        .banner-skeleton {
          background-color: #121212;
          color: #eee;
          padding: 3rem 1rem 8rem;
          box-sizing: border-box;
          min-height: 550px;
          position: relative;
          overflow: hidden;
        }

        .banner-skeleton__content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .banner-skeleton__text {
          flex: 1 1 480px;
          min-width: 280px;
          max-width: 600px;
          text-align: right;
          z-index: 2;
        }

        .banner-skeleton__subtitle {
          width: 200px;
          height: 20px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .banner-skeleton__title {
          width: 350px;
          height: 60px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .banner-skeleton__typed {
          width: 250px;
          height: 40px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 1.2rem;
        }

        .banner-skeleton__description {
          width: 400px;
          height: 60px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 2rem;
        }

        .banner-skeleton__list-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.8rem;
          gap: 0.5rem;
        }

        .banner-skeleton__icon {
          width: 22px;
          height: 22px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .banner-skeleton__item-text {
          width: 200px;
          height: 20px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .banner-skeleton__buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .banner-skeleton__button {
          width: 150px;
          height: 45px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 6px;
        }

        .banner-skeleton__button--outline {
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        .banner-skeleton__image-wrapper {
          flex: 1 1 400px;
          position: relative;
          max-width: 600px;
          min-width: 280px;
          height: 350px;
          overflow: visible;
          user-select: none;
          perspective: 1000px;
        }

        .banner-skeleton__image {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 12px;
        }

        .banner-skeleton__progress {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .banner-skeleton__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        .banner-skeleton__stats {
          max-width: 1200px;
          margin: 3rem auto 0 auto;
          padding: 1.5rem;
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .banner-skeleton__stat {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 140px;
          justify-content: center;
        }

        .banner-skeleton__stat-icon {
          width: 28px;
          height: 28px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 50%;
        }

        .banner-skeleton__stat-text {
          width: 120px;
          height: 20px;
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .banner-skeleton__content {
            flex-direction: column-reverse;
            gap: 2rem;
            text-align: center;
          }
          .banner-skeleton__text {
            flex: none;
            max-width: 100%;
            min-width: auto;
          }
          .banner-skeleton__image-wrapper {
            flex: none;
            max-width: 100%;
            min-width: auto;
            height: 280px;
          }
        }

        @media (max-width: 768px) {
          .banner-skeleton__stats {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
          .banner-skeleton__stat {
            min-width: auto;
            flex-direction: column;
            text-align: center;
            gap: 0.3rem;
          }
        }

        @media (max-width: 480px) {
          .banner-skeleton__image-wrapper {
            display: none;
          }
          .banner-skeleton__buttons {
            flex-direction: column;
            align-items: center;
          }
          .banner-skeleton__button {
            width: 200px;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerSkeleton;
