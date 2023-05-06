import React, { useState, useEffect } from "react";
import { auth, firestore} from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Status({appointment_Id}){
  const status = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await firestore.collection('users').doc(appointment_Id).update({
          status: 'done'
        });
        alert('Your profile has been successfully updated!');
      } catch (error) {
        console.log('Error updating profile:', error);
      }
    }
  };

  return (
    <button onClick={status}>Mark as Done</button>
  );
};

function AppointmentNotes({ id }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const userRef = firestore.collection("appointments").doc(id);
    const unsubscribe = userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setNotes(userData);
      } else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }
}, [id]);


  const handleDeleteNote = (note) => {
    // Handle deleting the note here
  };

  const handleEditNote = (note) => {};

  return (
    <div>
      {notes.notes ? (
        <ul className="list-unstyled">
          <div className="row mt-4 ">
            {notes.notes.map((notes) => (
              <div className="col-12 border border-secondary border-3 rounded me-5 mt-2 p-2">
                <div className="row">
                  <div className="col ">
                    <li key={notes}>{notes}</li>
                  </div>
                  <div className="col">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-danger me-3"
                        onClick={() => handleDeleteNote(notes)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleEditNote(notes)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ul>
      ) : null}
    </div>
  );
}

function PatientDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("patientId");
  const month = searchParams.get("month");
  const day = searchParams.get("day");
  const year = searchParams.get("year");
  const time = searchParams.get("time");
  const appointmentId = searchParams.get("appointmentId");

  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  useEffect(() => {
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
}, [id]);


  return (
    <div className="container mt-5">
      <h1>Patient Details</h1>
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
          <button
            className="btn border"
            onClick={() =>
                navigate(
                  `/appointmentHistoryPatient/?patientId=${id}`
                )
              }
          >
            View Appointment History
          </button>
        </div>
      </div>
      <div>
        <div className="row">
          <div className="col">
            <h3 className="fw-bold mt-4">Date</h3>
            <p>
              {month} {day}, {year}
            </p>
          </div>
          <div className="col">
            <h3 className="fw-bold mt-4">Time</h3>
            <p>{time}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="row">
          <div className="col">
            <h3 className="fw-bold mt-4">Note</h3>
          </div>
          <div className="col d-flex justify-content-end">
            <button className="btn btn-success border mt-4 ">Add a Note {appointmentId}</button>
          </div>
          <AppointmentNotes id={appointmentId} />
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => Status(appointmentId)}>Mark as Done</button>
          <Status id={appointmentId} />
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;
