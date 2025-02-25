import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config(); // Load environment variables

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(express.json()); // Enable JSON body parsing

// Create MySQL connection pool
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

// Promisify MySQL queries
const query = promisify(db.query).bind(db);

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database.');
  connection.release();
});


 // API to fetch all past prescriptions for a patient
/*app.get('/history', async (req, res) => {
  const { patientID } = req.query;

  if (!patientID) {
    console.log("❌ Missing Patient ID");
    return res.status(400).json({ error: "Patient ID is required" });
  }

  console.log(`🔍 Fetching history for Patient ID: ${patientID}`);

  const sql = `
    SELECT p.patientID, p.date, p.doctor, p.complaint, p.observation, p.diagnosis,
           pm.medicine, pm.dosage, pm.days, pm.quantity, pm.remark
    FROM prescriptions p
    JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
    WHERE p.patientID = ?
    ORDER BY p.date DESC;
  `;

  try {
    console.log("🚀 Executing query:", sql);
    const rows = await query(sql, [patientID]);

    if (rows.length === 0) {
      console.log("⚠️ No history found for Patient ID:", patientID);
      return res.status(404).json({ error: "No history found" });
    }

    console.log("✅ Query result:", rows);
    return res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});*/
// API to fetch all past prescriptions for a patient
app.get('/history', async (req, res) => {
  const { patientID } = req.query;

  if (!patientID) {
    console.log("❌ Missing Patient ID");
    return res.status(400).json({ error: "Patient ID is required" });
  }

  console.log(`🔍 Fetching history for Patient ID: ${patientID}`);

  const sql = `
    SELECT p.prescription_id, p.date, p.doctor, p.complaint, p.observation, p.diagnosis,
           pm.medicine, pm.dosage, pm.days, pm.quantity, pm.remark
    FROM prescriptions p
    JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
    WHERE p.patientID = ?
    ORDER BY p.date DESC;
  `;

  try {
    console.log("🚀 Executing query:", sql);
    const rows = await query(sql, [patientID]);

    if (rows.length === 0) {
      console.log("⚠️ No history found for Patient ID:", patientID);
      return res.status(404).json({ error: "No history found" });
    }

    // Transform the flat response into a nested structure
    const groupedData = rows.reduce((acc, row) => {
      const existingEntry = acc.find(
        (entry) => entry.prescription_id === row.prescription_id
      );

      if (existingEntry) {
        existingEntry.medicines.push({
          medicine: row.medicine,
          dosage: row.dosage,
          days: row.days,
          quantity: row.quantity,
          remark: row.remark,
        });
      } else {
        acc.push({
          prescription_id: row.prescription_id,
          date: row.date,
          doctor: row.doctor,
          complaint: row.complaint,
          observation: row.observation,
          diagnosis: row.diagnosis,
          medicines: [
            {
              medicine: row.medicine,
              dosage: row.dosage,
              days: row.days,
              quantity: row.quantity,
              remark: row.remark,
            },
          ],
        });
      }
      return acc;
    }, []);

    console.log("✅ Transformed query result:", groupedData);
    return res.json(groupedData);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});











// API to search for a patient by ID
app.get('/get-patient/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid patient ID format' });
  }

  try {
    const sql = 'SELECT * FROM patientsfull WHERE patient_id = ?';
    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('❌ Error fetching patient details:', err);
    res.status(500).json({ error: 'Database error, unable to fetch patient details.' });
  }
});

// API to search medicines
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


// API to handle patient registration
app.post('/register-patient', async (req, res) => {
  const {
    patient_id,  // Manually entered Primary Key
    patientName,
    dob,
    email,
    age,
    gender,
    bloodType,
    allergies,
    existingConditions,
    emergencyContact,
    address
  } = req.body;

  // ✅ Validate required fields
  if (!patient_id || !patientName || !dob || !email || !age || !gender || !emergencyContact || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ✅ Insert into the patientsfull table
    const sql = `INSERT INTO patientsfull1 (patient_id, patientName, dob, email, age, gender, bloodType, allergies, existingConditions, emergencyContact, address) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await query(sql, [patient_id, patientName, dob, email, age, gender, bloodType, allergies, existingConditions, emergencyContact, address]);

    res.status(201).json({ message: 'Patient registered successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A patient with this ID already exists.' });
    }
    console.error('❌ Database error:', err.message);
    res.status(500).json({ error: 'Database error, unable to register patient.' });
  }
});





 
// API to save prescription data
 
app.post('/save-prescription', async (req, res) => {
  const { patientID, date, doctor, complaint, observation, diagnosis, medications } = req.body;

  console.log("Received patientID:", patientID);

  // Validate required fields
  if (!patientID || !date || !doctor || !complaint || !observation || !diagnosis || !Array.isArray(medications) || medications.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const prescriptionSql = `INSERT INTO prescriptions (patientID, date, doctor, complaint, observation, diagnosis) VALUES (?, ?, ?, ?, ?, ?)`;
    const prescriptionResult = await query(prescriptionSql, [patientID, date, doctor, complaint, observation, diagnosis]);

    const prescriptionId = prescriptionResult.insertId; // ✅ Fix: Assign prescriptionId

    console.log('✅ Prescription Inserted:', prescriptionResult);

    // Insert medication data if medications exist
    if (medications.length > 0) {
      const medicationSql = `INSERT INTO prescription_medicines (prescription_id, medicine, dosage, days, quantity, remark) VALUES ?`;
      const medicationValues = medications.map(med => [prescriptionId, med.medicine, med.dosage, med.days, med.quantity, med.remark]);

      await query(medicationSql, [medicationValues]);
      console.log("✅ Medications inserted successfully");
    }

    res.status(201).json({ message: 'Prescription saved successfully!', prescriptionId }); // ✅ Send response only once

  } catch (err) {
    console.error('❌ Error saving prescription:', err.message);
    res.status(500).json({ error: 'Database error, unable to save prescription.' });
  }
});




// API to retrieve all prescriptions
app.get('/get-prescriptions', async (req, res) => {
  try {
    const sql = `
      SELECT p.id, p.date, p.doctor, p.complaint, p.observation, p.diagnosis, 
             pm.medicine, pm.dosage, pm.days, pm.quantity, pm.remark
      FROM prescriptions p
      LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
    `;
    const results = await query(sql);

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

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


 