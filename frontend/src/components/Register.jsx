import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', course: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const courses = [
    'B.Tech Computer Science','B.Tech Electronics','B.Tech Mechanical',
    'B.Tech Civil','BCA','MCA','MBA','M.Tech','B.Sc Physics','B.Sc Mathematics'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, formData);
      setMessage({ text: res.data.message, type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Registration failed.', type: 'error' });
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
            <div className="logo-icon">🎓</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the student portal today</p>
          </div>
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span>{message.type === 'success' ? '✅' : '❌'}</span> {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input type="text" name="name" placeholder="Full Name"
                value={formData.name} onChange={handleChange} required className="auth-input" />
            </div>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange} required className="auth-input" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" placeholder="Password (min 6 chars)"
                value={formData.password} onChange={handleChange} required className="auth-input" />
            </div>
            <div className="input-group">
              <span className="input-icon">📚</span>
              <select name="course" value={formData.course} onChange={handleChange}
                required className="auth-input auth-select">
                <option value="">Select Your Course</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? <span className="btn-loading"><span className="spinner"></span> Registering...</span>
                : <span>Register Now →</span>}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}