import { useState, useEffect } from 'react';
import { Eye, Trash2, Mail, Phone, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin');
    const res = await fetch('/api/admin/inquiries', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401) return navigate('/admin');
    const data = await res.json();
    if (data.ok) setInquiries(data.inquiries);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/inquiries/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status })
    });
    fetchInquiries();
    if (selected && selected.id === id) setSelected({ ...selected, status });
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/inquiries/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    fetchInquiries();
    if (selected && selected.id === id) setSelected(null);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Service', 'Status', 'Message'];
    const rows = inquiries.map(i => [
      i.created_at, i.name, i.phone, i.email, i.service, i.status, i.message
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(f => '"' + String(f).replace(/"/g, '""') + '"').join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inquiries.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = (i.name + i.email + i.phone).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Inquiries</h1>
        <button className="btn btn-ghost" onClick={exportCSV}><Download size={16}/> Export CSV</button>
      </div>

      <div className="admin-card" style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <input type="text" placeholder="Search name, phone, email..." className="admin-form-group" style={{ margin: 0, flex: 1, padding: '10px 14px', border: '1px solid #ccc', borderRadius: 8 }} value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 8 }} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id}>
                <td>{new Date(i.created_at).toLocaleDateString()}</td>
                <td><strong>{i.name}</strong></td>
                <td>{i.phone}<br/><small>{i.email}</small></td>
                <td>{i.service}</td>
                <td><span className={'badge badge-' + i.status.replace(' ','')}>{i.status}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn-icon" onClick={() => setSelected(i)} title="View"><Eye size={16}/></button>
                    <button className="admin-btn-icon delete" onClick={() => deleteInquiry(i.id)} title="Delete"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding: '40px'}}>No inquiries found.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button className="modal-close" onClick={()=>setSelected(null)}><X/></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p><strong>Name:</strong> {selected.name}</p>
                <p><strong>Phone:</strong> {selected.phone} <a href={'https://wa.me/'+selected.phone.replace(/\D/g,'')} target="_blank" rel="noreferrer"><Phone size={14}/> WhatsApp</a></p>
                <p><strong>Email:</strong> {selected.email} {selected.email && <a href={'mailto:'+selected.email}><Mail size={14}/></a>}</p>
                <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
                <p><strong>Source Page:</strong> {selected.source_page || 'Website'}</p>
              </div>
              <div>
                <p><strong>Service:</strong> {selected.service}</p>
                <p><strong>Sub-Service:</strong> {selected.subService}</p>
                <p><strong>Vehicle:</strong> {selected.vehicle}</p>
                <p><strong>Travel Date:</strong> {selected.date}</p>
                <p><strong>Persons:</strong> {selected.persons}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p><strong>Message:</strong></p>
                <div style={{ background: '#f7fafc', padding: '16px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{selected.message || 'No message provided.'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 16 }}>
                <p><strong>Update Status:</strong></p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className={'btn ' + (selected.status === 'New' ? 'btn-primary' : 'btn-ghost')} onClick={()=>updateStatus(selected.id, 'New')}>New</button>
                  <button className={'btn ' + (selected.status === 'In Progress' ? 'btn-primary' : 'btn-ghost')} onClick={()=>updateStatus(selected.id, 'In Progress')}>In Progress</button>
                  <button className={'btn ' + (selected.status === 'Resolved' ? 'btn-primary' : 'btn-ghost')} onClick={()=>updateStatus(selected.id, 'Resolved')}>Resolved</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}