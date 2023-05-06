import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

function PatientInfo({ id }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = firestore.collection("users").doc(id);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        setUsers(userData);
      } else {
        console.log("User not found");
      }
    }
  };

  fetchUserData();
}, [id]);


  return (
    <div>
      <p>{users.firstname}</p>
    </div>
  );
}

function PatientImage({ id }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = firestore.collection("users").doc(id);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setUsers(userData);
        } else {
          console.log("User not found");
        }
      }
    };

    fetchUserData();
  });

  return (
    <div>
      <img className="w-50" src={users.imageUrl} alt="My Image" />
    </div>
  );
}

function AllUsers({ id }) {
  const [users, setUsers] = useState([]);
const navigate = useNavigate();

useEffect(() => {
  const fetchAllUsers = () => {
    const unsubscribe = firestore.collection("appointments")
      .onSnapshot((snapshot) => {
        const usersData = snapshot.docs
          .map((appointment) => ({
            id: appointment.id,
            ...appointment.data(),
          }))
          .filter((user) => user.docId === id && user.status === "ongoing");

        setUsers(usersData);
      });
    
    return unsubscribe;
  };

  const unsubscribe = fetchAllUsers();

  return () => {
    unsubscribe();
  };
}, []); 


  return (
    <div>
      <ul className="text-center list-unstyled row w-100">
        {users.map((user) => (
          <li key={user.id} className="col-6 p-2">
            <button
              className="btn border"
              onClick={() =>
                navigate(
                  `/patientDetails/?patientId=${user.patientId}&month=${user.month}&day=${user.day}&year=${user.year}&time=${user.time}&appointmentId=${user.id}`
                )
              }
            >
              <div className="row ">
                <div className="col-12 col-lg-6">
                  <PatientImage id={user.patientId} />
                </div>
                <div className="col">
                  <PatientInfo id={user.patientId} />
                  <p>
                    {user.month} {user.day}, {user.year}
                  </p>
                  <p>{user.time}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppointmentList() {
  const navigate = useNavigate();
  const [id, setID] = useState("");

  useEffect(() => {
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = firestore.collection("users").doc(currentUser.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log("User not found");
      }
    }
  };

  fetchUserData();
}, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="container mt-5">
    <div className="row">
        <div className="col-12 col-sm-12 col-md-4">
          <h1>
            Appointments
          </h1>
        </div>
          <div className="col col-sm-6 col-md-4 mt-2">
            <button onClick={() =>
                navigate(
                  `/AppointmentHistoryDoctor/?patientId=${id}`
                )
              } className="btn btn-primary me-4"> History</button>
          </div>
      </div>
      <div className="row">
        <AllUsers id={id} />

        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  );
}

export default AppointmentList;
