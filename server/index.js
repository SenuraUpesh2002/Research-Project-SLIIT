const express = require('express')     //express package
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");
const mysql = require('mysql');

  
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

const TANK_HEIGHT = 37.78;  // cm
const TANK_RADIUS = 16.51;  // cm

function calculateVolumeLitres(distance) {
  const h = TANK_HEIGHT - distance;
  if (h <= 0) return 0;
  if (h > TANK_HEIGHT) return Math.PI * Math.pow(TANK_RADIUS, 2) * TANK_HEIGHT / 1000;
  const volumeCM3 = Math.PI * Math.pow(TANK_RADIUS, 2) * h;
  return volumeCM3 / 1000;
}


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



app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// GET general info by Id
app.get("/fs-view2/:stationId", (req, res) => {
  const { stationId } = req.params;
  console.log("GET /fs-view2/", stationId);

  const sql = "SELECT Id, Name, Location FROM fs_general_information WHERE Id = ?";

  connection.query(sql, [stationId], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!result || result.length === 0) {
      return res.status(404).json([]);
    }

    // send rows as array; frontend takes data[0]
    res.json(result);
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



// GET station general + contact info by Id
app.get("/fs-view2/:stationId", (req, res) => {
  const { stationId } = req.params;

  const sql = `
    SELECT 
      g.Id,
      g.Name,
      g.Location,
      c.PersonName,
      c.PersonDesignation,
      c.PersonEmail,
      c.ContactNumber,
      c.StartTime,
      c.EndTime
    FROM fs_general_information AS g
    LEFT JOIN fs_contact_information AS c
      ON g.Id = c.Id
    WHERE g.Id = ?
  `;

  connection.query(sql, [stationId], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (!result || result.length === 0) {
      return res.status(404).json([]);
    }
    res.json(result);           // array; frontend takes [0]
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
  const volume = calculateVolumeLitres(reading);
  connection.query(
    'INSERT INTO jsnsr04t (reading, volume, reading_time) VALUES (?, ?, ?)',
    [reading, volume, new Date()],
    (err, result) => {
      if (err) {
        console.error('DB Error: ', err);
        return res.status(500).send('DB Error');
      }
      res.json({ message: 'Sensor reading stored', id: result.insertId, reading, volume });
    }
  );
});



// REGISTER
// POST /register
app.post("/register", (req, res) => {
  const { uniqueid, email, role, password } = req.body;

  if (!uniqueid || !email || !role || !password) {
    return res
      .status(400)
      .json({ error: "Unique Station ID, email, role and password are required" });
  }

  // 1) Check that this Unique Station ID exists in fs_ceypetco
  const checkStationSql = "SELECT 1 FROM fs_ceypetco WHERE stationId = ? LIMIT 1";
  connection.query(checkStationSql, [uniqueid], (err, stationRows) => {
    if (err) {
      console.error("DB Error (station check):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If station does NOT exist -> STOP here, do NOT insert into registration
    if (stationRows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid Unique Station ID. This station is not registered." });
    }

    // 2) Station is valid. Now check duplicates in registration
    const dupSql =
      "SELECT 1 FROM registration WHERE email = ? OR uniqueid = ? LIMIT 1";
    connection.query(dupSql, [email, uniqueid], (err2, dupRows) => {
      if (err2) {
        console.error("DB Error (duplicate check):", err2);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (dupRows.length > 0) {
        return res
          .status(409)
          .json({ error: "Email or Unique Station ID already registered" });
      }

      // 3) Finally insert into registration (only for valid station IDs)
      const insertSql =
        "INSERT INTO registration (uniqueid, email, role, password) VALUES (?, ?, ?, ?)";
      connection.query(
        insertSql,
        [uniqueid, email, role, password],
        (err3, result) => {
          if (err3) {
            console.error("DB Error (insert):", err3);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          return res
            .status(201)
            .json({ message: "User registered successfully", id: result.insertId });
        }
      );
    });
  });
});






// LOGIN
app.post("/login", (req, res) => {
  const { uniqueid, email, password } = req.body;

  if (!uniqueid || !email || !password) {
    return res
      .status(400)
      .json({ error: "Unique Station ID, email and password are required" });
  }

  // A) Ensure this uniqueid exists in fs_ceypetco
  const stationSql = "SELECT 1 FROM fs_ceypetco WHERE stationId = ? LIMIT 1";
  connection.query(stationSql, [uniqueid], (err, stationRows) => {
    if (err) {
      console.error("DB Error (station check):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (stationRows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid Unique Station ID. Station not found." });
    }

    // B) Authenticate user with this uniqueid + email + password
    const authSql =
      "SELECT * FROM registration WHERE uniqueid = ? AND email = ? AND password = ? LIMIT 1";
    connection.query(authSql, [uniqueid, email, password], (err2, rows) => {
      if (err2) {
        console.error("DB Error (login):", err2);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (rows.length === 1) {
        return res.json({ message: "Login successful", user: rows[0] });
      }
      return res
        .status(401)
        .json({ error: "Invalid Unique Station ID, email or password" });
    });
  });
});







// API to get sensor health status
app.get('/sensor/health', (req, res) => {
  connection.query(
    'SELECT MAX(reading_time) AS lastReading, AVG(reading) AS avgReading FROM jsnsr04t',
    (err, results) => {
      if (err) return res.status(500).send('DB Error');
      const lastReadingTime = results[0].lastReading;
      const avgReading = results[0].avgReading;
      const now = new Date();
      const diffMins = lastReadingTime ? (now - new Date(lastReadingTime)) / 1000 / 60 : null;

      const active = diffMins !== null && diffMins < 15 && avgReading > 0 && avgReading <= 37.78;
      res.json({ active, diffMins: diffMins || 9999, avgReading });
    }
  );
});

// API to simulate sensor test
app.post('/sensor/test', (req, res) => {
  // For actual hardware: trigger test measurement or diagnostics here
  // Here we simulate success
  res.json({ message: "Sensor test triggered successfully." });
});



app.listen(8081 , () => {
    console.log("Server is running")
})