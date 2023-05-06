import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function DoctorInfo({ id }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const userRef = firestore.collection("users").doc(id);
    const unsubscribe = userRef.onSnapshot((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUsers(userData);
      } else {
        console.log("User not found");
      }
    });
    return unsubscribe;
  }
}, [id]);

  return (
    <div>
      <p>
        Dr. {users.lastname} {users.firstname}
      </p>
    </div>
  );
}

function AllUsers({ id }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchAllUsers = async () => {
    const usersRef = firestore.collection("appointments");
    
    usersRef.onSnapshot((querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        if (appointment.patientId === id && appointment.status === "done") {
          usersData.push({ id: doc.id, ...appointment });
        }
      });
      setUsers(usersData);
    });
  };

  fetchAllUsers();
}, [id]);



  return (
    <div>
      <ul className="text-center list-unstyled row w-100">
        {users.map((user) => (
          <li key={user.id} className="col-6 p-2">
            <button className="btn border">
              <div className="row">
                <div className="col">
                  <p className="fw-bold">
                    {user.month} {user.day}, {user.year}
                  </p>
                  <p className="text-primary">{user.time}</p>
                  <DoctorInfo id={user.docId} />
                </div>
                <div className="col d-flex align-items-center justify-content-center">
                  <button className="btn border btn-success">View Notes</button>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppointmentHistoryPatient() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("patientId");
  const [user, setUser] = useState([]);

  useEffect(() => {
  const fetchUserData = () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = firestore.collection("users").doc(id);
      userRef.onSnapshot((userPatient) => {
        if (userPatient.exists) {
          const userData = userPatient.data();
          setUser(userData);
        } else {
          console.log("User not found");
        }
      });
    }
  };

  fetchUserData();
}, [auth.currentUser, firestore, id]);

  return (
    <div className="container mt-5">
      <h1>Patient's History</h1>
      <div className="row ">
        <div className="col-12 col-md-6">
          <img className="w-50" src={user.imageUrl} alt="My Image" />
        </div>
        <div className="col-6">
          <p className="fw-bold h3">
            {user.lastname} {user.firstname}
          </p>
          <p className=" h5">{user.phoneNumber}</p>
          <p className=" h5">{user.email}</p>
        </div>
      </div>
      <div>
        <h3 className="fw-bold mt-4">History</h3>
        <AllUsers id={id} />
      </div>
    </div>
  );
}

export default AppointmentHistoryPatient;
