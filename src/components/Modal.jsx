import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, UserPlus, AlertCircle, Loader, LogIn } from 'lucide-react';

export const Modal = ({ isOpen, onClose }) => {
  const { login, register, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [validationError, setValidationError] = useState('');

  // Clear errors when modal opens/closes or toggles mode
  useEffect(() => {
    clearError();
    setValidationError('');
    setFormData({ username: '', email: '', password: '', name: '' });
  }, [isOpen, isRegister]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const { username, email, password, name } = formData;

    // Basic validations
    if (!username || !password || (isRegister && (!email || !name))) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (isRegister && !/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(username.trim().toLowerCase(), email.trim(), password, name.trim());
      } else {
        await login(username.trim(), password);
      }
      onClose(); // Close modal on success
    } catch (err) {
      // Errors handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000
    }}
    onClick={onClose}
    className="animate-fade-in"
    >
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative'
      }}
      className="glass animate-scale-in"
      onClick={e => e.stopPropagation()} 
      >

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'hsl(var(--text-muted))',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          className="btn-secondary"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>
            {isRegister ? 'Join DevVerse to write and interact' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {(validationError || error) && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'hsla(var(--danger) / 0.12)',
            border: '1px solid hsla(var(--danger) / 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: 'hsl(var(--danger))',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{validationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'hsl(var(--text-muted))'
                  }} />
                  <input
                    type="text"
                    id="auth-name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ paddingLeft: '38px' }}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'hsl(var(--text-muted))'
                  }} />
                  <input
                    type="email"
                    id="auth-email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ paddingLeft: '38px' }}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                type="text"
                id="auth-username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                style={{ paddingLeft: '38px' }}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                type="password"
                id="auth-password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '38px' }}
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', fontSize: '0.95rem' }}
          >
            {loading ? (
              <Loader size={18} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            ) : isRegister ? (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.85rem',
          color: 'hsl(var(--text-secondary))'
        }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--primary))',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--primary))',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
