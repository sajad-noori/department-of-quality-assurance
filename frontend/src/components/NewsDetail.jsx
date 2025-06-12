// NewsDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    axios.get(`/api/news/${id}`)
      .then(res => setNews(res.data))
      .catch(err => console.error("Failed to fetch news detail", err));
  }, [id]);

  useEffect(() => {
    axios.get(`/api/news`)
      .then(res => {
        const filtered = res.data.filter(item => item.id !== Number(id));
        setOtherNews(filtered);
      })
      .catch(err => console.error("Failed to fetch other news", err));
  }, [id]);

  if (!news) return <p>در حال بارگذاری...</p>;

  return (
    <section className="news-section">
      <style>{`
        .news-section {
          min-height: 100vh;
          padding: 40px 20px;
          background-color: #f9f9f9;
          color: #000 !important;
        }
        .news-section * {
          color: #000 !important;
        }
        .news-container {
          display: flex;
          flex-direction: row-reverse;
          gap: 30px;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .news-image-box {
          flex: 1;
          max-width: 45%;
          position: relative;
          cursor: zoom-in;
        }
        .news-image {
          width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: cover;
          border: 4px solid #ccc;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .news-image:hover {
          transform: scale(1.03);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
        }
        .zoomed-image {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 90vw;
          max-height: 90vh;
          z-index: 9999;
          border: 6px solid #fff;
          border-radius: 10px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
          background-color: #fff;
          cursor: zoom-out;
        }
        .news-content-box {
          flex: 1;
          max-width: 50%;
        }
        .news-heading {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        .news-date {
          font-size: 1rem;
          margin-bottom: 15px;
        }
        .news-description {
          font-size: 1.2rem;
          margin-bottom: 20px;
          text-align: justify;
        }
        .news-content {
          line-height: 1.8;
          font-size: 1.1rem;
          text-align: justify;
        }
        .news-link {
          color: #007BFF;
          text-decoration: none;
        }
        .news-link:hover {
          text-decoration: underline;
        }
        .news-other {
          margin-top: 50px;
        }
        .news-other h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }
        ul {
          padding-right: 20px;
        }
        ul li {
          margin-bottom: 12px;
          font-size: 1.1rem;
        }
        .back-link {
          display: block;
          margin-top: 40px;
          text-align: center;
          color: #007BFF;
        }
        @media (max-width: 768px) {
          .news-container {
            flex-direction: column;
            align-items: center;
          }
          .news-image-box,
          .news-content-box {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="news-container">
        <div className="news-image-box" onClick={() => setZoomed(true)}>
          <img
            src={`${news.image_path}`}
            alt={news.title}
            className="news-image"
          />
        </div>

        <div className="news-content-box">
          <h2 className="news-heading">{news.title}</h2>
          <p className="news-date">{news.published_date?.slice(0, 10)}</p>
          <p className="news-description">{news.description}</p>
          <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
          <p><strong>نویسنده:</strong> {news.author || "ناشناخته"}</p>
        </div>
      </div>

      <div className="news-other">
        <h3>اخبار دیگر</h3>
        <ul>
          {otherNews.map(other => (
            <li key={other.id}>
              <Link to={`/news/${other.id}`} className="news-link">
                {other.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/" className="news-link back-link">
        بازگشت به اخبار
      </Link>

      {zoomed && (
        <div onClick={() => setZoomed(false)}>
          <img
            src={`${news.image_path}`}
            alt={news.title}
            className="zoomed-image"
          />
        </div>
      )}

      <Comments newsId={id} />
    </section>
  );
};

export default NewsDetail;
