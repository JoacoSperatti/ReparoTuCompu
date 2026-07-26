import React, { useState, useEffect } from 'react';
import { getDbPosts } from '../firebase';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getDbPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero section">
        <div className="container">
          <h1 className="blog-title">Blog & Novedades</h1>
          <p className="blog-subtitle">
            Tips, tutoriales y las últimas noticias del mundo tecnológico para mantener tus equipos al día.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="blog-content section section-alt">
        <div className="container">
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
              <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(var(--color-primary-rgb), 0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Cargando artículos...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <h2>Aún no hay artículos publicados.</h2>
              <p>¡Vuelve pronto para ver nuestras novedades!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-img-wrapper">
                    <img src={post.imageUrl} alt={post.title} className="blog-card-img" loading="lazy" />
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-date">{post.date}</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <button className="btn btn-outline blog-read-more">Leer artículo</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
