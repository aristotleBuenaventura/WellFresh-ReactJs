import React, { useState, useEffect } from "react";
import { auth, firestore} from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dummy from '../assets/dummy.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { BsPencilSquare, BsTrash } from 'react-icons/bs';


function Status({ id }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);

  const handleMarkAsDone = async () => {
    try {
      await firestore.collection('appointments').doc(id).update({
        status: 'done'
      });
      navigate('/Home/HomeDoctor');
    } catch (error) {
      console.log('Error updating profile:', error);
    }
    handleCloseModal();
  };

  const handleShowModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleShowModal}>Mark as Done</button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mark this appointment as done?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleMarkAsDone}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function AddNote({ id }) {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleCloseModal = () => setShowModal(false);


  const handleAdd = async () => {
    try {
      // get the current appointment document from Firestore
      const appointmentDoc = await firestore.collection('appointments').doc(id).get();
      const appointmentData = appointmentDoc.data();

      // update the notes array with the new note
      const updatedNotes = [...appointmentData.notes, inputValue];

      // update the appointment document with the new notes array
      await firestore.collection('appointments').doc(id).update({
        notes: updatedNotes
      });
    } catch (error) {
      console.log('Error updating appointment notes:', error);
    }
    setInputValue("");
    handleCloseModal();
  };


  return (
    <>
      <Button variant="secondary" className="btn btn-success" onClick={() => setShowModal(true)}>
        Add a Note
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Enter the Note" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{width: '100%', height: 'auto'}} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function EditNote({ id, index, currentValue }) {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);

  const handleCloseModal = () => setShowModal(false);

  const handleEdit = async () => {
  try {
    // get the current appointment document from Firestore
    const appointmentRef = await firestore.collection('appointments').doc(id);
    const appointmentDoc = await appointmentRef.get();
    const appointmentData = appointmentDoc.data();

    // update the notes array with the new note
    const updatedNotes = [...appointmentData.notes];
    updatedNotes[index] = inputValue;

    // update the appointment document with the new notes array
    await appointmentRef.update({
      notes: updatedNotes
    });
  } catch (error) {
    console.log('Error updating appointment notes:', error);
  }
  setInputValue("");
  handleCloseModal();
};


  return (
    <>
      <button className="btn" onClick={() => setShowModal(true)}>
        <BsPencilSquare className="edit-icon" />
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Enter the Note" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{width: '100%', height: 'auto'}} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEdit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function AppointmentNotes({ id }) {
  const [notes, setNotes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

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
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteNote = () => {
  const userRef = firestore.collection("appointments").doc(id);
  userRef.get().then((doc) => {
    if (doc.exists) {
      const notes = doc.data().notes;
      const updatedNotes = notes.filter((note, index) => index !== noteToDelete);
      userRef.update({
        notes: updatedNotes
      }).then(() => {
        setShowDeleteModal(false);
      }).catch((error) => {
        console.error("Error removing note: ", error);
      });
    }
  }).catch((error) => {
    console.error("Error getting document: ", error);
  });
};


  const handleCancelDeleteNote = () => {
    setNoteToDelete(null);
    setShowDeleteModal(false);
  };



  return (
    <div>
      {notes.notes ? (
        <ul className="list-unstyled">
          <div className="row mt-4">
            {notes.notes.map((note, index) => (
              <div className="col-6 p-1">
                <div className="border rounded px-3 py-2">
                  <div className="row">
                    <div className="col d-flex align-items-center">
                      <li className="fw-normal m-0" key={note}>{note}</li>
                    </div>
                    <div className="col">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn me-2"
                          onClick={() => handleDeleteNote(index)}
                        >
                          <BsTrash className="delete-icon" />
                        </button>
                      <EditNote id={id} index={index} currentValue={note}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ul>
      ) : null}
      <Modal show={showDeleteModal} onHide={handleCancelDeleteNote}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDeleteNote}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDeleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
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


const imgSrc = user.imageUrl ? user.imageUrl : dummy;

  return (
    <div className="container mt-5">
      <h1>Patient Details</h1>
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
            <AddNote id={appointmentId} />
          </div>
          <AppointmentNotes id={appointmentId} />
        </div>
        <div className="text-center mt-4">
          <Status id={appointmentId} />
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;
