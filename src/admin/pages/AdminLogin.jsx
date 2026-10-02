import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/blogs');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/blogs');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <img src="/brand/omicron-journeys-transparent-v2.png" alt="Logo" className="admin-login-logo" />
        <h2>Admin Portal</h2>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary admin-login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}