import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
//import Dashboard  from './components/Dashboard/Dashboard';
import Sensors from "./Drivers";
import CreateUsers from './CreateUser';
import UpdateUsers from './UpdateUser';
import ForecastingHome from './forecasting/ForecastingHome';
import MuiSample from './MuiSample';
import axios from "axios"
import CreateRequisition from './forecasting/CreateRequisition';
import View1 from "./StationRegister/View1";
import View2 from './StationRegister/View2';
import View3 from './StationRegister/View3';
import View4 from './StationRegister/View4';
import View5 from './StationRegister/View5';
import View6 from './StationRegister/View6';
import ComponentHome from './ComponentHome/FuelDashboard';
import FuelLevel from './ComponentHome/FuelLevel'; 
import StationInfo from './ComponentHome/StationInfo';
import Sensor from './ComponentHome/Sensor';
import Register from './ComponentHome/Register';

function App() {

  const[count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path='/fs-view1' element={<View1/>}></Route>
          <Route path='/fs-view2' element={<View2/>}></Route>
          <Route path='/fs-view3' element={<View3/>}></Route>
          <Route path='/fs-view4' element={<View4/>}></Route>
          <Route path='/fs-view5' element={<View5/>}></Route>
          <Route path="/fs-view5/:stationId" element={<View5 />} />
          <Route path='/fs-view6' element={<View6/>}></Route>
          <Route path='/' element={<ComponentHome/>}></Route>
          <Route path='/ComponentHome/FuelLevel' element={<FuelLevel/>}></Route>
          <Route path='/StationInfo' element={<StationInfo/>}></Route>
          
          <Route path='/sensor' element={<Sensor/>}></Route>
          {/* <Route path='/sensor' element={<Sensors/>} ></Route> */}
          <Route path='/register' element={<Register/>}></Route> 
          <Route path='/create' element={<CreateUsers/>} ></Route>
          <Route path='/update' element={<UpdateUsers/>} ></Route>
          <Route path='/forecasting' element={<ForecastingHome/>} ></Route>
          <Route path='/createrequisition' element={<CreateRequisition/>} ></Route>
          <Route path='/mui' element={<MuiSample/>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
