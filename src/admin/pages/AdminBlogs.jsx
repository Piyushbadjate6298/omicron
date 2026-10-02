import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, X, Check, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminBlogs.css';

const CATEGORIES = [
  'Travel Guides', 'Road Trips', 'Destinations', 'Luxury Travel',
  'Family Travel', 'Adventure', 'Travel Tips', 'Weekend Getaways',
];

const EMPTY_FORM = {
  title: '', slug: '', category: 'Travel Guides', excerpt: '',
  content: '', image: '', gallery: [], author: 'Omicron Travel Desk', status: 'Draft',
};

/* ── tiny rich-text toolbar ── */
function execCmd(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

function BlogEditor({ value, onChange }) {
  const ref = useRef(null);

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  // Set initial content once
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, []); // eslint-disable-line

  return (
    <div className="blog-editor-wrap">
      <div className="blog-editor-toolbar">
        {[
          { label: 'B', cmd: 'bold', title: 'Bold' },
          { label: 'I', cmd: 'italic', title: 'Italic' },
          { label: 'U', cmd: 'underline', title: 'Underline' },
        ].map(b => (
          <button key={b.cmd} type="button" title={b.title}
            onMouseDown={e => { e.preventDefault(); execCmd(b.cmd); }}
            style={{ fontWeight: b.cmd === 'bold' ? '900' : 'normal', fontStyle: b.cmd === 'italic' ? 'italic' : 'normal' }}>
            {b.label}
          </button>
        ))}
        <button type="button" title="Heading" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'h3'); }}>H3</button>
        <button type="button" title="Paragraph" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'p'); }}>P</button>
        <button type="button" title="Bullet List" onMouseDown={e => { e.preventDefault(); execCmd('insertUnorderedList'); }}>• List</button>
        <button type="button" title="Quote" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'blockquote'); }}>" Quote</button>
        <button type="button" title="Link" onMouseDown={e => {
          e.preventDefault();
          const url = window.prompt('Enter URL:');
          if (url) execCmd('createLink', url);
        }}>🔗 Link</button>
        <button type="button" title="Clear formatting" onMouseDown={e => { e.preventDefault(); execCmd('removeFormat'); }}>✕ Clear</button>
      </div>
      <div
        ref={ref}
        className="blog-editor-body"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      />
    </div>
  );
}

