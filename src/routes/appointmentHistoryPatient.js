import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import dummy from '../assets/dummy.png'

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
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleViewNotes = (notes) => {
    setSelectedNotes(notes);
    setShowModal(true); // Show the modal when notes are selected
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersRef = firestore.collection("appointments");

      usersRef
        .where("patientId", "==", id)
        .where("status", "==", "done")
        .orderBy("year")
        .orderBy("month")
        .orderBy("day")
        .orderBy("time")
        .onSnapshot((querySnapshot) => {
          const usersData = [];
          querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            usersData.push({ id: doc.id, ...appointment });
          });
          setUsers(usersData);
        });
    };

    fetchAllUsers();
  }, [id]);

  const handleCloseModal = () => {
    setSelectedNotes([]); // Clear the selected notes
    setShowModal(false); // Hide the modal
  };

  return (
    <>
      <ul className="text-center list-unstyled row w-100">
        {users.map((user) => (
          <li key={user.id} className="col-6 p-2">
            <button
              className="btn border"
              onClick={() => handleViewNotes(user.notes)}
            >
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotes.length > 0 ? (
            <ul>
              {selectedNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          ) : (
            <p>No Notes Available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

  const imgSrc = user.imageUrl ? user.imageUrl : dummy;

  return (
    <div className="container mt-5">
      <h1>Patient's History</h1>
      <div className="row ">
        <div className="col-12 col-md-6">
          <img className="w-50" src={imgSrc} alt="My Image" />
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
