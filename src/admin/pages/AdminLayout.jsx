import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, LogOut } from 'lucide-react';
import './Admin.css';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/brand/omicron-journeys-transparent-v2.png" alt="Omicron Admin" />
        </div>
        <nav className="admin-nav">
          <Link to="/admin/blogs" className={location.pathname.includes('/blogs') ? 'active' : ''}>
            <FileText size={18} /> Blogs
          </Link>
          <Link to="/admin/inquiries" className={location.pathname.includes('/inquiries') ? 'active' : ''}>
            <MessageSquare size={18} /> Inquiries
          </Link>
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
