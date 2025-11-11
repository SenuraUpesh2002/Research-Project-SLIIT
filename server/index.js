const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");
const mysql = require('mysql');
import mysql from "mysql2/promise";
  
const app = express()
app.use(bodyParser.json());




  

app.use(cors())
app.use(express.json())


app.get("/",(req,res) => {
    res.json("Hello from backend");
})


 // A simple SELECT query
 
/*  connection.query(
    'SELECT * FROM drivers',
    function (err, results, fields) {
        if(err){
            console.log(err)
        }else{
            console.log(results); // results contains rows returned by server
            //console.log(fields); // fields contains extra meta data about results, if available
        }
      
    }
  );
 */
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3308,
  user: 'root',
  password: '',
  database: 'fuelwatch'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});


  app.post("/fs-view2", (req, res) => {
    const { Id, Name, Location } = req.body;

    const sql = "INSERT INTO fs_general_information (Id, Name, Location) VALUES (?, ?, ?)";
    const values = [Id, Name, Location];
    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "General informations added successfully", id: result.insertId });
    });
});


app.post("/fs-view3", (req, res) => {
    const { Id, PersonName, PersonDesignation, PersonEmail, ContactNumber, StartTime, EndTime } = req.body;
    const sql = "INSERT INTO fs_contact_information (Id, PersonName, PersonDesignation, PersonEmail, ContactNumber, StartTime, EndTime) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [Id, PersonName, PersonDesignation, PersonEmail, ContactNumber, StartTime, EndTime];
    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Contact information added successfully", id: result.insertId });
    });
});


app.post("/fs-view4", (req, res) => {
  const { StationId, FuelInfo } = req.body;
  if (!StationId || !Array.isArray(FuelInfo) || FuelInfo.length === 0) {
    return res.status(400).json({ error: "Station Id and Fuel Info are required" });
  }

  // Gather rows for each tank, not just fuel type!
  // (stationid, fuel_type, number_of_tanks, tank_index, tank_capacity)
  const allTanks = [];
  FuelInfo.forEach(f => {
    for (let i = 0; i < f.tanks; i++) {
      allTanks.push([
        StationId,
        f.fuelType,
        f.tanks,
        i + 1,
        Number(f.capacities[i])
      ]);
    }
  });

  if (allTanks.length === 0) {
    return res.status(400).json({ error: "No tank capacities given" });
  }

  const sql = "INSERT INTO fs_fuel_information (stationId, fuel_type, number_of_tanks, tank_index, tank_capacity) VALUES ?";
  connection.query(sql, [allTanks], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Fuel information and tank capacities added successfully", insertedRows: result.affectedRows });
  });
});


// app.get("/fs-fuel-info/:stationId", (req, res) => {
//   const { stationId } = req.params;
//   const sql = "SELECT fuel_type, number_of_tanks FROM fs_fuel_information WHERE station_id = ?";
//   connection.query(sql, [stationId], (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });
app.get("/fs_fuel_information/:stationId", (req, res) => {
  const { stationId } = req.params;
  const sql = "SELECT fuel_type, number_of_tanks FROM fs_fuel_information WHERE stationId = ?";
  connection.query(sql, [stationId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.get('/fs_fuel_information/:stationId', async (req, res) => {
  const stationId = req.params.stationId;

  try {
    // Replace with your actual DB connection and query code
    const [rows] = await db.execute(
      'SELECT fuel_type, number_of_tanks FROM fs_fuel_information WHERE station_id = ?',
      [stationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No fuel information found for this station.' });
    }

    // Respond with array of fuel_type and number_of_tanks objects
    res.json(rows);
  } catch (error) {
    console.error('Error fetching fuel information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/fs_fuel_information/capacities', async (req, res) => {
  const { stationId, capacities } = req.body;
  try {
    for (const [fuelType, tanks] of Object.entries(capacities)) {
      for (let i = 0; i < tanks.length; i++) {
        await db.execute(
          'INSERT INTO fs_tank_capacity (stationId, fuel_type, tank_index, tank_capacity) VALUES (?, ?, ?, ?)',
          [stationId, fuelType, i + 1, Number(tanks[i])]
        );
      }
    }
    res.json({ message: "Tank capacities saved successfully!" });
  } catch (err) {
    console.error('Error saving tank capacities:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/fs_fuel_information/:stationId', (req, res) => {
  const stationId = req.params.stationId;
  // Ensure you select tank_index and tank_capacity!
  connection.query(
    "SELECT fuel_type, tank_index, tank_capacity FROM fs_fuel_information WHERE stationid = ? ORDER BY fuel_type, tank_index",
    [stationId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});


// Endpoint to get general information for a given stationId
// app.get('/api/fs_general_information/:stationId', (req, res) => {
//   const stationId = req.params.stationId;
//   connection.query(
//     "SELECT * FROM fs_general_information WHERE Id = ?",
//     [stationId],
//     (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows);
//     }
//   );
// });


app.get("/api/fs_ceypetco/:stationId", (req, res) => {
  const { stationId } = req.params;

  console.log("🔍 Searching for Station ID:", stationId);

  const query = `
    SELECT Dealer_Name AS Name, Address AS Location
    FROM fs_ceypetco
    WHERE stationId = ?
  `;

  connection.query(query, [stationId], (err, rows) => {
    if (err) {
      console.error("❌ Database error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!rows.length) {
      console.log("⚠️ No match found for Station ID:", stationId);
      return res.status(404).json({ message: "Station ID not found" });
    }

    console.log("✅ Match found:", rows[0]);
    return res.json(rows[0]);
  });
});


//Retrieval of sensor data
app.get('/sensor', (req, res) => {
  connection.query('SELECT * FROM jsnsr04t ORDER BY reading_time DESC LIMIT 10', (err, results) => {
    if (err) return res.status(500).send('DB Error');
    res.json(results);
  });
});

app.post('/sensor', (req, res) => {
  const { reading } = req.body;
  connection.query(
    'INSERT INTO jsnsr04t (reading) VALUES (?)',
    [reading],
    (err, result) => {
      if (err) {
        console.error('DB Error: ', err);
        return res.status(500).send('DB Error');
      }
      res.send('OK');
    }
  );
});


// Registration page(Register.jsx) endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, role, password } = req.body;

    // Basic validation
    if (!email || !role || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email already exists
    const [existingUsers] = await db.query("SELECT * FROM registration WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    await db.query(
      "INSERT INTO registration (email, role, password) VALUES (?, ?, ?)",
      [email, role, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(8081 , () => {
    console.log("Server is running")
})