import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // import Link
import "../styles/NewsSection.css";

const NewsSection = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    axios.get("/api/news")
      .then(res => setNewsData(res.data))
      .catch(err => console.error("Failed to fetch news", err));
  }, []);

  return (
    <section className="news-section" id="news-section">
      <h2 className="news-heading">آخرین اخبار</h2>
      <div className="news-list">
        {newsData.slice(0, 6).map((news) => (
          <div key={news.id} className="news-card">
            <img src={`${news.image_path}`} alt={news.title} className="news-image" />
            <div className="news-info">
              <h3 className="news-title">{news.title}</h3>
              <p className="news-date">{news.published_date?.slice(0, 10)}</p>
              <p className="news-description">
                {news.description.length > 50
                  ? news.description.slice(0, 50) + "..."
                  : news.description}
              </p>
              <Link to={`/news/${news.id}`} className="news-link">بیشتر بخوانید</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
