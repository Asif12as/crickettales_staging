import React, { useState, useEffect } from 'react';

const BoostStory = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState('');
  const [boostDuration, setBoostDuration] = useState('24');
  const [message, setMessage] = useState('');
  const [boostedStories, setBoostedStories] = useState([]);

  useEffect(() => {
    fetchStories();
    fetchBoostedStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data.filter(story => !story.isBoosted));
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoostedStories = async () => {
    try {
      const response = await fetch('/api/boost-status');
      const data = await response.json();
      setBoostedStories(data);
    } catch (error) {
      console.error('Error fetching boosted stories:', error);
    }
  };

  const handleBoostStory = async () => {
    if (!selectedStory) {
      setMessage('Please select a story to boost.');
      return;
    }

    try {
      const response = await fetch('/api/create-boost-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: selectedStory,
          duration: parseInt(boostDuration)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.url) {
          // Redirect to payment
          window.location.href = data.url;
        } else {
          setMessage('Boost session created successfully!');
          fetchBoostedStories();
        }
      } else {
        setMessage(data.error || 'Failed to create boost session.');
      }
    } catch (error) {
      console.error('Error boosting story:', error);
      setMessage('Error creating boost session. Please try again.');
    }
  };

  const getBoostPrice = (duration) => {
    const prices = {
      '24': 10,
      '72': 25,
      '168': 50 // 1 week
    };
    return prices[duration] || 10;
  };

  if (loading) {
    return (
      <div className="container">
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>🚀 Boost Your Story</h1>
        <p style={styles.subtitle}>Give your cricket tale the visibility it deserves</p>
      </div>

      <div style={styles.boostSection}>
        <div style={styles.boostCard}>
          <h3 style={styles.cardTitle}>Boost a Story</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Story to Boost:</label>
            <select 
              value={selectedStory} 
              onChange={(e) => setSelectedStory(e.target.value)}
              style={styles.select}
            >
              <option value="">Choose a story...</option>
              {stories.map(story => (
                <option key={story.id} value={story.id}>
                  {story.title} - by {story.author}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Boost Duration:</label>
            <select 
              value={boostDuration} 
              onChange={(e) => setBoostDuration(e.target.value)}
              style={styles.select}
            >
              <option value="24">24 Hours - ${getBoostPrice('24')}</option>
              <option value="72">3 Days - ${getBoostPrice('72')}</option>
              <option value="168">1 Week - ${getBoostPrice('168')}</option>
            </select>
          </div>

          <div style={styles.priceDisplay}>
            <strong>Total Cost: ${getBoostPrice(boostDuration)}</strong>
          </div>

          <button 
            onClick={handleBoostStory}
            style={styles.boostButton}
            disabled={!selectedStory}
          >
            🚀 Boost Story
          </button>
        </div>

        <div style={styles.benefitsCard}>
          <h3 style={styles.cardTitle}>Boost Benefits</h3>
          <ul style={styles.benefitsList}>
            <li>📈 Increased visibility in story listings</li>
            <li>⭐ Featured placement on homepage</li>
            <li>🎯 Priority in search results</li>
            <li>📊 Enhanced engagement metrics</li>
            <li>🏆 Special boost badge display</li>
          </ul>
        </div>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('successfully') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}

      {/* Currently Boosted Stories */}
      {boostedStories.length > 0 && (
        <div style={styles.boostedSection}>
          <h2 style={styles.sectionTitle}>🔥 Currently Boosted Stories</h2>
          <div style={styles.boostedGrid}>
            {boostedStories.map(story => (
              <div key={story.id} style={styles.boostedCard}>
                <h3 style={styles.boostedTitle}>{story.title}</h3>
                <p style={styles.boostedAuthor}>By {story.author}</p>
                <div style={styles.boostedMeta}>
                  <span>⏰ {story.timeRemaining} remaining</span>
                  <span>👍 {story.votes || 0} votes</span>
                  <span>👁️ {story.views || 0} views</span>
                </div>
                <div style={styles.boostBadge}>BOOSTED</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stories.length === 0 && (
        <div style={styles.noStories}>
          <p>No stories available for boosting at the moment.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageHeader: {
    textAlign: 'center',
    padding: '40px 0',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    borderRadius: '10px',
    margin: '20px 0'
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    fontFamily: 'Georgia, serif'
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: 0,
    opacity: 0.9
  },
  boostSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    margin: '40px 0'
  },
  boostCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #ff6b6b'
  },
  benefitsCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #e9ecef'
  },
  cardTitle: {
    color: '#2c5530',
    margin: '0 0 20px 0',
    fontSize: '1.5rem',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  priceDisplay: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#ff6b6b',
    margin: '20px 0',
    padding: '15px',
    background: '#fff5f5',
    borderRadius: '6px',
    border: '2px solid #ff6b6b'
  },
  boostButton: {
    width: '100%',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  message: {
    padding: '15px',
    borderRadius: '6px',
    margin: '20px 0',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  successMessage: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  boostedSection: {
    margin: '50px 0'
  },
  sectionTitle: {
    color: '#2c5530',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem'
  },
  boostedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  boostedCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #ff6b6b',
    position: 'relative'
  },
  boostedTitle: {
    color: '#2c5530',
    margin: '0 0 10px 0',
    fontSize: '1.2rem'
  },
  boostedAuthor: {
    color: '#666',
    margin: '0 0 15px 0'
  },
  boostedMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.9rem',
    color: '#666',
    flexWrap: 'wrap'
  },
  boostBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#ff6b6b',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  noStories: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '1.1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '40px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #ff6b6b',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  }
};

export default BoostStory;