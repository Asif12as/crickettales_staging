import React, { useState, useEffect } from 'react';

const Stories = ({ stories, loading }) => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch featured stories
    fetch('/api/featured-stories')
      .then(res => res.json())
      .then(data => setFeaturedStories(data.slice(0, 5)))
      .catch(err => console.error('Error fetching featured stories:', err));
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'priority') return matchesSearch && story.isPriority;
    if (filter === 'boosted') return matchesSearch && story.isBoosted;
    return matchesSearch;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'votes':
        return (b.votes || 0) - (a.votes || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="container">
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading cricket tales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>🏏 Cricket Tales</h1>
        <p style={styles.subtitle}>Discover amazing cricket stories from our community</p>
      </div>

      {/* Featured Stories Section */}
      {featuredStories.length > 0 && (
        <div style={styles.featuredSection}>
          <h2 style={styles.sectionTitle}>🌟 Featured Stories</h2>
          <div style={styles.featuredGrid}>
            {featuredStories.map(story => (
              <div key={story.id} style={styles.featuredCard}>
                <h3 style={styles.featuredTitle}>{story.title}</h3>
                <p style={styles.featuredSnippet}>{story.snippet}</p>
                <span style={styles.featuredAuthor}>By {story.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.storiesControls}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterControls}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Stories</option>
            <option value="priority">Priority Stories</option>
            <option value="boosted">Boosted Stories</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="votes">Most Voted</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {sortedStories.length === 0 ? (
        <div style={styles.noStories}>
          <p>No stories found. {searchTerm && 'Try adjusting your search terms.'}</p>
        </div>
      ) : (
        <div style={styles.storiesGrid}>
          {sortedStories.map(story => (
            <div key={story.id} style={{
              ...styles.storyCard,
              ...(story.isPriority ? styles.priorityCard : {}),
              ...(story.isBoosted ? styles.boostedCard : {})
            }}>
              <div style={styles.storyBadges}>
                {story.isPriority && <span style={styles.priorityBadge}>Priority</span>}
                {story.isBoosted && <span style={styles.boostBadge}>Boosted</span>}
              </div>
              
              <h3 style={styles.storyTitle}>{story.title}</h3>
              <div style={styles.storyAuthor}>By {story.author}</div>
              <div style={styles.storyContent}>
                {story.content && story.content.length > 200 
                  ? `${story.content.substring(0, 200)}...` 
                  : story.content
                }
              </div>
              
              <div style={styles.storyMeta}>
                <span>📅 {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                <span>👍 {story.votes || 0} votes</span>
                <span>💬 {story.comments || 0} comments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageHeader: {
    textAlign: 'center',
    padding: '40px 0',
    background: 'linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)',
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
  featuredSection: {
    margin: '40px 0',
    padding: '30px',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '2px solid #e9ecef'
  },
  sectionTitle: {
    color: '#2c5530',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.8rem'
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  featuredCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '2px solid #ffd700',
    transition: 'transform 0.2s ease'
  },
  featuredTitle: {
    color: '#2c5530',
    margin: '0 0 10px 0',
    fontSize: '1.2rem'
  },
  featuredSnippet: {
    color: '#666',
    margin: '0 0 10px 0',
    lineHeight: '1.5'
  },
  featuredAuthor: {
    color: '#2c5530',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  storiesControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '30px 0',
    gap: '20px',
    flexWrap: 'wrap'
  },
  searchBar: {
    flex: 1,
    minWidth: '250px'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  filterControls: {
    display: 'flex',
    gap: '10px'
  },
  filterSelect: {
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  sortSelect: {
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  storiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    margin: '30px 0'
  },
  storyCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '2px solid #e9ecef'
  },
  priorityCard: {
    borderLeft: '4px solid #ffd700'
  },
  boostedCard: {
    borderLeft: '4px solid #ff6b6b'
  },
  storyBadges: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px'
  },
  priorityBadge: {
    background: '#ffd700',
    color: '#333',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  boostBadge: {
    background: '#ff6b6b',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  storyTitle: {
    color: '#2c5530',
    margin: '0 0 10px 0',
    fontSize: '1.3rem'
  },
  storyAuthor: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '15px'
  },
  storyContent: {
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  storyMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.9rem',
    color: '#666',
    flexWrap: 'wrap'
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
    borderTop: '4px solid #2c5530',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  }
};

export default Stories;