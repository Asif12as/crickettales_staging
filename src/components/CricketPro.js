import React, { useState, useEffect } from 'react';

const CricketPro = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userProStatus, setUserProStatus] = useState({ isPro: false });
  const [message, setMessage] = useState('');
  const [proMetrics, setProMetrics] = useState(null);

  const plans = {
    monthly: {
      name: 'Monthly Pro',
      price: 9.99,
      billing: 'per month',
      savings: null
    },
    yearly: {
      name: 'Yearly Pro',
      price: 99.99,
      billing: 'per year',
      savings: 'Save 17%'
    }
  };

  const features = [
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Detailed insights into your story performance, reader engagement, and growth metrics'
    },
    {
      icon: '🎯',
      title: 'Priority Support',
      description: 'Get faster response times and dedicated support for all your questions'
    },
    {
      icon: '🚀',
      title: 'Enhanced Visibility',
      description: 'Pro badge on your profile and stories, plus algorithm boost for better reach'
    },
    {
      icon: '📝',
      title: 'Unlimited Submissions',
      description: 'Submit unlimited stories without any restrictions or waiting periods'
    },
    {
      icon: '💎',
      title: 'Exclusive Features',
      description: 'Access to beta features, exclusive content, and pro-only community events'
    },
    {
      icon: '📈',
      title: 'Performance Dashboard',
      description: 'Comprehensive dashboard with detailed metrics and growth tracking'
    }
  ];

  const handleTrialActivation = async () => {
    if (!trialData.email) {
      alert('Please enter your email address');
      return;
    }

    setIsActivating(true);
    setActivationStatus(null);

    try {
      const response = await fetch('/api/pro-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trialData)
      });

      const result = await response.json();

      if (response.ok) {
        setUserProStatus({
          isActive: true,
          plan: 'trial',
          expiryDate: result.expiryDate,
          trialUsed: true
        });
        setActivationStatus({ 
          type: 'success', 
          message: 'CricketPro trial activated! Enjoy 7 days of premium features.' 
        });
      } else {
        setActivationStatus({ 
          type: 'error', 
          message: result.error || 'Failed to activate trial' 
        });
      }
    } catch (error) {
      setActivationStatus({ 
        type: 'error', 
        message: 'Network error. Please try again.' 
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleSubscription = async () => {
    // In a real app, this would integrate with Stripe
    alert(`Redirecting to payment for ${plans[selectedPlan].name}...`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isTrialExpired = () => {
    if (!userProStatus.expiryDate) return false;
    return new Date() > new Date(userProStatus.expiryDate);
  };

  const getDaysRemaining = () => {
    if (!userProStatus.expiryDate) return 0;
    const expiry = new Date(userProStatus.expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="cricket-pro-page">
      <div className="container">
        {/* Current Status */}
        {userProStatus.isActive && (
          <div className={`pro-status ${isTrialExpired() ? 'expired' : 'active'}`}>
            <div className="status-content">
              <h2>🏆 CricketPro {userProStatus.plan === 'trial' ? 'Trial' : 'Subscription'}</h2>
              {isTrialExpired() ? (
                <p>Your trial has expired. Upgrade to continue enjoying pro features!</p>
              ) : (
                <p>
                  {userProStatus.plan === 'trial' 
                    ? `${getDaysRemaining()} days remaining in your trial`
                    : `Active until ${formatDate(userProStatus.expiryDate)}`
                  }
                </p>
              )}
            </div>
          </div>
        )}

        <div className="page-header">
          <h1>CricketPro Subscription</h1>
          <p>Unlock premium features and take your cricket storytelling to the next level</p>
        </div>

        {/* Features Grid */}
        <section className="features-section">
          <h2>Pro Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="pricing-section">
          <h2>Choose Your Plan</h2>
          <div className="plans-container">
            {Object.entries(plans).map(([key, plan]) => (
              <div 
                key={key}
                className={`plan-card ${selectedPlan === key ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(key)}
              >
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  {plan.savings && <span className="savings-badge">{plan.savings}</span>}
                </div>
                <div className="plan-price">
                  <span className="price">${plan.price}</span>
                  <span className="billing">{plan.billing}</span>
                </div>
                <div className="plan-features">
                  <p>✓ All Pro features included</p>
                  <p>✓ Priority customer support</p>
                  <p>✓ Advanced analytics dashboard</p>
                  <p>✓ Unlimited story submissions</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trial Section */}
        {!userProStatus.trialUsed && !userProStatus.isActive && (
          <section className="trial-section">
            <div className="trial-card">
              <h2>🎉 Start Your Free Trial</h2>
              <p>Try CricketPro free for 7 days. No credit card required!</p>
              
              <div className="trial-form">
                <div className="form-group">
                  <label htmlFor="trial-email">Email Address</label>
                  <input
                    type="email"
                    id="trial-email"
                    value={trialData.email}
                    onChange={(e) => setTrialData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="trial-plan">Plan Type</label>
                  <select
                    id="trial-plan"
                    value={trialData.planType}
                    onChange={(e) => setTrialData(prev => ({ ...prev, planType: e.target.value }))}
                  >
                    <option value="monthly">Monthly Plan Trial</option>
                    <option value="yearly">Yearly Plan Trial</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleTrialActivation}
                  disabled={isActivating}
                >
                  {isActivating ? 'Activating...' : 'Start Free Trial'}
                </button>
                
                {activationStatus && (
                  <div className={`activation-status ${activationStatus.type}`}>
                    {activationStatus.message}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Subscription Action */}
        {(!userProStatus.isActive || isTrialExpired()) && (
          <section className="subscription-action">
            <div className="action-card">
              <h2>Ready to Go Pro?</h2>
              <p>Join thousands of cricket enthusiasts who have upgraded to CricketPro</p>
              
              <div className="selected-plan-summary">
                <h3>Selected Plan: {plans[selectedPlan].name}</h3>
                <div className="plan-total">
                  <span className="total-price">${plans[selectedPlan].price}</span>
                  <span className="billing-cycle">{plans[selectedPlan].billing}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-large"
                onClick={handleSubscription}
              >
                Subscribe Now
              </button>
              
              <div className="subscription-benefits">
                <p>✓ Cancel anytime</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Instant access to all features</p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What's included in the free trial?</h3>
              <p>The 7-day free trial includes full access to all CricketPro features with no limitations.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel anytime?</h3>
              <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>We offer a 30-day money-back guarantee for all new subscriptions.</p>
            </div>
            <div className="faq-item">
              <h3>How do I access pro features?</h3>
              <p>Once subscribed, pro features are automatically unlocked in your account and dashboard.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CricketPro;