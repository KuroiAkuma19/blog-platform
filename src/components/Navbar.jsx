import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Search, PenSquare, LogOut, User, LogIn } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('q') || '');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchVal(q);
    } else {
      setSearchVal('');
    }
  }, [searchParams]);

  // Sync theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);

    if (location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(val)}`);
    } else {
      if (val) {
        setSearchParams({ q: val });
      } else {
        searchParams.delete('q');
        setSearchParams(searchParams);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="glass sticky-nav animate-fade-in" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      padding: '0.875rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>

        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'inherit',
          letterSpacing: '-0.03em'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}>✍️</span>
          <span>Dev<span style={{ color: 'hsl(var(--primary))' }}>Verse</span></span>
        </Link>

        <form onSubmit={handleSearchSubmit} style={{
          position: 'relative',
          flex: 1,
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            color: 'hsl(var(--text-muted))',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search articles, tags, authors..."
            value={searchVal}
            onChange={handleSearchChange}
            style={{
              paddingLeft: '38px',
              height: '40px',
              borderRadius: '50px',
              fontSize: '0.875rem'
            }}
            className="form-input"
          />
        </form>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            aria-label="Toggle theme"
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser ? (
                        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Link to="/write" className="btn btn-primary" style={{
                height: '40px',
                fontSize: '0.85rem'
              }}>
                <PenSquare size={16} />
                <span>Write</span>
              </Link>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '4px 12px 4px 4px',
                borderRadius: '50px',
                background: 'hsla(var(--text-muted) / 0.08)',
                border: '1px solid hsl(var(--border-color))'
              }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  maxWidth: '100px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{currentUser.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'hsl(var(--text-secondary))',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
                        <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{
                height: '40px',
                fontSize: '0.85rem'
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
