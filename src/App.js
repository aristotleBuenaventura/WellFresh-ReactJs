import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Navbar from './components/Navbar';
import About from './routes/About';
import HomePatient from './routes/HomePatient'
import DoctorDetails from './routes/doctorDetails';
import HomeDoctor from './routes/HomeDoctor';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDetails from './routes/patientDetails';
import AppointmentHistoryPatient from './routes/appointmentHistoryPatient';
import AppointmentList from './routes/appointmentList';
import AppointmentHistoryDoctor from './routes/appointmentHistoryDoctor';
import AddAppointments from './routes/AddAppointments';
import EditProfilePage from './routes/EditProfilePage';
import Profile from './routes/Profile';
import Contact from './routes/Contact';



function Layout({ children, isLoggedIn, setIsLoggedIn }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div style={{ flex: "1 0 auto" }}>
        {children}
      </div>
      {/* <Footer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} style={{ bottom: "0", width: "100%" }} /> */}
 
    </div>
  );
}

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route
            path="/"
            element={
              <LoginScreen
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route path="/Register" element={<RegisterScreen />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Home/HomePatient" element={<HomePatient />} />
          <Route path="/Home/HomeDoctor" element={<HomeDoctor />} />
          <Route path="/DoctorDetails" element={<DoctorDetails />} />
          <Route path="/AppointmentList" element={<AppointmentList />} />
          <Route path="/PatientDetails" element={<PatientDetails />} />
          <Route path="/AddAppointments" element={<AddAppointments />} />
          <Route
            path="/AppointmentHistoryPatient"
            element={<AppointmentHistoryPatient />}
          />
          <Route
            path="/AppointmentHistoryDoctor"
            element={<AppointmentHistoryDoctor />}
          />
          <Route path="/About" element={<About />} />
          <Route path="/EditProfilePage" element={<EditProfilePage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    
  );
}

export default App;
