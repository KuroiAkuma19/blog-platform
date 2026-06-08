import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart } from 'lucide-react';

export const PostCard = ({ post }) => {
  const { id, title, excerpt, category, authorName, authorAvatar, coverImage, createdAt, likes, readTime } = post;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryClass = (cat) => {
    switch (cat.toLowerCase()) {
      case 'technology':
        return 'badge-tech';
      case 'design':
        return 'badge-design';
      case 'productivity':
        return 'badge-productivity';
      case 'lifestyle':
        return 'badge-lifestyle';
      default:
        return 'badge-general';
    }
  };

  return (
    <article className="glass-card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>

      <Link to={`/post/${id}`} style={{ display: 'block', overflow: 'hidden', height: '200px' }}>
        <img
          src={coverImage}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Link>

      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.875rem'
        }}>
          <span className={`badge ${getCategoryClass(category)}`}>
            {category}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            color: 'hsl(var(--text-secondary))'
          }}>
            <Heart size={14} style={{ color: 'hsl(var(--danger))', fill: likes > 0 ? 'currentColor' : 'none' }} />
            <span>{likes}</span>
          </span>
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: '0.625rem',
          lineHeight: 1.3
        }}>
          <Link to={`/post/${id}`} style={{
            color: 'inherit',
            transition: 'color 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'}
          onMouseOut={e => e.currentTarget.style.color = 'inherit'}
          >
            {title}
          </Link>
        </h3>

        <p style={{
          fontSize: '0.9rem',
          color: 'hsl(var(--text-secondary))',
          marginBottom: '1.5rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {excerpt}
        </p>

        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid hsl(var(--border-color))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={authorAvatar}
              alt={authorName}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{authorName}</span>
              <span style={{
                fontSize: '0.75rem',
                color: 'hsl(var(--text-muted))',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Calendar size={10} />
                <span>{formatDate(createdAt)}</span>
              </span>
            </div>
          </div>

          <span style={{
            fontSize: '0.75rem',
            color: 'hsl(var(--text-muted))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Clock size={12} />
            <span>{readTime}</span>
          </span>
        </div>
      </div>
    </article>
  );
};
