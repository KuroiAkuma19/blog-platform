import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/api';
import { Calendar, Clock, Heart, Edit2, Trash2, Send, MessageSquare, ArrowLeft, Loader, AlertTriangle } from 'lucide-react';

export const PostDetail = ({ onOpenAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentContent, setCommentContent] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [liked, setLiked] = useState(false);

  // Reading progress state
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const pct = (window.scrollY / scrollHeight) * 100;
        setScrollPercent(pct);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const postData = await blogApi.getPost(id);
        setPost(postData);

        const commentsData = await blogApi.getComments(id);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0); 
  }, [id]);

  const handleLike = async () => {
    if (liked) return; 
    try {
      const updatedPost = await blogApi.likePost(id);
      setPost(updatedPost);
      setLiked(true);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await blogApi.deletePost(id);
      navigate('/');
    } catch (err) {
      alert("Failed to delete post: " + err.message);
      setDeleting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setCommenting(true);
    try {
      const newComment = await blogApi.createComment(id, commentContent.trim());
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      alert("Failed to post comment: " + err.message);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await blogApi.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Failed to delete comment: " + err.message);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Loader size={36} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
          {error || "The article you are trying to view does not exist or has been deleted."}
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === post.authorId;

  return (
    <>

      <div className="read-progress" style={{ width: `${scrollPercent}%` }} />

      <article className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>

        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: 'hsl(var(--text-secondary))',
          marginBottom: '2rem',
          fontWeight: 500
        }}>
          <ArrowLeft size={16} />
          <span>Back to articles</span>
        </Link>

        <div style={{
          width: '100%',
          height: '380px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-general" style={{ marginBottom: '1rem' }}>
            {post.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            {post.title}
          </h1>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid hsl(var(--border-color))'
          }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>{post.authorName}</span>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleLike}
                className="btn btn-secondary"
                disabled={liked}
                style={{
                  height: '40px',
                  borderRadius: '50px',
                  padding: '0 1.25rem',
                  borderColor: liked ? 'hsla(var(--danger) / 0.3)' : 'hsl(var(--border-color))',
                  color: liked ? 'hsl(var(--danger))' : 'inherit'
                }}
              >
                <Heart size={16} style={{ fill: liked ? 'currentColor' : 'none' }} />
                <span>{post.likes}</span>
              </button>

              {isAuthor && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/edit/${post.id}`} className="btn btn-secondary" style={{
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    borderRadius: '50%'
                  }} title="Edit Article">
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="btn btn-secondary"
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      borderRadius: '50%',
                      color: 'hsl(var(--danger))'
                    }}
                    title="Delete Article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {deleteConfirm && (
          <div style={{
            padding: '1.5rem',
            background: 'hsla(var(--danger) / 0.08)',
            border: '1px solid hsla(var(--danger) / 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'flex-start'
          }} className="animate-scale-in">
            <div style={{ display: 'flex', gap: '0.5rem', color: 'hsl(var(--danger))' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.95rem' }}>
                <strong>Delete this article?</strong>
                <p style={{ marginTop: '0.25rem', color: 'hsl(var(--text-secondary))' }}>
                  This action is permanent and will delete the article along with all associated comments.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '28px' }}>
              <button onClick={handleDeletePost} disabled={deleting} className="btn btn-danger" style={{ height: '36px', padding: '0 1rem', fontSize: '0.85rem' }}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="btn btn-secondary" style={{ height: '36px', padding: '0 1rem', fontSize: '0.85rem' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <section className="prose" style={{
          marginBottom: '4rem',
          lineHeight: 1.8,
          letterSpacing: '-0.003em'
        }}>

          {post.content.split('\n\n').map((block, idx) => {

            if (block.startsWith('```')) {
              const lines = block.split('\n');
              const code = lines.slice(1, -1).join('\n');
              return (
                <pre key={idx}>
                  <code>{code}</code>
                </pre>
              );
            }

            if (block.startsWith('### ')) {
              return <h3 key={idx}>{block.replace('### ', '')}</h3>;
            }
            // Check for Header 2
            if (block.startsWith('## ')) {
              return <h2 key={idx}>{block.replace('## ', '')}</h2>;
            }
            // Check for Blockquote
            if (block.startsWith('> ')) {
              return <blockquote key={idx}>{block.replace(/>\s*/g, '')}</blockquote>;
            }
            // Check for Unordered Lists
            if (block.startsWith('* ') || block.startsWith('- ')) {
              const items = block.split('\n');
              return (
                <ul key={idx}>
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^[\*\-\s]+/, '')}</li>
                  ))}
                </ul>
              );
            }
            // Check for Ordered Lists
            if (/^\d+\.\s/.test(block)) {
              const items = block.split('\n');
              return (
                <ol key={idx}>
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\.\s+/, '')}</li>
                  ))}
                </ol>
              );
            }
            // Default paragraph
            return <p key={idx}>{block}</p>;
          })}
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border-color))', marginBottom: '2.5rem' }} />

        <section>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <MessageSquare size={20} style={{ color: 'hsl(var(--primary))' }} />
            <span>Comments ({comments.length})</span>
          </h2>

          {currentUser ? (
            <form onSubmit={handleAddComment} style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              marginBottom: '2.5rem'
            }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <textarea
                  className="form-textarea"
                  placeholder="Share your thoughts on this article..."
                  rows={3}
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={commenting || !commentContent.trim()}
                  style={{ alignSelf: 'flex-end', height: '38px', fontSize: '0.85rem' }}
                >
                  {commenting ? (
                    <Loader size={16} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
                        <div className="glass" style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
                Sign in to join the conversation and share your feedback.
              </p>
              <button onClick={onOpenAuth} className="btn btn-primary" style={{ height: '36px', fontSize: '0.85rem' }}>
                Sign In to Comment
              </button>
            </div>
          )}

          {comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comments.map((comment) => {
                const canDelete = currentUser && (
                  currentUser.id === comment.authorId || 
                  currentUser.id === post.authorId      
                );

                return (
                  <div key={comment.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid hsl(var(--border-color))',
                    background: 'hsla(var(--bg-card) / 0.3)'
                  }} className="animate-fade-in">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.authorName}</span>
                          {comment.authorId === post.authorId && (
                            <span className="badge badge-tech" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>AUTHOR</span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'hsl(var(--text-muted))',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--danger))'}
                            onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--text-muted))'}
                            title="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.95rem',
                        color: 'hsl(var(--text-secondary))',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{
              textAlign: 'center',
              color: 'hsl(var(--text-muted))',
              padding: '2rem 0',
              fontSize: '0.9rem'
            }}>
              No comments yet. Be the first to start the discussion!
            </p>
          )}
        </section>
      </article>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
