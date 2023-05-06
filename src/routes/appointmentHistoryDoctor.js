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
      userRef.onSnapshot((userDoc) => {
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUsers(userData);
        } else {
          console.log("User not found");
        }
      });
    }
  };

  fetchUserData();
}, [auth, firestore, id]);


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
    const fetchAllUsers = async () => {
      const usersRef = firestore.collection("appointments");
      const usersSnapshot = await usersRef.get();

      const usersData = usersSnapshot.docs
        .map((appointment) => ({
          id: appointment.id,
          ...appointment.data(),
        }))
        .filter((user) => user.docId === id && user.status === "done");

      setUsers(usersData);
    };

    fetchAllUsers();
  }, [id]);


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

function AppointmentHistoryDoctor() {
  const navigate = useNavigate();
  const [id, setID] = useState("");

  useEffect(() => {
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = firestore.collection("users").doc(id);
      userRef.onSnapshot((userDoc) => {
        if (userDoc.exists) {
          const userData = userDoc.data();
          setID(userData);
        } else {
          console.log("User not found");
        }
      });
    }
  };

  fetchUserData();
}, [id]);


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
            History
          </h1>
        </div>
      </div>
      <div className="row">
        <AllUsers id={id} />

        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  );
}

export default AppointmentHistoryDoctor;
