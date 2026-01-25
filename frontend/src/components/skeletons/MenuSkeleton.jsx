import React from 'react';

const MenuSkeleton = () => {
  return (
    <>
      <div className="menu-skeleton__utility-bar" dir="rtl">
        <div className="menu-skeleton__social-icons">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="menu-skeleton__social-icon"></div>
          ))}
        </div>
        <div className="menu-skeleton__language-options">
          <div className="menu-skeleton__translate"></div>
        </div>
        <div className="menu-skeleton__right-options">
          <div className="menu-skeleton__login-btn"></div>
          <div className="menu-skeleton__email">
            <div className="menu-skeleton__email-icon"></div>
            <div className="menu-skeleton__email-text"></div>
          </div>
        </div>
      </div>

      <nav className="menu-skeleton__navbar" dir="rtl">
        <div className="menu-skeleton__logo menu-skeleton__logo-left"></div>
        <div className="menu-skeleton__toggle">
          <div className="menu-skeleton__bar"></div>
          <div className="menu-skeleton__bar"></div>
          <div className="menu-skeleton__bar"></div>
        </div>
        <ul className="menu-skeleton__menu">
          {[...Array(6)].map((_, i) => (
            <li key={i} className="menu-skeleton__menu-item">
              <div className="menu-skeleton__menu-link"></div>
            </li>
          ))}
        </ul>
        <div className="menu-skeleton__logo menu-skeleton__logo-right"></div>
      </nav>

      <style>{`
        .menu-skeleton__utility-bar {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          padding: 0.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
        }

        .menu-skeleton__social-icons {
          display: flex;
          gap: 1rem;
        }

        .menu-skeleton__social-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .menu-skeleton__language-options {
          width: 150px;
          height: 30px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .menu-skeleton__right-options {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .menu-skeleton__login-btn {
          width: 80px;
          height: 35px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 6px;
        }

        .menu-skeleton__email {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu-skeleton__email-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .menu-skeleton__email-text {
          width: 200px;
          height: 20px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .menu-skeleton__navbar {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .menu-skeleton__logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 8px;
        }

        .menu-skeleton__toggle {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 30px;
        }

        .menu-skeleton__bar {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 2px;
        }

        .menu-skeleton__menu {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 2rem;
        }

        .menu-skeleton__menu-item {
          display: flex;
          align-items: center;
        }

        .menu-skeleton__menu-link {
          width: 100px;
          height: 20px;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
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

        /* Light mode skeleton */
        @media (prefers-color-scheme: light) {
          .menu-skeleton__utility-bar,
          .menu-skeleton__navbar {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
          }

          .menu-skeleton__social-icon,
          .menu-skeleton__language-options,
          .menu-skeleton__login-btn,
          .menu-skeleton__email-icon,
          .menu-skeleton__email-text,
          .menu-skeleton__logo,
          .menu-skeleton__bar,
          .menu-skeleton__menu-link {
            background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
            background-size: 200% 100%;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .menu-skeleton__utility-bar {
            padding: 0.5rem 1rem;
          }

          .menu-skeleton__navbar {
            padding: 1rem;
          }

          .menu-skeleton__menu {
            display: none;
          }

          .menu-skeleton__email-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default MenuSkeleton;
