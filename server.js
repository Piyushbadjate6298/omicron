import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup uploads folder
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Normalize all image formats to .jpg so every browser can display them
    const ext = file.mimetype === 'image/png' ? '.png'
              : file.mimetype === 'image/gif' ? '.gif'
              : file.mimetype === 'image/webp' ? '.webp'
              : '.jpg'; // covers jpeg, jfif, jpe, etc.
    const safeName = file.originalname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40);
    cb(null, Date.now() + '-' + safeName + ext);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files allowed'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) console.error("Database error:", err.message);
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Initialize DB
db.serialize(async () => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    gallery TEXT DEFAULT '[]',
    author TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Published',
    sequence_order INTEGER DEFAULT 0
  )`);
  // Add gallery column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE blogs ADD COLUMN gallery TEXT DEFAULT '[]'`, () => {});
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    service TEXT,
    subService TEXT,
    vehicle TEXT,
    date TEXT,
    persons TEXT,
    message TEXT,
    source_page TEXT,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create default admin
  db.get('SELECT * FROM admins WHERE username = ?', [DEFAULT_ADMIN_USER], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync(DEFAULT_ADMIN_PASS, 10);
      db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [DEFAULT_ADMIN_USER, hash]);
    }
  });
});

// Middleware to verify admin token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ ok: false, message: 'Invalid token' });
    req.admin = decoded;
    next();
  });
};

// LOGIN
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ ok: true, token });
    } else {
      res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }
  });
});

// ADMIN - BLOGS
app.get('/api/admin/blogs', authenticate, (req, res) => {
  db.all('SELECT * FROM blogs ORDER BY sequence_order ASC, published_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true, blogs: rows });
  });
});

app.post('/api/admin/blogs', authenticate, (req, res) => {
  const { title, slug, category, excerpt, content, image, gallery, author, status, sequence_order } = req.body;
  const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery : []);

  const insert = () => {
    db.run(
      'INSERT INTO blogs (title, slug, category, excerpt, content, image, gallery, author, status, sequence_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, category, excerpt, content, image, galleryJson, author, status, sequence_order || 0],
      function (err) {
        if (err) return res.status(500).json({ ok: false, message: err.message });
        res.json({ ok: true, id: this.lastID });
      }
    );
  };

  if (status === 'Published') {
    db.run('UPDATE blogs SET sequence_order = sequence_order + 1 WHERE status = "Published"', [], () => insert());
  } else {
    insert();
  }
});

app.put('/api/admin/blogs/:id', authenticate, (req, res) => {
  const { title, slug, category, excerpt, content, image, gallery, author, status } = req.body;
  const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery : []);
  db.run(
    'UPDATE blogs SET title=?, slug=?, category=?, excerpt=?, content=?, image=?, gallery=?, author=?, status=? WHERE id=?',
    [title, slug, category, excerpt, content, image, galleryJson, author, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ ok: false, message: err.message });
      res.json({ ok: true });
    }
  );
});

app.delete('/api/admin/blogs/:id', authenticate, (req, res) => {
  db.run('DELETE FROM blogs WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true });
  });
});

app.put('/api/admin/blogs/reorder', authenticate, (req, res) => {
  const { order } = req.body; // Array of { id, sequence_order }
  if (!Array.isArray(order)) return res.status(400).json({ ok: false });
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare('UPDATE blogs SET sequence_order = ? WHERE id = ?');
    order.forEach(item => {
      stmt.run(item.sequence_order, item.id);
    });
    stmt.finalize();
    db.run('COMMIT');
    res.json({ ok: true });
  });
});

// ADMIN - INQUIRIES
app.get('/api/admin/inquiries', authenticate, (req, res) => {
  db.all('SELECT * FROM inquiries ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true, inquiries: rows });
  });
});

app.put('/api/admin/inquiries/:id', authenticate, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE inquiries SET status=? WHERE id=?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true });
  });
});

app.delete('/api/admin/inquiries/:id', authenticate, (req, res) => {
  db.run('DELETE FROM inquiries WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true });
  });
});

// PUBLIC API
app.get('/api/public/blogs', (req, res) => {
  db.all('SELECT * FROM blogs WHERE status="Published" ORDER BY sequence_order ASC, published_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true, blogs: rows });
  });
});

app.get('/api/public/blogs/:slug', (req, res) => {
  db.get('SELECT * FROM blogs WHERE slug=? AND status="Published"', [req.params.slug], (err, row) => {
    if (err || !row) return res.status(404).json({ ok: false });
    res.json({ ok: true, blog: row });
  });
});

app.post('/api/inquiry', async (req, res) => {
  const { name, phone, email, service, subService, vehicle, date, persons, message, source_page = 'Unknown' } = req.body || {};
  if (!name || !phone) return res.status(400).json({ ok: false, message: 'Name and phone required' });
  
  db.run(
    'INSERT INTO inquiries (name, phone, email, service, subService, vehicle, date, persons, message, source_page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, email, service, subService, vehicle, date, persons, message, source_page],
    (err) => {
      if (err) console.error(err);
      res.json({ ok: true });
    }
  );
});

// Image Upload - single
app.post('/api/admin/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'No file' });
  res.json({ ok: true, url: '/uploads/' + req.file.filename });
});

// Image Upload - multiple (up to 10)
app.post('/api/admin/upload-multiple', authenticate, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ ok: false, message: 'No files' });
  const urls = req.files.map(f => '/uploads/' + f.filename);
  res.json({ ok: true, urls });
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on port 3000');
});
