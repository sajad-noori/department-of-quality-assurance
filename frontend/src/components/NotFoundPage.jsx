import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="notfound-wrapper" role="main" aria-label="404 Not Found Page">
        {/* Animated star layers */}
        <div className="nebula"></div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="shooting-stars" aria-hidden="true">
          <div className="shooting-star"></div>
          <div className="shooting-star delay1"></div>
          <div className="shooting-star delay2"></div>
        </div>

        <div className="notfound-card" tabIndex={-1}>
          <div className="notfound-illustration" aria-hidden="true">
            {/* Enhanced astronaut SVG with glow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="220"
              height="220"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <radialGradient
                  id="helmetGradient"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="30%"
                  fy="30%"
                >
                  <stop offset="0%" stopColor="#333" />
                  <stop offset="100%" stopColor="#000" />
                </radialGradient>
                <linearGradient
                  id="suitGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient
                  id="armGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" >
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#4fc3f7" floodOpacity="0.6"/>
                </filter>
              </defs>
              {/* Helmet */}
              <circle
                cx="256"
                cy="200"
                r="100"
                fill="url(#helmetGradient)"
                stroke="#44c4f7"
                strokeWidth="6"
                filter="url(#glow)"
              />
              {/* Helmet glass reflection */}
              <path
                d="M186 170 Q250 110 320 170"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              {/* Face */}
              <circle cx="256" cy="210" r="70" fill="#7F7F7F" />
              {/* Visor */}
              <ellipse
                cx="256"
                cy="210"
                rx="60"
                ry="45"
                fill="rgba(0,0,0,0.3)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              {/* Eyes */}
              <circle cx="220" cy="210" r="12" fill="#222" />
              <circle cx="292" cy="210" r="12" fill="#222" />
              {/* Mouth */}
              <rect
                x="225"
                y="260"
                width="60"
                height="8"
                rx="4"
                fill="#444"
                stroke="#222"
                strokeWidth="2"
              />
              {/* Suit body */}
              <rect
                x="190"
                y="280"
                width="132"
                height="150"
                rx="40"
                fill="url(#suitGradient)"
                stroke="#0fc7ff"
                strokeWidth="6"
                filter="url(#glow)"
              />
              {/* Chest panel */}
              <rect
                x="235"
                y="310"
                width="40"
                height="60"
                rx="12"
                fill="#00b0ff"
                stroke="#00f0ff"
                strokeWidth="3"
              />
              {/* Arms */}
              <ellipse
                cx="130"
                cy="350"
                rx="45"
                ry="75"
                fill="url(#armGradient)"
                stroke="#0fc7ff"
                strokeWidth="5"
                filter="url(#glow)"
              />
              <ellipse
                cx="380"
                cy="350"
                rx="45"
                ry="75"
                fill="url(#armGradient)"
                stroke="#0fc7ff"
                strokeWidth="5"
                filter="url(#glow)"
              />
              {/* Details */}
              <circle cx="256" cy="420" r="20" fill="#00e5ff" filter="url(#glow)" />
              <circle cx="256" cy="420" r="12" fill="#00b0ff" />
            </svg>
          </div>

          <h1 className="notfound-title">404</h1>
          <h2 className="notfound-subtitle">Lost in Space</h2>
          <p className="notfound-text">
          .Sorry the page that you are looking for does not exits
          </p>
          <button
            className="notfound-button"
            onClick={() => navigate("/")}
            aria-label="Return to home page"
          >
            🏠 Return to Earth
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

        /* Container */
        .notfound-wrapper {
          position: relative;
          min-height: 80vh;
          font-family: 'Roboto Mono', monospace;
          color: #d9f0ff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          overflow: hidden;
          background: #0a0a23;
          box-shadow: 0 0 120px rgba(15, 90, 140, 0.8);
        }

        /* Nebula glow behind stars */
        .nebula {
          position: absolute;
          top: -20%;
          left: -15%;
          width: 130%;
          height: 130%;
          background:
            radial-gradient(circle at 25% 25%, #2c75ff55 40%, transparent 70%),
            radial-gradient(circle at 75% 75%, #00ffff44 50%, transparent 80%);
          filter: blur(50px);
          z-index: 0;
          pointer-events: none;
          animation: nebulaPulse 15s ease-in-out infinite alternate;
        }

        @keyframes nebulaPulse {
          0% { filter: blur(40px) brightness(0.7); }
          100% { filter: blur(55px) brightness(1); }
        }

        /* Stars background */
        .stars {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(2px 2px at 20% 30%, #fff, transparent),
            radial-gradient(2px 2px at 40% 50%, #fff, transparent),
            radial-gradient(2px 2px at 70% 80%, #fff, transparent),
            radial-gradient(2px 2px at 80% 20%, #fff, transparent),
            radial-gradient(2px 2px at 90% 60%, #fff, transparent),
            radial-gradient(2px 2px at 10% 90%, #fff, transparent);
          background-repeat: repeat;
          background-size: 100px 100px;
          animation: starMove 180s linear infinite;
          opacity: 0.7;
          filter: drop-shadow(0 0 1.4px #bbfaff);
          z-index: 1;
          pointer-events: none;
        }

        /* Twinkling stars */
        .twinkling {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(1.3px 1.3px at 20% 25%, #fff, transparent),
            radial-gradient(1.3px 1.3px at 45% 55%, #fff, transparent),
            radial-gradient(1.3px 1.3px at 70% 75%, #fff, transparent),
            radial-gradient(1.3px 1.3px at 85% 40%, #fff, transparent);
          background-repeat: repeat;
          background-size: 50px 50px;
          animation: twinkle 6s ease-in-out infinite alternate;
          opacity: 0.85;
          z-index: 2;
          pointer-events: none;
        }

        @keyframes starMove {
          0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: -12000px 0, -12000px 0, -12000px 0, -12000px 0, -12000px 0, -12000px 0; }
        }

        @keyframes twinkle {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* Shooting stars container */
        .shooting-stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
          z-index: 3;
        }

        /* Shooting star style */
        .shooting-star {
          position: absolute;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #00e5ff, transparent);
          border-radius: 2px;
          top: 10%;
          left: -100px;
          opacity: 0.8;
          filter: drop-shadow(0 0 4px #00e5ff);
          transform: rotate(-25deg);
          animation: shootingStar 3.5s ease-in-out infinite;
        }

        /* Different delays for multiple shooting stars */
        .shooting-star.delay1 {
          top: 40%;
          animation-delay: 1.8s;
          width: 120px;
        }

        .shooting-star.delay2 {
          top: 70%;
          animation-delay: 3.6s;
          width: 100px;
        }

        @keyframes shootingStar {
          0% {
            left: -100px;
            opacity: 0.8;
          }
          30% {
            opacity: 1;
          }
          100% {
            left: 120%;
            opacity: 0;
          }
        }

        /* Card containing content */
        .notfound-card {
          position: relative;
          z-index: 10;
          background: #111b2edd;
          border-radius: 20px;
          padding: 40px 35px 50px 35px;
          box-shadow: 0 0 25px rgba(20, 70, 140, 0.6);
          max-width: 100%;
          text-align: center;
          user-select: none;
        }

        /* Astronaut container */
        .notfound-illustration {
          margin-bottom: 20px;
          filter: drop-shadow(0 0 8px #33bbffaa);
          transition: filter 0.3s ease;
        }
        .notfound-illustration:hover {
          filter: drop-shadow(0 0 14px #44ccff);
        }

        /* Main Title */
        .notfound-title {
          font-size: 7rem;
          font-weight: 700;
          margin: 0;
          line-height: 1;
          text-shadow: 0 0 10px #38bdf8cc;
          letter-spacing: 0.15em;
          color: #82e9ff;
          user-select: text;
        }

        /* Subtitle */
        .notfound-subtitle {
          font-size: 2.2rem;
          margin: 12px 0 15px 0;
          font-weight: 600;
          color: #a0dfffcc;
          text-shadow: 0 0 6px #4fc3f7aa;
          user-select: text;
        }

        /* Description Text */
        .notfound-text {
          font-size: 1.15rem;
          margin-bottom: 35px;
          color: #bbe8ffcc;
          line-height: 1.5;
          text-shadow: 0 0 4px #33aaffcc;
          user-select: text;
        }

        /* Return button */
        .notfound-button {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #bde4ff;
          font-weight: 600;
          font-size: 1.25rem;
          padding: 14px 34px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.9);
          transition: background 0.4s ease, box-shadow 0.4s ease;
          user-select: none;
          outline-offset: 4px;
          outline-color: transparent;
          outline-style: solid;
          outline-width: 3px;
          position: relative;
          overflow: hidden;
        }
        .notfound-button::before {
          content: "";
          position: absolute;
          top: -5px; left: -5px; right: -5px; bottom: -5px;
          border-radius: 50px;
          background: linear-gradient(90deg, #00e5ff, #007acc, #00e5ff);
          animation: glowingBorder 2.8s linear infinite;
          z-index: -1;
          opacity: 0.7;
          filter: blur(6px);
        }
        .notfound-button:hover,
        .notfound-button:focus {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 1);
          outline-color: #4fc3f7;
          outline-style: solid;
        }
        .notfound-button:active {
          transform: scale(0.98);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.7);
        }

        @keyframes glowingBorder {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .notfound-wrapper {
            max-width: 90vw;
            padding: 15px;
            border-radius: 20px;
          }
          .notfound-card {
            padding: 30px 20px 40px 20px;
          }
          .notfound-title {
            font-size: 5rem;
          }
          .notfound-subtitle {
            font-size: 1.6rem;
          }
          .notfound-text {
            font-size: 1rem;
          }
          .notfound-illustration svg {
            width: 160px;
            height: 160px;
          }
          .notfound-button {
            font-size: 1.05rem;
            padding: 12px 26px;
          }
        }
      `}</style>
    </>
  );
};

export default NotFound;
