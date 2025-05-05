import logo from './logo.svg';
import './App.css';
import  Login  from './comp/login';
import  Register  from './comp/register';
import Parking from './comp/Parking';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './index.css';
import './flags.css';
import AllCars from './comp/AllCars';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PositionedObjects from './comp/PositionedObjects';
import Menu from './comp/Navbar';


function App() {
  return (
    <div className="App">
           <Menu/>

      <Routes>

        <Route path="/" element={<Login/>} />
        {/* <Route path="/login" element={<Login/>} /> */}

        {/* <Route path="/Register" element={<Register/>} />
        <Route path="/allcars" element={<AllCars />} />

        <Route path="/parking" element={<Parking />} />
        <Route path="/PositionedObjects" element={<PositionedObjects />} /> */}

      </Routes>
    </div>
  );
}

export default App;