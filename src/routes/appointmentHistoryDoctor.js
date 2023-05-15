import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import dummy from '../assets/dummy.png'

function PatientInfo({ id }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const userRef = firestore.collection("users").doc(id);

  const unsubscribe = userRef.onSnapshot((userDoc) => {
    if (userDoc.exists) {
      const userData = userDoc.data();
      setUsers(userData);
    } else {
      console.log("User not found");
    }
  });

  return () => {
    unsubscribe();
  };
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

      userRef.onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUsers(userData);
        } else {
          console.log("User not found");
        }
      });
    }
  };

  fetchUserData();
}, [id]);


  const imgSrc = users.imageUrl ? users.imageUrl : dummy;

  return (
    <div style={{ width: '150px', height: '150px' }}>
      <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={imgSrc} alt={imgSrc} />
    </div>
  );
}

function AllUsers({ id }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usersRef = firestore.collection("appointments");
    const unsubscribe = usersRef
      .where("docId", "==", id)
      .where("status", "==", "done")
      .onSnapshot((usersSnapshot) => {
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });

    return () => {
      unsubscribe();
    };
  }, [id]);

  // Sort the users array by month, day, and time
  users.sort((a, b) => {
    const aDate = new Date(`${a.month} ${a.day} ${a.year} ${a.time}`);
    const bDate = new Date(`${b.month} ${b.day} ${b.year} ${b.time}`);
    return aDate - bDate;
  });

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
  const [user, setUser] = useState([]);
  const [id, setID] = useState("");

  useEffect(() => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const userRef = firestore.collection("users").doc(currentUser.uid);
    const unsubscribe = userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setUser(userData);
        setID(currentUser.uid);
      } else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }
}, []);

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
      </div>
    </div>
  );
}

export default AppointmentHistoryDoctor;
