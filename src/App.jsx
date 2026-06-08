import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Modal } from './components/Modal';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { WritePost } from './pages/WritePost';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div className="ambient-glow" />
        <div className="ambient-glow-2" />

        <Navbar onOpenAuth={() => setAuthOpen(true)} />

        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail onOpenAuth={() => setAuthOpen(true)} />} />
            <Route path="/write" element={<WritePost />} />
            <Route path="/edit/:id" element={<WritePost />} />
          </Routes>
        </div>

        <footer style={{
          padding: '3rem 0',
          borderTop: '1px solid hsl(var(--border-color))',
          marginTop: 'auto',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'hsl(var(--text-secondary))',
          background: 'hsla(var(--bg-card) / 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="container">
            <p style={{ fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
              Dev<span style={{ color: 'hsl(var(--primary))' }}>Verse</span> Blog Platform
            </p>
            <p>© {new Date().getFullYear()} DevVerse. Built with Vite, React & CSS HSL Custom Properties.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
              Designed with glassmorphism, native color themes, and persistent client-side data simulation.
            </p>
          </div>
        </footer>

        <Modal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  );
}

export default App;
