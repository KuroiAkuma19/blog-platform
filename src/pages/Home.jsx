import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { blogApi } from '../services/api';
import { PostCard } from '../components/PostCard';
import { Heart, Calendar, Clock, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Productivity', 'Lifestyle'];

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get('q') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await blogApi.getPosts(activeCategory, searchVal);
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, searchVal]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const featuredPost = posts.length > 0 && activeCategory === 'All' && !searchVal ? posts[0] : null;
  const feedPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        padding: '4px 0',
        marginBottom: '2.5rem',
        borderBottom: '1px solid hsl(var(--border-color))'
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className="btn"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: activeCategory === cat ? 'hsl(var(--primary))' : 'transparent',
              color: activeCategory === cat ? '#fff' : 'hsl(var(--text-secondary))',
              border: activeCategory === cat ? '1px solid hsl(var(--primary))' : '1px solid transparent'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (

        activeCategory === 'All' && !searchVal && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            borderRadius: 'var(--radius-lg)',
            height: '420px',
            marginBottom: '3rem',
            padding: '2rem'
          }} className="skeleton">
          </div>
        )
      ) : (
        featuredPost && (
          <section className="glass animate-scale-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '3.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>

            <div style={{ height: '100%', minHeight: '300px' }}>
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="badge badge-tech" style={{
                  background: 'linear-gradient(135deg, hsla(var(--primary)/0.15) 0%, hsla(var(--danger)/0.15) 100%)',
                  color: 'hsl(var(--primary))'
                }}>★ FEATURED</span>
                <span className="badge badge-general">{featuredPost.category}</span>
              </div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                <Link to={`/post/${featuredPost.id}`} style={{
                  color: 'inherit',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'}
                onMouseOut={e => e.currentTarget.style.color = 'inherit'}
                >
                  {featuredPost.title}
                </Link>
              </h2>
              <p style={{
                color: 'hsl(var(--text-secondary))',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '1.75rem'
              }}>{featuredPost.excerpt}</p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid hsl(var(--border-color))',
                paddingTop: '1.25rem',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={featuredPost.authorAvatar}
                    alt={featuredPost.authorName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{featuredPost.authorName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      <span>{formatDate(featuredPost.createdAt)}</span>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {featuredPost.readTime}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Heart size={14} style={{ color: 'hsl(var(--danger))' }} /> {featuredPost.likes}</span>
                </div>
              </div>
            </div>
          </section>
        )
      )}

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 800,
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <BookOpen size={20} style={{ color: 'hsl(var(--primary))' }} />
        {searchVal ? `Search results for "${searchVal}"` : activeCategory !== 'All' ? `${activeCategory} Articles` : 'Latest Publications'}
      </h2>

      {loading ? (

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ borderRadius: 'var(--radius-md)', height: '420px' }} className="skeleton"></div>
          ))}
        </div>
      ) : (
        feedPosts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
                    <div className="glass" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No articles found</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '400px', margin: '0 auto' }}>
              We couldn't find any articles matching your query. Try adjusting your category filter or search keywords.
            </p>
            {activeCategory !== 'All' || searchVal ? (
              <button
                className="btn btn-primary"
                onClick={() => { setActiveCategory('All'); }}
                style={{ marginTop: '1.5rem' }}
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )
      )}
    </main>
  );
};
