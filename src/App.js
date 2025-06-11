import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Home from './components/Home';
import Stories from './components/Stories';
import SubmitStory from './components/SubmitStory';
import Vote from './components/Vote';
import BoostStory from './components/BoostStory';
import CricketPro from './components/CricketPro';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState({
    voteCredits: 3,
    isPro: false,
    stories: []
  });

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVoteCredits = (newCredits) => {
    setUser(prev => ({ ...prev, voteCredits: newCredits }));
  };

  const updateProStatus = (isPro) => {
    setUser(prev => ({ ...prev, isPro }));
  };

  return (
    <Router>
      <div className="App">
        <Navigation userVoteCredits={user.voteCredits} userProStatus={{isActive: user.isPro}} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home stories={stories} loading={loading} />} />
            <Route path="/stories" element={<Stories stories={stories} loading={loading} />} />
            <Route path="/submit" element={<SubmitStory onStorySubmit={loadStories} />} />
            <Route path="/vote" element={
              <Vote 
                stories={stories} 
                voteCredits={user.voteCredits} 
                onVoteCreditsUpdate={updateVoteCredits}
                onStoriesUpdate={loadStories}
              />
            } />
            <Route path="/boost" element={<BoostStory stories={stories} />} />
            <Route path="/pro" element={
              <CricketPro 
                isPro={user.isPro} 
                onProStatusUpdate={updateProStatus}
              />
            } />
            {user.isPro && (
              <Route path="/dashboard" element={<Dashboard />} />
            )}
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 CricketTales. Share your cricket stories with the world.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;