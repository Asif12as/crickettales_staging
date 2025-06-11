import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ stories, loading }) => {
  const featuredStories = stories.filter(story => story.isPriority || story.isBoosted).slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Share Your Cricket Stories</h2>
          <p>Join our community of cricket enthusiasts and share your most memorable moments on the field.</p>
          <div className="hero-buttons">
            <Link to="/submit" className="btn btn-primary">Submit Your Story</Link>
            <Link to="/stories" className="btn btn-secondary">Read Stories</Link>
          </div>
        </div>
      </section>

      {/* Featured Stories Preview */}
      <section className="featured-preview">
        <div className="container">
          <h2>Featured Stories</h2>
          {loading ? (
            <div className="loading">Loading stories...</div>
          ) : (
            <div className="stories-grid">
              {featuredStories.length > 0 ? (
                featuredStories.map(story => (
                  <div key={story.id} className={`story-card ${story.isPriority ? 'priority' : ''} ${story.isBoosted ? 'boosted' : ''}`}>
                    <h3>{story.title}</h3>
                    <p className="story-author">by {story.author}</p>
                    <p className="story-content">{story.content.substring(0, 150)}...</p>
                    <div className="story-meta">
                      <span className="votes">👍 {story.votes}</span>
                      <span className="views">👁 {story.views}</span>
                      <span className="category">{story.category}</span>
                    </div>
                    {story.isPriority && <span className="priority-badge">Priority</span>}
                    {story.isBoosted && <span className="boost-badge">Boosted</span>}
                  </div>
                ))
              ) : (
                <p>No featured stories available.</p>
              )}
            </div>
          )}
          <div className="view-all">
            <Link to="/stories" className="btn btn-outline">View All Stories</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose CricketTales?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Share Stories</h3>
              <p>Share your cricket memories and experiences with fellow enthusiasts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗳️</div>
              <h3>Community Voting</h3>
              <p>Vote on your favorite stories and help the best ones rise to the top.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Boost Stories</h3>
              <p>Give your stories more visibility with our boost feature.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your story performance with CricketPro subscription.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Share Your Cricket Tale?</h2>
          <p>Join thousands of cricket fans sharing their stories</p>
          <Link to="/submit" className="btn btn-primary btn-large">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;