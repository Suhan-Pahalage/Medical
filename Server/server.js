/*import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config(); // Load environment variables

const app = express();

// 🔹 CORS Configuration (Handles multiple origins)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173']; // Default frontend URL

app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(express.json()); // Enable JSON body parsing

// 🔹 Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'medical_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true
});

// 🔹 Promisify MySQL queries for async/await support
const query = promisify(db.query).bind(db);

// 🔹 Check the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit process on failure
  }
  console.log('✅ Connected to MySQL database.');
  connection.release();
});

// 🔹 API to search medicines (Secure & Optimized)
app.get('/search-medicine', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) return res.json([]); // Return empty if no input

  try {
    const sql = 'SELECT name FROM medicines WHERE name LIKE ? LIMIT 10';
    const results = await query(sql, [`%${searchQuery}%`]);

    res.json(results.map((row) => row.name)); // Send only medicine names
  } catch (err) {
    console.error('❌ Database query error:', err.message);
    res.status(500).json({ error: 'Database query failed. Please try again later.' });
  }
});

// 🔹 Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/

import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config(); // Load environment variables

const app = express();

// 🔹 CORS Configuration (Handles multiple origins)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173']; // Default frontend URL

app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(express.json()); // Enable JSON body parsing

// 🔹 Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'medical_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true
});

// 🔹 Promisify MySQL queries for async/await support
const query = promisify(db.query).bind(db);

// 🔹 Check the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit process on failure
  }
  console.log('✅ Connected to MySQL database.');
  connection.release();
});

// 🔹 API to search medicines
app.get('/search-medicine', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) return res.json([]);

  try {
    const sql = 'SELECT name FROM medicines WHERE name LIKE ? LIMIT 10';
    const results = await query(sql, [`%${searchQuery}%`]);
    res.json(results.map((row) => row.name));
  } catch (err) {
    console.error('❌ Database query error:', err.message);
    res.status(500).json({ error: 'Database query failed. Please try again later.' });
  }
});

// 🔹 API to store prescription data in MySQL
app.post('/save-prescription', async (req, res) => {
  const { date, doctor, complaint, observation, diagnosis, medications } = req.body;

  if (!date || !doctor || !complaint || !observation || !diagnosis || !medications.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert prescription details
    const prescriptionSql = 'INSERT INTO prescriptions (date, doctor, complaint, observation, diagnosis) VALUES (?, ?, ?, ?, ?)';
    const prescriptionResult = await query(prescriptionSql, [date, doctor, complaint, observation, diagnosis]);
    const prescriptionId = prescriptionResult.insertId;

    // Insert medications into `prescription_medicines` table
    const medicationSql = 'INSERT INTO prescription_medicines (prescription_id, medicine, dosage, days, quantity, remark) VALUES ?';
    const medicationValues = medications.map(med => [prescriptionId, med.medicine, med.dosage, med.days, med.quantity, med.remark]);

    await query(medicationSql, [medicationValues]);

    res.status(201).json({ message: 'Prescription saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving prescription:', err.message);
    res.status(500).json({ error: 'Database error, unable to save prescription.' });
  }
});

// 🔹 API to retrieve all prescriptions
app.get('/get-prescriptions', async (req, res) => {
  try {
    const sql = `
      SELECT p.id, p.date, p.doctor, p.complaint, p.observation, p.diagnosis, 
             pm.medicine, pm.dosage, pm.days, pm.quantity, pm.remark
      FROM prescriptions p
      LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
    `;
    const results = await query(sql);

    // Group medications under their respective prescriptions
    const prescriptions = results.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          date: row.date,
          doctor: row.doctor,
          complaint: row.complaint,
          observation: row.observation,
          diagnosis: row.diagnosis,
          medications: []
        };
      }
      if (row.medicine) {
        acc[row.id].medications.push({
          medicine: row.medicine,
          dosage: row.dosage,
          days: row.days,
          quantity: row.quantity,
          remark: row.remark
        });
      }
      return acc;
    }, {});

    res.json(Object.values(prescriptions));
  } catch (err) {
    console.error('❌ Error retrieving prescriptions:', err.message);
    res.status(500).json({ error: 'Database error, unable to fetch prescriptions.' });
  }
});

// 🔹 Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
