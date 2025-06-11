import React, { useState, useEffect } from 'react';

const Vote = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votePacks, setVotePacks] = useState(0);
  const [userVotes, setUserVotes] = useState({});
  const [message, setMessage] = useState('');
  const [votePackOptions] = useState([
    { id: 'basic', name: 'Basic Pack', votes: 10, price: 5 },
    { id: 'standard', name: 'Standard Pack', votes: 25, price: 10 },
    { id: 'premium', name: 'Premium Pack', votes: 50, price: 18 }
  ]);
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (storyId) => {
    if (userVoteCredits <= 0) {
      alert('You need vote credits to vote! Purchase a vote pack below.');
      return;
    }

    try {
      // Simulate voting API call
      setUserVoteCredits(prev => prev - 1);
      
      // Update story votes locally
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, votes: story.votes + 1, hasVoted: true }
          : story
      ));

      // Show success message
      const storyTitle = stories.find(s => s.id === storyId)?.title;
      alert(`Vote cast successfully for "${storyTitle}"!`);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  const purchaseVotePack = async (pack) => {
    setPurchaseStatus({ type: 'loading', message: 'Processing purchase...' });
    
    try {
      const response = await fetch('/api/create-vote-pack-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pack: pack.id,
          amount: pack.price * 100 // Convert to cents
        })
      });

      const result = await response.json();

      if (response.ok) {
        setPurchaseStatus({ type: 'success', message: 'Redirecting to payment...' });
        // In a real app, redirect to Stripe checkout
        window.open(result.url, '_blank');
        
        // Simulate successful purchase after 3 seconds
        setTimeout(() => {
          setUserVoteCredits(prev => prev + pack.votes);
          setPurchaseStatus({ type: 'success', message: `Successfully purchased ${pack.votes} vote credits!` });
          setTimeout(() => setPurchaseStatus(null), 3000);
        }, 3000);
      } else {
        setPurchaseStatus({ type: 'error', message: result.error || 'Purchase failed' });
      }
    } catch (error) {
      setPurchaseStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="vote-page">
      <div className="container">
        <div className="page-header">
          <h1>Community Voting</h1>
          <p>Vote for your favorite cricket stories and help them gain visibility</p>
          <div className="vote-credits">
            <span className="credits-label">Your Vote Credits:</span>
            <span className="credits-count">{userVoteCredits}</span>
          </div>
        </div>

        {/* Vote Packs Section */}
        <section className="vote-packs">
          <h2>Purchase Vote Credits</h2>
          <div className="packs-grid">
            {votePacks.map(pack => (
              <div key={pack.id} className="pack-card">
                <h3>{pack.name}</h3>
                <div className="pack-votes">{pack.votes} Votes</div>
                <div className="pack-price">${pack.price}</div>
                <div className="pack-value">${(pack.price / pack.votes).toFixed(2)} per vote</div>
                <button 
                  className="btn btn-primary"
                  onClick={() => purchaseVotePack(pack)}
                  disabled={purchaseStatus?.type === 'loading'}
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
          
          {purchaseStatus && (
            <div className={`purchase-status ${purchaseStatus.type}`}>
              {purchaseStatus.message}
            </div>
          )}
        </section>

        {/* Stories for Voting */}
        <section className="voting-stories">
          <h2>Vote on Stories</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading stories...</p>
            </div>
          ) : (
            <div className="stories-list">
              {stories.length > 0 ? (
                stories.map(story => (
                  <div key={story.id} className={`vote-story-card ${story.hasVoted ? 'voted' : ''}`}>
                    <div className="story-content">
                      <h3>{story.title}</h3>
                      <p className="story-author">by {story.author}</p>
                      <p className="story-excerpt">{story.content.substring(0, 200)}...</p>
                      <div className="story-meta">
                        <span className="category">{story.category}</span>
                        <span className="date">{new Date(story.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="vote-section">
                      <div className="current-votes">
                        <span className="vote-count">{story.votes}</span>
                        <span className="vote-label">votes</span>
                      </div>
                      
                      <button 
                        className={`vote-btn ${story.hasVoted ? 'voted' : ''}`}
                        onClick={() => handleVote(story.id)}
                        disabled={story.hasVoted || userVoteCredits <= 0}
                      >
                        {story.hasVoted ? '✓ Voted' : '👍 Vote'}
                      </button>
                      
                      {userVoteCredits <= 0 && !story.hasVoted && (
                        <small className="no-credits">No credits remaining</small>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-stories">
                  <p>No stories available for voting at the moment.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Voting Guidelines */}
        <section className="voting-guidelines">
          <h3>Voting Guidelines</h3>
          <ul>
            <li>Each vote costs 1 credit from your vote pack</li>
            <li>You can only vote once per story</li>
            <li>Votes help stories gain visibility and ranking</li>
            <li>Support quality content and engaging stories</li>
            <li>Vote credits never expire</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Vote;