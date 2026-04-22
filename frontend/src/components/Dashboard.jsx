import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const [courseMsg, setCourseMsg] = useState({ text: '', type: '' });
  const [courseLoading, setCourseLoading] = useState(false);

  const courses = [
    'B.Tech Computer Science','B.Tech Electronics','B.Tech Mechanical',
    'B.Tech Civil','BCA','MCA','MBA','M.Tech','B.Sc Physics','B.Sc Mathematics'
  ];

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, getAuthHeader());
      setStudent(res.data.student);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
    } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true); setPwMsg({ text: '', type: '' });
    try {
      const res = await axios.put(`${API_URL}/update-password`, pwData, getAuthHeader());
      setPwMsg({ text: res.data.message, type: 'success' });
      setPwData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally { setPwLoading(false); }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setCourseLoading(true); setCourseMsg({ text: '', type: '' });
    try {
      const res = await axios.put(`${API_URL}/update-course`, { course: newCourse }, getAuthHeader());
      setCourseMsg({ text: res.data.message, type: 'success' });
      setStudent(res.data.student); setNewCourse('');
    } catch (err) {
      setCourseMsg({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally { setCourseLoading(false); }
  };

  if (loading) return (
    <div className="dash-loading">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dash-bg-orbs">
        <div className="dash-orb dash-orb-1"></div>
        <div className="dash-orb dash-orb-2"></div>
        <div className="dash-orb dash-orb-3"></div>
      </div>
      <nav className="dash-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">StudentPortal</span>
        </div>
        <div className="nav-user">
          <span className="nav-greeting">Hello, {student?.name?.split(' ')[0]}!</span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </nav>

      <div className="dash-container">
        <div className="profile-hero">
          <div className="profile-avatar">{student?.name?.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h2 className="profile-name">{student?.name}</h2>
            <p className="profile-email">📧 {student?.email}</p>
            <div className="profile-badge">{student?.course}</div>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {new Date(student?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">✅</span>
              <span className="stat-label">Status</span>
              <span className="stat-value active-status">Active</span>
            </div>
          </div>
        </div>

        <div className="dash-tabs">
          {[{id:'profile',icon:'👤',label:'Profile'},{id:'password',icon:'🔒',label:'Password'},{id:'course',icon:'📚',label:'Course'}]
            .map(tab => (
              <button key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="tab-panel">
              <h3 className="panel-title">📋 Student Details</h3>
              <div className="details-grid">
                {[
                  {label:'Full Name', value:student?.name, icon:'👤'},
                  {label:'Email', value:student?.email, icon:'📧'},
                  {label:'Course', value:student?.course, icon:'📚'},
                  {label:'Student ID', value:student?._id?.slice(-8).toUpperCase(), icon:'🆔'}
                ].map(item => (
                  <div key={item.label} className="detail-card">
                    <div className="detail-icon">{item.icon}</div>
                    <div className="detail-content">
                      <span className="detail-label">{item.label}</span>
                      <span className="detail-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-panel">
              <h3 className="panel-title">🔐 Update Password</h3>
              <p className="panel-desc">Change your account password securely.</p>
              {pwMsg.text && (
                <div className={`alert alert-${pwMsg.type}`}>
                  {pwMsg.type === 'success' ? '✅' : '❌'} {pwMsg.text}
                </div>
              )}
              <form onSubmit={handleUpdatePassword} className="update-form">
                <div className="input-group">
                  <span className="input-icon">🔑</span>
                  <input type="password" placeholder="Current Password"
                    value={pwData.oldPassword}
                    onChange={e => setPwData({...pwData, oldPassword: e.target.value})}
                    required className="auth-input" />
                </div>
                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="New Password (min 6 chars)"
                    value={pwData.newPassword}
                    onChange={e => setPwData({...pwData, newPassword: e.target.value})}
                    required className="auth-input" />
                </div>
                <button type="submit" disabled={pwLoading} className="auth-btn">
                  {pwLoading ? <><span className="spinner"></span> Updating...</> : 'Update Password →'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'course' && (
            <div className="tab-panel">
              <h3 className="panel-title">📚 Change Course</h3>
              <p className="panel-desc">Current course: <strong className="current-course">{student?.course}</strong></p>
              {courseMsg.text && (
                <div className={`alert alert-${courseMsg.type}`}>
                  {courseMsg.type === 'success' ? '✅' : '❌'} {courseMsg.text}
                </div>
              )}
              <form onSubmit={handleUpdateCourse} className="update-form">
                <div className="input-group">
                  <span className="input-icon">📖</span>
                  <select value={newCourse} onChange={e => setNewCourse(e.target.value)}
                    required className="auth-input auth-select">
                    <option value="">Select New Course</option>
                    {courses.filter(c => c !== student?.course).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={courseLoading} className="auth-btn">
                  {courseLoading ? <><span className="spinner"></span> Updating...</> : 'Update Course →'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}