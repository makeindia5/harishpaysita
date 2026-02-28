const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const multer = require('multer');
const FlightRoute = require('./routes/FlightRoute');
const AuthRoutes = require('./routes/auth'); // ✅ Correct import
const { v4: uuidv4 } = require('uuid');
const hlrCheckRoute = require('./routes/hlrCheck'); // 👈 Use correct case (capital C)
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const addressRoutes = require("./routes/address");
const userDetails = require("./routes/userDetails");
const securityRoutes = require("./routes/security");


const app = express();
const PORT = process.env.PORT || 6000;
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Create uploads directory if not exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/api/address", addressRoutes);
app.use('/api/userDetails', userDetails);
app.use('/api', hlrCheckRoute);
app.use("/api/security", securityRoutes);

// Health check endpoint for CI/CD validation
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "production",
    api: "paysita-backend"
  });
});

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myappdb',
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Backend is running...');
});
app.use("/api", FlightRoute);
app.use("/api/auth", AuthRoutes); // ✅ Correct usage

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
// server.js or routes/token.js
// JWT Token Utilities
// const jwt = require('jsonwebtoken');

// // Base64-encoded secret key
// const secretKey = 'UFMwMDYxMzU2YjI2NDQ1MjI1NmMwNWE2MGQzMTZjNmY0ODc3MzhmOTE3NDcyODY5NDY=';

// const generateReqId = () => {
//   return `REQ_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
// };

// const getTimestamp = () => Math.floor(Date.now() / 1000);

// // Flexible token generator with product name
// const getToken = (product = 'WALLET') => {
//   return jwt.sign(
//     {
//       timestamp: getTimestamp(),
//       partnerId: 'PS006135',
//       product: product,
//       reqid: generateReqId()
//     },
//     secretKey,
//     {
//       algorithm: 'HS256',
//       header: {
//         typ: 'JWT',
//         alg: 'HS256'
//       }
//     }
//   );
// };

// Endpoint to return 2 tokens
app.get('/api/token', (req, res) => {
  const token1 = getToken('WALLET');
  const token2 = getToken('WALLET');
  const token3 = getToken('WALLET');


  res.json({ token1, token2, token3 });
});

app.post('/submit-general', (req, res) => {
  const { name, contact, email, insuranceType, additionalCoverage } = req.body;

  const query = `
  INSERT INTO general_insurance 
  (name, contact, email, insuranceType, additionalCoverage) 
  VALUES (?, ?, ?, ?, ?)
`;
  db.query(
    query,
    [
      name,
      contact,
      email,
      JSON.stringify(insuranceType),  // convert array to string
      JSON.stringify(additionalCoverage)
    ],
    (err, result) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ message: 'DB insert failed' });
      }
      res.status(200).json({ message: 'Success' });
    }
  );
});
//heath insurance
app.post('/submit-health', (req, res) => {
  const {
    contact,
    email,
    age,
    coverAmount,
    diseases,
    medicalHistory,
    badHabits,
    familyCount
  } = req.body;

  const query = `
    INSERT INTO health_insurance 
    (contact, email, age, coverAmount, diseases, medicalHistory, badHabits, familyCount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      contact,
      email,
      age,
      coverAmount,
      JSON.stringify(diseases),
      JSON.stringify(medicalHistory),
      JSON.stringify(badHabits),
      familyCount
    ],
    (err, result) => {
      if (err) {
        console.error('Health Insert Error:', err);
        return res.status(500).json({ message: 'Insert failed' });
      }
      res.status(200).json({ message: 'Health insurance submitted successfully' });
    }
  );
});
// ✅ POST route for Investment Form
app.post('/submit-investment', (req, res) => {
  const {
    name,
    contact,
    email,
    age,
    timeperiod,
    amount,
    expectedinterest,
    additionalRequirement
  } = req.body;

  // Validate required fields
  if (!name || !contact) {
    return res.status(400).json({ success: false, message: 'Name and contact are required' });
  }

  const query = `
    INSERT INTO investment_forms 
    (name, contact, email, age, timeperiod, amount, expectedinterest, additionalRequirement) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, contact, email, age, timeperiod, amount, expectedinterest, additionalRequirement],
    (err, result) => {
      if (err) {
        console.error('❌ Error inserting data:', err);
        return res.status(500).json({ success: false, message: 'Failed to submit form' });
      }

      res.status(200).json({ success: true, message: 'Investment form submitted successfully' });
    }
  );
});

