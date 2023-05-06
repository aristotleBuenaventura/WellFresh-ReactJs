import React from 'react';
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
import EditProfilePage from './routes/EditProfilePage';
import Profile from './routes/Profile';
import Contact from './routes/Contact';



function Layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route exact path="/Login" element={<LoginScreen />} />
                <Route path="/Register" element={<RegisterScreen />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Home/HomePatient" element={<HomePatient />} />
                <Route path="/Home/HomeDoctor" element={<HomeDoctor />} />
                <Route path="/DoctorDetails" element={<DoctorDetails />} />
                <Route path="/AppointmentList" element={<AppointmentList />} />
                <Route path="/PatientDetails" element={<PatientDetails />} />
                <Route path="/AppointmentHistoryPatient" element={<AppointmentHistoryPatient />} />
                <Route path="/AppointmentHistoryDoctor" element={<AppointmentHistoryDoctor />} />
                <Route path="/About" element={<About />} />
                <Route path="/EditProfilePage" element={<EditProfilePage />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Contact" element={<Contact />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;