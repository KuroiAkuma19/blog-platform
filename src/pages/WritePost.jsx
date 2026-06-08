import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/api';
import { ArrowLeft, Loader, Save, Eye, Edit3, Image, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Technology', 'Design', 'Productivity', 'Lifestyle'];

export const WritePost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); 
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    coverImage: '',
    content: '',
    excerpt: ''
  });

  // Redirect guests
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, authLoading, navigate]);

  // Load post details if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchPost = async () => {
        setLoading(true);
        setError('');
        try {
          const post = await blogApi.getPost(id);
          // Verify that this is the author
          if (currentUser && post.authorId !== currentUser.id) {
            setError("You do not have permission to edit this article.");
            return;
          }
          setFormData({
            title: post.title,
            category: post.category,
            coverImage: post.coverImage,
            content: post.content,
            excerpt: post.excerpt
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
      setIsEditMode(false);
      setFormData({
        title: '',
        category: 'Technology',
        coverImage: '',
        content: '',
        excerpt: ''
      });
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError("Please write a compelling title.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Article content cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await blogApi.updatePost(id, formData);
        navigate(`/post/${id}`);
      } else {
        const newPost = await blogApi.createPost(formData);
        navigate(`/post/${newPost.id}`);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
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

  if (error && isEditMode && (!currentUser || formData.title === '')) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>

      <Link to={isEditMode ? `/post/${id}` : '/'} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        color: 'hsl(var(--text-secondary))',
        marginBottom: '2rem',
        fontWeight: 500
      }}>
        <ArrowLeft size={16} />
        <span>Cancel and return</span>
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          {isEditMode ? 'Edit Article' : 'Write New Article'}
        </h1>

        <div style={{
          display: 'flex',
          background: 'hsla(var(--text-muted) / 0.08)',
          border: '1px solid hsl(var(--border-color))',
          borderRadius: '50px',
          padding: '2px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className="btn"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'write' ? 'hsl(var(--bg-app))' : 'transparent',
              color: activeTab === 'write' ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
              boxShadow: activeTab === 'write' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Edit3 size={14} />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className="btn"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'preview' ? 'hsl(var(--bg-app))' : 'transparent',
              color: activeTab === 'preview' ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
              boxShadow: activeTab === 'preview' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'hsla(var(--danger) / 0.12)',
          border: '1px solid hsla(var(--danger) / 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'hsl(var(--danger))',
          fontSize: '0.875rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'write' ? (
                <form onSubmit={handleSubmit} className="glass" style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)'
        }}>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Article Title</label>
            <input
              type="text"
              id="edit-title"
              name="title"
              placeholder="e.g. 10 Tips for Better Web Performance"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              style={{ fontSize: '1.25rem', padding: '0.875rem 1.125rem' }}
              required
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem'
          }}>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                style={{ height: '45px' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="edit-image">Cover Image URL (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Image size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-muted))'
                }} />
                <input
                  type="url"
                  id="edit-image"
                  name="coverImage"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '38px', height: '45px' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-excerpt">Short Description / Summary (Optional)</label>
            <input
              type="text"
              id="edit-excerpt"
              name="excerpt"
              placeholder="A brief teaser that appears on the home feed (leave empty to auto-generate)"
              value={formData.excerpt}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="edit-content">Content (Markdown supported)</label>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
              Separate paragraphs with empty lines. Use ## for subheadings, &gt; for blockquotes, and ``` for code blocks.
            </p>
            <textarea
              id="edit-content"
              name="content"
              placeholder="Start writing your story here..."
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="form-textarea"
              style={{ lineHeight: 1.6 }}
              required
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid hsl(var(--border-color))'
          }}>
            <Link to={isEditMode ? `/post/${id}` : '/'} className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '130px' }}
            >
              {submitting ? (
                <Loader size={18} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
              ) : (
                <>
                  <Save size={18} />
                  <span>{isEditMode ? 'Save Changes' : 'Publish Article'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
                <article className="glass animate-scale-in" style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)'
        }}>

          {formData.coverImage ? (
            <div style={{
              width: '100%',
              height: '300px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}>
              <img
                src={formData.coverImage}
                alt="Cover Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.currentTarget.style.display = 'none'}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: '200px',
              background: 'hsla(var(--text-muted) / 0.05)',
              border: '2px dashed hsl(var(--border-color))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(var(--text-muted))',
              marginBottom: '2rem'
            }}>
              <span>Default placeholder image will be used</span>
            </div>
          )}

          <span className="badge badge-general" style={{ marginBottom: '0.75rem' }}>
            {formData.category}
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {formData.title || 'Untitled Article'}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid hsl(var(--border-color))',
            marginBottom: '2rem'
          }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Draft Preview</span>
            </div>
          </div>

          <div className="prose">
            {formData.content ? (
              formData.content.split('\n\n').map((block, idx) => {
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
                if (block.startsWith('## ')) {
                  return <h2 key={idx}>{block.replace('## ', '')}</h2>;
                }
                if (block.startsWith('> ')) {
                  return <blockquote key={idx}>{block.replace(/>\s*/g, '')}</blockquote>;
                }
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
                return <p key={idx}>{block}</p>;
              })
            ) : (
              <p style={{ color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>
                Write some content to see the preview...
              </p>
            )}
          </div>
        </article>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};
