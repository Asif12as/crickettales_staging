import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ userVoteCredits, userProStatus }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏏</span>
          <span className="logo-text">CricketTales</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          
          <Link 
            to="/stories" 
            className={`nav-link ${isActive('/stories') ? 'active' : ''}`}
          >
            Stories
          </Link>
          
          <Link 
            to="/submit" 
            className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
          >
            Submit Story
          </Link>
          
          <Link 
            to="/vote" 
            className={`nav-link ${isActive('/vote') ? 'active' : ''}`}
          >
            Vote
            {userVoteCredits > 0 && (
              <span className="vote-credits-badge">{userVoteCredits}</span>
            )}
          </Link>
          
          <Link 
            to="/boost" 
            className={`nav-link ${isActive('/boost') ? 'active' : ''}`}
          >
            Boost Story
          </Link>
          
          <Link 
            to="/pro" 
            className={`nav-link pro-link ${isActive('/pro') ? 'active' : ''}`}
          >
            CricketPro
            {userProStatus?.isActive && (
              <span className="pro-badge">PRO</span>
            )}
          </Link>
          
          {userProStatus?.isActive && (
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* User Status */}
        <div className="nav-status">
          <div className="status-item">
            <span className="status-label">Votes:</span>
            <span className="status-value">{userVoteCredits || 0}</span>
          </div>
          
          {userProStatus?.isActive && (
            <div className="status-item pro-status">
              <span className="pro-indicator">⭐ PRO</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
        
        <Link 
          to="/stories" 
          className={`mobile-nav-link ${isActive('/stories') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Stories
        </Link>
        
        <Link 
          to="/submit" 
          className={`mobile-nav-link ${isActive('/submit') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Submit Story
        </Link>
        
        <Link 
          to="/vote" 
          className={`mobile-nav-link ${isActive('/vote') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Vote ({userVoteCredits || 0})
        </Link>
        
        <Link 
          to="/boost" 
          className={`mobile-nav-link ${isActive('/boost') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Boost Story
        </Link>
        
        <Link 
          to="/pro" 
          className={`mobile-nav-link ${isActive('/pro') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          CricketPro {userProStatus?.isActive && '⭐'}
        </Link>
        
        {userProStatus?.isActive && (
          <Link 
            to="/dashboard" 
            className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;