/* ── Image Upload Zone (Featured) ── */
function ImageUploader({ label, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [localUrl, setLocalUrl] = useState('');
  const inputRef = useRef(null);

  // The displayed URL = freshly uploaded URL (localUrl) OR the saved URL from DB (currentUrl)
  const displayUrl = localUrl || currentUrl || '';

  const handleFile = async (file) => {
    if (!file) return;
    // Show a local object-URL immediately for instant preview
    const tempUrl = URL.createObjectURL(file);
    setLocalUrl(tempUrl);
    setUploading(true);

    const fd = new FormData();
    fd.append('image', file);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: fd,
      });
      const data = await res.json();
      if (data.ok) {
        setLocalUrl(data.url); // replace blob URL with server URL
        onUploaded(data.url);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="img-upload-zone"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => !uploading && inputRef.current?.click()}
      style={{ cursor: uploading ? 'wait' : 'pointer' }}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={e => handleFile(e.target.files[0])} />

      {displayUrl ? (
        <div className="img-upload-preview">
          <img src={displayUrl} alt="featured" onError={e => { e.target.style.display='none'; }} />
          <div className="img-upload-overlay">
            {uploading ? '⏳ Uploading…' : <><Upload size={16} /> Change photo</>}
          </div>
        </div>
      ) : (
        <div className="img-upload-placeholder">
          {uploading ? (
            <><span style={{fontSize:24}}>⏳</span><span>Uploading…</span></>
          ) : (
            <><Upload size={28} /><span>{label || 'Click or drag photo here'}</span><small>JPG, PNG, WEBP — max 10MB</small></>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Gallery grid: upload + manage multiple images ── */
function GalleryUploader({ gallery, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  // Keep a ref to always have the latest gallery without stale closure
  const galleryRef = useRef(gallery);
  useEffect(() => { galleryRef.current = gallery; }, [gallery]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setUploading(true);
    setUploadProgress('Uploading ' + fileList.length + ' photo' + (fileList.length > 1 ? 's' : '') + '…');

    // Show instant local blob previews immediately
    const blobUrls = fileList.map(f => URL.createObjectURL(f));
    const withBlobs = [...galleryRef.current, ...blobUrls];
    onChange(withBlobs);

    try {
      const fd = new FormData();
      fileList.forEach(f => fd.append('images', f));
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/upload-multiple', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: fd,
      });
      const data = await res.json();
      if (data.ok) {
        // Swap blob URLs out for real server URLs — use the ref for latest value
        const withoutBlobs = galleryRef.current.filter(u => !u.startsWith('blob:'));
        onChange([...withoutBlobs, ...data.urls]);
        setUploadProgress('');
      } else {
        // Remove blobs on failure
        onChange(galleryRef.current.filter(u => !u.startsWith('blob:')));
        setUploadProgress('Upload failed. Try again.');
      }
    } catch (err) {
      console.error('Gallery upload failed', err);
      onChange(galleryRef.current.filter(u => !u.startsWith('blob:')));
      setUploadProgress('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const remove = (idx) => {
    const next = [...galleryRef.current];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="gallery-uploader">
      <div className="gallery-grid">
        {gallery.map((url, i) => (
          <div key={url + i} className="gallery-item">
            <img src={url} alt="" onError={e => { e.target.style.opacity = 0.3; }} />
            <button type="button" className="gallery-remove" onClick={() => remove(i)} title="Remove"><X size={13} /></button>
          </div>
        ))}

        {/* Upload button — label wraps input for maximum click reliability */}
        <label className="gallery-add" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={e => {
              if (e.target.files?.length) {
                handleFiles(e.target.files);
                // Reset so the same file can be re-selected
                e.target.value = '';
              }
            }}
          />
          {uploading
            ? <span style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>⏳</span>
            : <><Plus size={22} /><small>Add photos</small></>}
        </label>
      </div>

      {uploadProgress && (
        <small style={{ color: uploadProgress.includes('failed') ? '#e53e3e' : '#805ad5', marginTop: 4 }}>
          {uploadProgress}
        </small>
      )}
      <small className="gallery-hint">
        Drag & drop onto the grid, or click "Add photos". Select multiple files at once. Max 10MB each.
      </small>
    </div>
  );
}

/* ── Main component ── */
export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = () => localStorage.getItem('adminToken');

  const fetchBlogs = async () => {
    if (!token()) return navigate('/admin');
    const res = await fetch('/api/admin/blogs', { headers: { Authorization: 'Bearer ' + token() } });
    if (res.status === 401) return navigate('/admin');
    const data = await res.json();
    if (data.ok) setBlogs(data.blogs.map(b => ({
      ...b,
      gallery: (() => { try { return JSON.parse(b.gallery || '[]'); } catch { return []; } })()
    })));
  };

  useEffect(() => { fetchBlogs(); }, []);

  // Auto-generate slug from title
  const setTitle = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setEditForm(f => ({ ...f, title: val, slug: f.slug || slug }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog? This cannot be undone.')) return;
    await fetch('/api/admin/blogs/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token() } });
    fetchBlogs();
  };

  const handleReorder = async (id, dir) => {
    const idx = blogs.findIndex(b => b.id === id);
    if (idx < 0 || (dir === -1 && idx === 0) || (dir === 1 && idx === blogs.length - 1)) return;
    const next = [...blogs];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    setBlogs(next.map((b, i) => ({ ...b, sequence_order: i })));
    await fetch('/api/admin/blogs/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
      body: JSON.stringify({ order: next.map((b, i) => ({ id: b.id, sequence_order: i })) }),
    });
  };

  const openNew = () => {
    setEditForm({ ...EMPTY_FORM });
    setIsEditing(true);
  };

  const openEdit = (b) => {
    setEditForm({ ...b, gallery: Array.isArray(b.gallery) ? b.gallery : [] });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = { ...editForm };
    if (!form.slug) {
      form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const url = form.id ? '/api/admin/blogs/' + form.id : '/api/admin/blogs';
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setIsEditing(false);
    fetchBlogs();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Blogs</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Add New Blog
        </button>
      </div>

      {/* Blog List Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b, i) => (
              <tr key={b.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="admin-btn-icon" disabled={i === 0} onClick={() => handleReorder(b.id, -1)} style={{ padding: 4 }}><ArrowUp size={14} /></button>
                    <button className="admin-btn-icon" disabled={i === blogs.length - 1} onClick={() => handleReorder(b.id, 1)} style={{ padding: 4 }}><ArrowDown size={14} /></button>
                  </div>
                </td>
                <td><img src={b.image || '/destinations/hero-himachal.webp'} alt="" style={{ width: 70, height: 46, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td>
                  <strong>{b.title}</strong>
                  <br /><small style={{ color: '#718096' }}>/{b.slug}</small>
                  {b.gallery?.length > 0 && <small style={{ color: '#9f7aea', display: 'block' }}>📷 {b.gallery.length} gallery photo{b.gallery.length > 1 ? 's' : ''}</small>}
                </td>
                <td>{b.category}</td>
                <td><span className={'badge badge-' + b.status}>{b.status}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn-icon" title="Edit" onClick={() => openEdit(b)}><Edit size={16} /></button>
                    <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(b.id)}><Trash2 size={16} /></button>
                    <a className="admin-btn-icon" href={'/blog/' + b.slug} target="_blank" rel="noreferrer" title="Preview"><Eye size={16} /></a>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>No blogs yet. Click "Add New Blog" to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Blog Editor Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="blog-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editForm.id ? 'Edit Blog' : 'New Blog'}</h2>
              <button className="modal-close" onClick={() => setIsEditing(false)}><X /></button>
            </div>

            <form onSubmit={handleSave} className="blog-edit-form">
              {/* ── Row 1: Title + Status ── */}
              <div className="form-row-2">
                <div className="admin-form-group">
                  <label>Blog Title *</label>
                  <input type="text" placeholder="e.g. Top 10 Road Trips in India"
                    value={editForm.title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <div className="status-toggle">
                    {['Draft', 'Published'].map(s => (
                      <button key={s} type="button"
                        className={editForm.status === s ? 'active' : ''}
                        onClick={() => setEditForm(f => ({ ...f, status: s }))}>
                        {s === 'Draft' ? <EyeOff size={14} /> : <Eye size={14} />} {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Row 2: Slug + Category + Author ── */}
              <div className="form-row-3">
                <div className="admin-form-group">
                  <label>URL Slug <small>(auto-filled)</small></label>
                  <input type="text" placeholder="auto-generated-from-title"
                    value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Author Name</label>
                  <input type="text" placeholder="e.g. Omicron Travel Desk"
                    value={editForm.author} onChange={e => setEditForm(f => ({ ...f, author: e.target.value }))} />
                </div>
              </div>

              {/* ── Short Description ── */}
              <div className="admin-form-group">
                <label>Short Description / Excerpt *</label>
                <textarea placeholder="2-3 lines summarising the blog. Shown on blog cards and previews."
                  value={editForm.excerpt} onChange={e => setEditForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={3} required />
              </div>

              {/* ── Featured Image ── */}
              <div className="admin-form-group">
                <label>Featured Image <small>(cover / hero photo)</small></label>
                <ImageUploader
                  label="Click here or drag & drop your cover photo"
                  currentUrl={editForm.image}
                  onUploaded={url => setEditForm(f => ({ ...f, image: url }))}
                />
                <div style={{ marginTop: 8 }}>
                  <input type="text" placeholder="Or paste an image URL: https://… or /destinations/photo.jpg"
                    value={editForm.image}
                    onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', color: '#4a5568' }}
                  />
                </div>
              </div>

              {/* ── Gallery Images ── */}
              <div className="admin-form-group">
                <label>Blog Gallery Photos <small>(up to 10 additional images)</small></label>
                <GalleryUploader
                  gallery={editForm.gallery}
                  onChange={urls => setEditForm(f => ({ ...f, gallery: urls }))}
                />
              </div>

              {/* ── Full Blog Content ── */}
              <div className="admin-form-group">
                <label>Blog Content *</label>
                <BlogEditor
                  value={editForm.content}
                  onChange={html => setEditForm(f => ({ ...f, content: html }))}
                />
              </div>

              {/* ── Save buttons ── */}
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : <><Check size={16} /> {editForm.id ? 'Update Blog' : 'Save Blog'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}