// 🚀 POST route for Tour and Travels form
app.post('/submit-tour-travel', (req, res) => {
  const {
    name,
    email,
    contact,
    gender,
    serviceType,
    fromDate,
    toDate,
    Budget
  } = req.body;

  const query = `
    INSERT INTO tour_and_travel 
    (name, email, contact, gender, serviceType, fromDate, toDate, budget)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, contact, gender, serviceType, fromDate, toDate, Budget],
    (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ message: 'Failed to submit form' });
      }
      res.status(200).json({ message: 'Form submitted successfully' });
    }
  );
});
// POST /custom-packages
app.post('/custom-packages', async (req, res) => {
  const { destination, days, nights, priceRange, adults, children } = req.body;

  const query = `
    INSERT INTO custom_packages (destination, days, nights, price_range, adults, children)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [destination, days, nights, priceRange, adults, children];

  try {
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint to receive loan finance form data
app.post('/loan-finance', (req, res) => {
  const { name, email, contact, selectedLoans, income, loanAmount } = req.body;

  const sql = `
    INSERT INTO loan_finance 
    (name, email, contact, selectedLoans, income, loanAmount) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name,
    email,
    contact,
    JSON.stringify(selectedLoans),
    income,
    loanAmount
  ], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Fill-in all the details' });
    }
    res.status(200).json({ message: 'Form submitted successfully' });
  });
});
// dpoint to receive job post
app.post('/want-to-hire', upload.single('file'), (req, res) => {
  const {
    category,
    jobTitle,
    companyName,
    location,
    salary,
    contactEmail,
    description
  } = req.body;

  const filePath = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO want_to_hire 
    (category, jobTitle, companyName, location, salary, contactEmail, description, fileName) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    category,
    jobTitle,
    companyName,
    location,
    salary,
    contactEmail,
    description,
    filePath
  ], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Error saving job post' });
    }
    res.status(200).json({ message: 'Job post submitted successfully' });
  });
});
//referral form page
app.post('/api/referral', async (req, res) => {
  const { name, email, contact, category, message } = req.body;

  if (!name || !email || !contact || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const query = `
      INSERT INTO referrals (name, email, contact, category, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [name, email, contact, category, message]);

    res.status(200).json({ message: 'Referral submitted successfully' });
  } catch (err) {
    console.error('Referral insert error:', err);
    res.status(500).json({ message: 'Failed to submit referral' });
  }
});

// 🔗 POST API to save form
app.post('/api/home-service', (req, res) => {
  const {
    name, contact, email, district, taluka, pinCode,
    serviceType, propertyType, area, date, additionalRequirement
  } = req.body;

  const sql = `INSERT INTO home_service_requests 
    (name, contact, email, district, taluka, pinCode, serviceType, propertyType, area, date, additionalRequirement)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name, contact, email, district, taluka, pinCode,
    JSON.stringify(serviceType), propertyType, area, new Date(date), additionalRequirement
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: '✅ Form submitted successfully' });
  });
});

// ✅ POST API to save real estate form
app.post('/api/real-estate', (req, res) => {
  const {
    name, contact, email, purpose, possession,
    propertyType, budgetRange, carpetArea, additionalRequirement
  } = req.body;

  const sql = `INSERT INTO real_estate_leads 
    (name, contact, email, purpose, possession, propertyType, budgetMin, budgetMax, carpetArea, additionalRequirement) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name,
    contact,
    email,
    JSON.stringify(purpose),
    JSON.stringify(possession),
    JSON.stringify(propertyType),
    budgetRange[0],
    budgetRange[1],
    carpetArea,
    additionalRequirement
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error saving data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: '✅ Form submitted successfully' });
  });
});

// API to receive donation form
app.post('/api/submit-donation', (req, res) => {
  const {
    name,
    contact,
    email,
    donationAmount,
    paymentMethod,
    donationType,
    message
  } = req.body;

  const sql = `
    INSERT INTO donations (name, contact, email, donation_amount, payment_method, donation_type, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, contact, email, donationAmount, paymentMethod, donationType, message],
    (err, result) => {
      if (err) {
        console.error('Error inserting donation:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({ success: true, message: 'Donation submitted successfully' });
    }
  );
});
// API route to handle form submission
app.post('/api/education-form', (req, res) => {
  const {
    name,
    contact,
    email,
    purpose,
    qualification,
    income,
    courseInterest,
    universityInterest,
    countryInterest,
    additionalRequirement
  } = req.body;

  const sql = `
    INSERT INTO education_forms 
    (name, contact, email, purpose, qualification, income, course_interest, university_interest, country_interest, additional_requirement)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    contact,
    email,
    Array.isArray(purpose) ? purpose.join(',') : purpose,
    qualification,
    income,
    courseInterest,
    universityInterest,
    countryInterest,
    additionalRequirement
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ success: false, message: 'Database insert failed' });
    }
    res.json({ success: true, message: 'Form submitted successfully' });
  });
});

// ITR Form API
app.post('/api/itr', (req, res) => {
  const { name, contact, email, city, income, categories, profession } = req.body;

  const sql = `INSERT INTO itr_form 
    (name, contact, email, city, income, categories, profession) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [name, contact, email, city, income, categories.join(','), profession],
    (err, result) => {
      if (err) {
        console.error('❌ ITR Insert Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'ITR Form Submitted' });
    }
  );
});

// Save GST Form
app.post('/api/gst', async (req, res) => {
  const { name, contact, email, location, turnover, businessName, gstNumber, period } = req.body;

  try {
    const query = `INSERT INTO gst_forms (name, contact, email, location, turnover, business_name, gst_number, period) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [name, contact, email, location, turnover, businessName, gstNumber, period]);
    res.json({ message: 'GST form submitted successfully' });
  } catch (err) {
    console.error('❌ Error saving GST form:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Other Services Form POST route
// POST route for Other Services form
app.post('/submit-other-services', (req, res) => {
  const {
    name,
    contact,
    email,
    serviceType,
    gender,
    message
  } = req.body;

  const sql = `
    INSERT INTO other_services_submissions
    (name, contact, email, serviceType, gender, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, contact, email, serviceType, gender, message], (err, result) => {
    if (err) {
      console.error('❌ Error inserting:', err);
      return res.status(500).json({ error: 'DB insert failed' });
    }
    res.json({ message: '✅ Other services data saved', id: result.insertId });
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
