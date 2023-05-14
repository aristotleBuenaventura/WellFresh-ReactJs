import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DoctorDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("docId");
  const [user, setUser] = useState([]);

  const [sched, setSched] = useState();

  const formatDate = (dateString) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = firestore.collection("users").doc(id);

        userRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUser(userData);
          } else {
            console.log("User not found");
          }
        });
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="container mt-5">
      <h1>Doctor Details</h1>
      <div className="row ">
        <div className="col-12 col-md-6">
          <img className="w-50" src={user.imageUrl} alt="My Image" />
        </div>
        <div className="col-6">
          <p className="fw-bold h3">
            Dr. {user.lastname} {user.firstname}
          </p>
          <p className=" h5">
            Specialty: {user.specialties ? user.specialties[0] : "Dentist"}
          </p>
        </div>
      </div>
      <div>
        <h3 className="fw-bold mt-4">Biography</h3>
        <p>
          Dr. {user.lastname} {user.biography}
        </p>
      </div>
      <div>
        <h3 className="fw-bold mt-4">Specialties</h3>
        {user.specialties ? (
          <ul className="list-unstyled">
            <div className="row mt-4 ">
              {user.specialties.map((specialty) => (
                <div className="col-4 col-md-3 border border-secondary border-3 rounded me-5 mt-2">
                  <li key={specialty}>{specialty}</li>
                </div>
              ))}
            </div>
          </ul>
        ) : null}
      </div>
      <div>
        <h3 className="fw-bold mt-4">Schedules</h3>
        {user.date ? (
          <div className="text-center row">
            {user.date
              .map((apmt) => apmt.toDate())
              .sort((a, b) => a.getTime() - b.getTime())
              .map((apmt, index) => (
                <button
                  className={
                    "border-0 rounded col-3 m-1" +
                    (sched === index ? " text-white bg-primary" : " bg-light")
                  }
                  key={index}
                  onClick={() => setSched(index)}
                >
                  <div className="p-2">
                    <p className="h6 fw-normal">{formatDate(apmt)}</p>
                  </div>
                </button>
              ))}
          </div>
        ) : null}
      </div>

      {sched >= 0 ? (
        <ConfirmAppointment docId={id} apmt={user.date[sched].toDate()} />
      ) : null}
    </div>
  );
}

function ConfirmAppointment({ docId, apmt }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleCloseModal = () => setShowModal(false);

  const handleBook = async () => {
    const apmtRef = firestore.collection("appointments");
    const selDate = apmt;

    apmtRef
      .add({
        time: apmt
          .toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
          .toString(),
        day: selDate.getDate(),
        month: monthNames[selDate.getMonth()],
        year: selDate.getFullYear(),
        docId: docId,
        patientId: auth.currentUser.uid,
        notes: [],
        status: "ongoing",
      })
      .then(() => {
        console.log("Appointment successfully booked!");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error booking appointment: ", error);
      });
    navigate("/Home/HomePatient");
  };

  return (
    <>
      <Button
        variant="secondary"
        className="btn btn-primary w-100 my-4"
        onClick={() => setShowModal(true)}
      >
        Book appointment
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Important Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Failure to go to your appointment will incur a charge of 500 pesos.
          This is due to the high volume of patients who want to settle an
          appointment. This fee shall be collected on your next visit in our
          clinic.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleBook}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DoctorDetails;
