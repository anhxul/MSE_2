import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      setMessage({ text: res.data.message, type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Login failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-overlay"></div>
      <div className="auth-card">
        <div className="card-glow"></div>
        <div className="card-inner">
          <div className="auth-header">
            <div className="logo-icon">🔐</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Login to your student portal</p>
          </div>
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span>{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange} required className="auth-input" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" placeholder="Password"
                value={formData.password} onChange={handleChange} required className="auth-input" />
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? <span className="btn-loading"><span className="spinner"></span> Logging in...</span>
                : <span>Login →</span>}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}