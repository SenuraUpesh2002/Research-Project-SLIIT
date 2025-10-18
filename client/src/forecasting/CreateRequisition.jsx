import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

function CreateRequisition() {
  const [value, setValue] = useState(""); // State for radio button selection

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    
    <div className="d-flex mt-5 bg-white justify-content-center align-items-center">
      <form>
        {/* Title Section */}
        <div
          style={{
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography variant="h4" component="h1" >
            Requisition Form Use Of Vehicles
          </Typography>
          <Typography variant="subtitle1">
            <center>Mahapola Ports & Maritime Academy - Sri Lanka Ports Authority</center>
          </Typography>
         
        </div> <hr></hr>

        {/* Form Fields */}
        <center>
          <TextField
            label="Name of the officer"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Place(s) of visit"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Purpose of visit"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          <br />
          <br />
          <TextField
            label="Vehicle required on (Date)"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Vehicle required on (Time)"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          <br />
          <br />
          <TextField
            label="Expected return on (Date)"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Expected return on (Time)"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          <br />
          <br />
          <TextField
            label="Names of the officer(s) accompanying"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Contact Number"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
          &nbsp;&nbsp;
          <TextField
            label="Signature of the officer"
            variant="outlined"
            style={{ width: "300px" }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "blue", // Default stroke color
                },
                "&:hover fieldset": {
                  borderColor: "blue", // Stroke color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "blue", // Stroke color when focused
                },
              },
              "& .MuiInputBase-input": {
                color: "blue", // Text color
              },
              "& .MuiInputLabel-root": {
                color: "blue", // Label text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "blue", // Label color when focused
              },
            }}
          />
        </center>
        <br />
        <hr />
        {/* Office Use Section */}
        <Typography style={{ color: "red" }}>For Office Use Only</Typography>
        <br />
        <Typography>Transport Clerk</Typography>
        <br />

        {/* Radio Group */}
        <FormControl>
          
          <RadioGroup value={value} onChange={handleChange}>
            <FormControlLabel value="approved" control={<Radio />} label="Approved" />
            <FormControlLabel value="napproved" control={<Radio />} label="Not Approved" />
           
          </RadioGroup>
        </FormControl>

        <br /><br></br>
<p>
        <Typography>Vehicles</Typography></p>

        <FormControl>
          
          <RadioGroup value={value} onChange={handleChange}>
            <FormControlLabel value="bus" control={<Radio />} label="Bus (ND - 6462)" />
            <FormControlLabel value="van1" control={<Radio />} label="Van (PB - 9686)" />
            <FormControlLabel value="van2" control={<Radio />} label="Van (58 - 8135)" />
            <FormControlLabel value="lorry" control={<Radio />} label="Lorry (GC - 6939)" />
            <FormControlLabel value="threewheel" control={<Radio />} label="Three Wheel (QN - 7661)" />
          </RadioGroup>
        </FormControl>

<br></br><br></br><br></br>
<div>
<TextField
            label="Signature of the Authorizing Officer"
            variant="outlined"
            style={{ width: "300px" }}
            required
          />
    </div><br></br><br></br>











        {/* Buttons */}
        <center>
          <div className="mb-5">
          <Button variant="contained" color="primary">
            Submit
          </Button>
          &nbsp;&nbsp;
          <Button variant="outlined" color="primary">
            Clear Form
          </Button></div>
        </center>
      </form>
    </div>
  );
}

export default CreateRequisition;
