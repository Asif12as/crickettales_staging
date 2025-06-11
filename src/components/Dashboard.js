import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProStatus, setUserProStatus] = useState({ isPro: false });

  useEffect(() => {
    loadDashboardMetrics();
    checkProStatus();
  }, []);

  const loadDashboardMetrics = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/dashboard-metrics');
      const data = await response.json();
      
      if (response.ok) {
        setDashboardData(data);
      } else {
        setError(data.error || 'Failed to load dashboard data.');
        // Set default data if API fails
        setDashboardData({
          storiesSubmitted: 0,
          totalVotes: 0,
          totalViews: 0,
          featuredStories: 0,
          votePacks: 0,
          boostCredits: 0,
          recentStories: [],
          proStatus: { isPro: false }
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Error loading dashboard. Please try again.');
      // Set default data on error
      setDashboardData({
        storiesSubmitted: 0,
        totalVotes: 0,
        totalViews: 0,
        featuredStories: 0,
        votePacks: 0,
        boostCredits: 0,
        recentStories: [],
        proStatus: { isPro: false }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkProStatus = async () => {
    try {
      const response = await fetch('/api/user/pro-status');
      const data = await response.json();
      setUserProStatus(data);
    } catch (error) {
      console.error('Error checking pro status:', error);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'submit':
        window.location.href = '/submit';
        break;
      case 'vote-packs':
        window.location.href = '/vote';
        break;
      case 'boost':
        window.location.href = '/boost';
        break;
      case 'pro':
        window.location.href = '/pro';
        break;
      default:
        break;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  if (!userProStatus.isActive) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="pro-required">
            <div className="pro-required-content">
              <h1>📊 Analytics Dashboard</h1>
              <div className="upgrade-prompt">
                <h2>CricketPro Required</h2>
                <p>Access detailed analytics and insights about your cricket stories with a CricketPro subscription.</p>
                <div className="preview-features">
                  <h3>What you'll get:</h3>
                  <ul>
                    <li>📈 Story performance metrics</li>
                    <li>👥 Audience demographics</li>
                    <li>🎯 Engagement analytics</li>
                    <li>📊 Growth tracking</li>
                    <li>💰 Revenue insights</li>
                  </ul>
                </div>
                <a href="/pro" className="btn btn-primary btn-large">Upgrade to CricketPro</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>📊 Analytics Dashboard</h1>
          <div className="dashboard-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-dashboard">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : metrics ? (
          <div className="dashboard-content">
            {/* Overview Cards */}
            <section className="overview-section">
              <h2>Overview - {getTimeRangeLabel()}</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">📝</div>
                  <div className="metric-content">
                    <h3>Total Stories</h3>
                    <div className="metric-value">{metrics.overview.totalStories}</div>
                    <div className="metric-change positive">+{metrics.overview.storiesGrowth}%</div>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">👁</div>
                  <div className="metric-content">
                    <h3>Total Views</h3>
                    <div className="metric-value">{formatNumber(metrics.overview.totalViews)}</div>
                    <div className="metric-change positive">+{metrics.overview.viewsGrowth}%</div>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">👍</div>
                  <div className="metric-content">
                    <h3>Total Votes</h3>
                    <div className="metric-value">{formatNumber(metrics.overview.totalVotes)}</div>
                    <div className="metric-change positive">+{metrics.overview.votesGrowth}%</div>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div className="metric-content">
                    <h3>Revenue</h3>
                    <div className="metric-value">${metrics.overview.revenue}</div>
                    <div className="metric-change positive">+{metrics.overview.revenueGrowth}%</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Stories */}
            <section className="top-stories-section">
              <h2>Top Performing Stories</h2>
              <div className="top-stories-list">
                {metrics.topStories.map((story, index) => (
                  <div key={story.id} className="top-story-item">
                    <div className="story-rank">#{index + 1}</div>
                    <div className="story-details">
                      <h3>{story.title}</h3>
                      <div className="story-stats">
                        <span>👁 {formatNumber(story.views)} views</span>
                        <span>👍 {story.votes} votes</span>
                        <span>📊 {story.engagement}% engagement</span>
                      </div>
                    </div>
                    <div className="story-performance">
                      <div className="performance-bar">
                        <div 
                          className="performance-fill" 
                          style={{ width: `${story.engagement}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Engagement Analytics */}
            <section className="engagement-section">
              <h2>Engagement Analytics</h2>
              <div className="engagement-grid">
                <div className="engagement-card">
                  <h3>Average Engagement Rate</h3>
                  <div className="engagement-value">{metrics.engagement.averageRate}%</div>
                  <div className="engagement-trend positive">↗ +{metrics.engagement.trendChange}%</div>
                </div>
                
                <div className="engagement-card">
                  <h3>Peak Activity Time</h3>
                  <div className="engagement-value">{metrics.engagement.peakTime}</div>
                  <div className="engagement-detail">Most active hour</div>
                </div>
                
                <div className="engagement-card">
                  <h3>Average Read Time</h3>
                  <div className="engagement-value">{metrics.engagement.avgReadTime}m</div>
                  <div className="engagement-detail">Per story</div>
                </div>
              </div>
            </section>

            {/* User Demographics */}
            <section className="demographics-section">
              <h2>Audience Demographics</h2>
              <div className="demographics-grid">
                <div className="demo-card">
                  <h3>Top Countries</h3>
                  <div className="demo-list">
                    {metrics.demographics.countries.map((country, index) => (
                      <div key={index} className="demo-item">
                        <span className="demo-label">{country.name}</span>
                        <span className="demo-value">{country.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="demo-card">
                  <h3>Age Groups</h3>
                  <div className="demo-list">
                    {metrics.demographics.ageGroups.map((group, index) => (
                      <div key={index} className="demo-item">
                        <span className="demo-label">{group.range}</span>
                        <span className="demo-value">{group.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="demo-card">
                  <h3>Device Types</h3>
                  <div className="demo-list">
                    {metrics.demographics.devices.map((device, index) => (
                      <div key={index} className="demo-item">
                        <span className="demo-label">{device.type}</span>
                        <span className="demo-value">{device.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Revenue Breakdown */}
            <section className="revenue-section">
              <h2>Revenue Breakdown</h2>
              <div className="revenue-grid">
                <div className="revenue-card">
                  <h3>Story Boosts</h3>
                  <div className="revenue-amount">${metrics.revenue.boosts}</div>
                  <div className="revenue-percentage">{metrics.revenue.boostsPercentage}% of total</div>
                </div>
                
                <div className="revenue-card">
                  <h3>Vote Packs</h3>
                  <div className="revenue-amount">${metrics.revenue.votePacks}</div>
                  <div className="revenue-percentage">{metrics.revenue.votePacksPercentage}% of total</div>
                </div>
                
                <div className="revenue-card">
                  <h3>Pro Subscriptions</h3>
                  <div className="revenue-amount">${metrics.revenue.subscriptions}</div>
                  <div className="revenue-percentage">{metrics.revenue.subscriptionsPercentage}% of total</div>
                </div>
                
                <div className="revenue-card">
                  <h3>Priority Submissions</h3>
                  <div className="revenue-amount">${metrics.revenue.priority}</div>
                  <div className="revenue-percentage">{metrics.revenue.priorityPercentage}% of total</div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <a href="/submit" className="action-card">
                  <div className="action-icon">📝</div>
                  <h3>Submit New Story</h3>
                  <p>Share another cricket tale</p>
                </a>
                
                <a href="/boost" className="action-card">
                  <div className="action-icon">🚀</div>
                  <h3>Boost a Story</h3>
                  <p>Increase story visibility</p>
                </a>
                
                <a href="/vote" className="action-card">
                  <div className="action-icon">🗳️</div>
                  <h3>Vote on Stories</h3>
                  <p>Support community content</p>
                </a>
                
                <a href="/stories" className="action-card">
                  <div className="action-icon">📚</div>
                  <h3>Browse Stories</h3>
                  <p>Discover new tales</p>
                </a>
              </div>
            </section>
          </div>
        ) : (
          <div className="error-state">
            <h2>Unable to load analytics</h2>
            <p>Please try refreshing the page or contact support if the issue persists.</p>
            <button onClick={loadMetrics} className="btn btn-primary">Retry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;