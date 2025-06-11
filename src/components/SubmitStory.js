import React, { useState } from 'react';
import axios from 'axios';

const SubmitStory = ({ onStorySubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    story: '',
    priorityBoost: false
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If priority boost is selected, handle the payment process first
      if (formData.priorityBoost) {
        // In a real implementation, you would redirect to a payment page or open a payment modal
        // For now, we'll just show a message
        console.log('Priority boost selected - would redirect to payment');
      }
      
      const res = await axios.post('/api/story-submit', formData);
      if (res.status === 200) {
        setStatus('success');
        setFormData({ name: '', email: '', date: '', story: '', priorityBoost: false });
        if (onStorySubmit) onStorySubmit();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Submit Your Cricket Tale</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Author Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="story"
          placeholder="Write your story here..."
          rows="6"
          value={formData.story}
          onChange={handleChange}
          required
          style={styles.textarea}
        ></textarea>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="priorityBoost"
            name="priorityBoost"
            checked={formData.priorityBoost}
            onChange={handleChange}
            style={styles.checkbox}
          />
          <label htmlFor="priorityBoost" style={styles.checkboxLabel}>
            Priority Boost ($5) - Feature your story at the top!
          </label>
        </div>

        <button type="submit" style={styles.submitButton}>
          Submit Story
        </button>

        {status === 'success' && (
          <p style={styles.success}>✅ Story submitted!</p>
        )}
        {status === 'error' && (
          <p style={styles.error}>❌ Please try again.</p>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '24px',
    border: '2px dashed #2c5530',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  heading: {
    fontFamily: 'Georgia, serif',
    color: '#2c5530',
    marginBottom: '20px',
    fontSize: '1.8rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '12px',
    margin: '8px 0',
    borderRadius: '6px',
    border: '2px solid #ddd',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  },
  textarea: {
    padding: '12px',
    margin: '8px 0',
    borderRadius: '6px',
    border: '2px solid #ddd',
    fontSize: '1rem',
    resize: 'vertical',
    transition: 'border-color 0.3s ease'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '12px 0'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  checkboxLabel: {
    fontSize: '1rem',
    cursor: 'pointer'
  },
  submitButton: {
    backgroundColor: '#2c5530',
    color: '#fff',
    border: 'none',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'background-color 0.3s ease'
  },
  success: {
    marginTop: '16px',
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  error: {
    marginTop: '16px',
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center'
  }
};

export default SubmitStory;