import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";

import { BsPencilSquare, BsTrash } from 'react-icons/bs';

function AllSchedules({ schedules, handleEditSchedule, handleDeleteSchedule }) {
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {schedules.length > 0 ? (
        <div className="row">
          {schedules.map((schedule, index) => (
            <div key={index} className="col-4 p-1">
              <div className="border rounded px-3 py-2">
                <div className="row d-flex align-items-center">
                  <div className="col-6 text-start">
                    <p className="wf-subtext fw-normal">{formatDate(schedule.toDate())}</p>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <div className="" role="group" aria-label="Schedule Actions">
                      <button type="button" className="btn" onClick={() => handleEditSchedule(index)}>
                        <BsPencilSquare className="edit-icon" />
                      </button>
                      <button type="button" className="btn" onClick={() => handleDeleteSchedule(index)}>
                        <BsTrash className="delete-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AddAppointments() {
  const [user, setUser] = useState(null); // changed the initial value to null
  const [id, setID] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [updatedSchedules, setUpdatedSchedules] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = firestore.collection("users").doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUser(userData);
          setID(currentUser.uid);
          setSchedules(userData.date || []);
        } else {
          console.log("User not found");
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleAddSchedule = async (e) => {
  e.preventDefault();

  if (schedule !== "") {
    const timestamp = new Date(schedule);
    const userRef = firestore.collection("users").doc(id);

    if (editIndex !== null) {
      const updatedSchedules = [...schedules];
      updatedSchedules[editIndex] = timestamp;

      await userRef.update({
        date: updatedSchedules,
      });

      console.log("Schedule updated!");
      setEditIndex(null);
    } else {
      const updatedSchedules = [...schedules, timestamp];

      await userRef.update({
        date: updatedSchedules,
      });

      console.log("Schedule added!");
    }

    setSchedules(updatedSchedules);
    setSchedule("");
  } else {
    console.log("Error: Schedule not set");
  }
};


  const handleEditSchedule = (index) => {
    setEditIndex(index);
    setSchedule(schedules[index].toDate().toISOString().slice(0, -8));
  };

  const handleDeleteSchedule = async (index) => {
  const confirmation = window.confirm("Are you sure you want to delete this schedule?");
  if (!confirmation) {
    return;
  }

  const userRef = firestore.collection("users").doc(id);
  const updatedSchedules = [...schedules];
  updatedSchedules.splice(index, 1);

  await userRef.update({
    date: updatedSchedules,
  })
    .then(() => {
      console.log("Schedule deleted!");
    })
    .catch((error) => {
      console.error("Error deleting schedule: ", error);
    });

  setSchedules(updatedSchedules);
};

  return (
    <div className="container">
      <h3 className="mt-5 mb-4">Add Appointments</h3>
      <form onSubmit={handleAddSchedule}>
        <div className="form-group mb-3">
          <label htmlFor="schedule" className="wf-text mb-2">Schedule:</label>
          <input type="datetime-local" className="form-control wf-input w-100" id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </div>
        <button type="submit" className="wf-button wf-button-primary mb-4">{editIndex !== null ? "Update schedule" : "Add schedule"}</button>
      </form>
      <AllSchedules schedules={schedules} handleEditSchedule={handleEditSchedule} handleDeleteSchedule={handleDeleteSchedule} />
    </div>
  );
}

export default AddAppointments;