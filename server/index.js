require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');  

const app = express();
const PORT = process.env.PORT || 5001; 
const db = new Database('management.db');

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Missing credentials.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'You do not have permission for this action!' });
    }
    next();
  };
};

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => {
    const unic = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unic + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

db.exec(`
  CREATE TABLE IF NOT EXISTS utilizatori (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    parola TEXT NOT NULL,
    rol TEXT DEFAULT 'chirias'
  );

  CREATE TABLE IF NOT EXISTS apartamente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numar TEXT NOT NULL,
    etaj INTEGER,
    scara TEXT,
    status TEXT DEFAULT 'liber'
  );

  CREATE TABLE IF NOT EXISTS chiriasi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nume TEXT NOT NULL,
    email TEXT,
    telefon TEXT,
    apartament_id INTEGER,
    apartament_numar TEXT
  );

  CREATE TABLE IF NOT EXISTS facturi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chirias_id INTEGER,
    suma REAL NOT NULL,
    tip TEXT NOT NULL,
    data_emiterii TEXT NOT NULL,
    data_scadentei TEXT NOT NULL,
    status TEXT DEFAULT 'Neplătită'
  );

  CREATE TABLE IF NOT EXISTS mentenanta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titlu TEXT NOT NULL,
    descriere TEXT,
    chirias_id INTEGER,
    apartament_id INTEGER,
    poza TEXT,
    status TEXT DEFAULT 'Nouă',
    data_raportarii TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS documente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nume_fisier TEXT NOT NULL,
    tip TEXT NOT NULL,
    cale TEXT NOT NULL,
    chirias_id INTEGER,
    data_upload TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mesaje_contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    data_trimiterii TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    quote TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const checkManager = db.prepare("SELECT * FROM utilizatori WHERE rol = 'manager'").get();
if (!checkManager) {
  const hash = bcrypt.hashSync("ParolaManager123!", 10); 
  db.prepare("INSERT INTO utilizatori (email, parola, rol) VALUES (?, ?, ?)").run("manager@eif.ro", hash, "manager");
  console.log("🔑 Contul de manager a fost creat (manager@eif.ro)");
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, parola, rol } = req.body;
    const rolActual = rol || 'chirias';

    if (rolActual === 'chirias') {
      const chiriasAprobat = db.prepare('SELECT * FROM chiriasi WHERE email = ?').get(email);
      if (!chiriasAprobat) {
        return res.status(403).json({ 
          error: 'This email is not recognized. The manager must add you to the system first.' 
        });
      }
    }

    const hashedPassword = await bcrypt.hash(parola, 10);
    
    const r = db.prepare(
      'INSERT INTO utilizatori (email, parola, rol) VALUES (?, ?, ?)'
    ).run(email, hashedPassword, rolActual);
    
    res.status(201).json({ success: true, id: r.lastInsertRowid, message: 'User created successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, parola } = req.body;
    const user = db.prepare('SELECT * FROM utilizatori WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Incorrect email or password' });
    
    const isMatch = await bcrypt.compare(parola, user.parola);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect email or password' });
    
    let idReal = user.id;
    if (user.rol === 'chirias') {
      const profilChirias = db.prepare('SELECT id FROM chiriasi WHERE email = ?').get(email);
      if (profilChirias) {
        idReal = profilChirias.id;
      }
    }
    
    const token = jwt.sign(
      { id: idReal, rol: user.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token, rol: user.rol, id: idReal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Excellent connection! The server is online." });
});

app.get('/api/chiriasi', (req, res) => {
  try {
    const chiriasi = db.prepare('SELECT * FROM chiriasi').all();
    res.json(chiriasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chiriasi', verifyToken, authorizeRole('manager'), (req, res) => {
  try {
    const { nume, email, telefon, apartament_numar } = req.body;
    const r = db.prepare(
      'INSERT INTO chiriasi (nume, email, telefon, apartament_numar) VALUES (?, ?, ?, ?)'
    ).run(nume || '', email || '', telefon || '', apartament_numar || '');
    
    res.json({ success: true, id: r.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chiriasi/:id', verifyToken, authorizeRole('manager'), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM chiriasi WHERE id = ?').run(req.params.id);
    if (info.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tenant not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/apartamente', (req, res) => {
  res.json(db.prepare('SELECT * FROM apartamente').all());
});

app.post('/api/apartamente', (req, res) => {
  const { numar, etaj, scara, status } = req.body;
  const r = db.prepare(
    'INSERT INTO apartamente (numar, etaj, scara, status) VALUES (?, ?, ?, ?)'
  ).run(numar, etaj, scara, status || 'liber');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.delete('/api/apartamente/:id', (req, res) => {
  db.prepare('DELETE FROM apartamente WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/facturi', (req, res) => {
  res.json(db.prepare('SELECT * FROM facturi').all());
});

app.post('/api/facturi', (req, res) => {
  const { chirias_id, suma, tip, data_emiterii, data_scadentei, status } = req.body;
  const r = db.prepare(
    'INSERT INTO facturi (chirias_id, suma, tip, data_emiterii, data_scadentei, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(chirias_id, suma, tip, data_emiterii, data_scadentei, status || 'Neplătită');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.patch('/api/facturi/:id/status', (req, res) => {
  db.prepare('UPDATE facturi SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ success: true });
});

app.delete('/api/facturi/:id', (req, res) => {
  db.prepare('DELETE FROM facturi WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/mentenanta', (req, res) => {
  res.json(db.prepare('SELECT * FROM mentenanta').all());
});

app.post('/api/mentenanta', upload.single('poza'), (req, res) => {
  const { titlu, descriere, chirias_id, apartament_id, status } = req.body;
  const poza = req.file ? `/uploads/${req.file.filename}` : null;
  const r = db.prepare(
    'INSERT INTO mentenanta (titlu, descriere, chirias_id, apartament_id, poza, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(titlu, descriere, chirias_id, apartament_id, poza, status || 'Nouă');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.patch('/api/mentenanta/:id/status', (req, res) => {
  db.prepare('UPDATE mentenanta SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ success: true });
});

app.get('/api/documente', (req, res) => {
  res.json(db.prepare('SELECT * FROM documente').all());
});

app.post('/api/documente', upload.single('fisier'), (req, res) => {
  try {
    const { nume_fisier, tip, chirias_id } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a valid file.' });
    }
    const cale = `/uploads/${req.file.filename}`;
    const info = db.prepare(`
      INSERT INTO documente (nume_fisier, tip, chirias_id, cale)
      VALUES (?, ?, ?, ?)
    `).run(nume_fisier, tip, chirias_id, cale);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/documente/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM documente WHERE id = ?').run(req.params.id);
    if (info.changes > 0) res.json({ success: true });
    else res.status(404).json({ error: 'Document not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/contact', (req, res) => {
  res.json(db.prepare('SELECT * FROM mesaje_contact ORDER BY id DESC').all());
});

app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Fields are required.' });
  }
  try {
    const r = db.prepare(
      'INSERT INTO mesaje_contact (firstName, lastName, email, phone, message) VALUES (?, ?, ?, ?, ?)'
    ).run(firstName, lastName, email, phone || '', message);
    res.json({ success: true, id: r.lastInsertRowid, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id ASC').all();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  const { author, quote } = req.body;
  if (!author || !quote) {
    return res.status(400).json({ error: 'Fields are required.' });
  }
  try {
    const r = db.prepare(
      'INSERT INTO reviews (author, quote) VALUES (?, ?)'
    ).run(author, quote);
    res.status(201).json({ success: true, id: r.lastInsertRowid, message: 'Review saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});