import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";

function AllSchedules({ schedules, handleEditSchedule, handleDeleteSchedule }) {
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {schedules.length > 0 ? (
        <div className="text-center row">
          {schedules.map((schedule, index) => (
            <div key={index} className="border col-3 p-2">
              <p className="h6 fw-normal">{formatDate(schedule.toDate())}</p>
              <div className="btn-group" role="group" aria-label="Schedule Actions">
                <button type="button" className="btn btn-success" onClick={() => handleEditSchedule(index)}>Edit</button>
                <button type="button" className="btn btn-danger" onClick={() => handleDeleteSchedule(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AddAppointments() {
  const [user, setUser] = useState([]);
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
        })
          .then(() => {
            console.log("Schedule updated!");
            setEditIndex(null);
          })
          .catch((error) => {
            console.error("Error updating schedule: ", error);
          });
      } else {
        const updatedSchedules = [...schedules, timestamp];

        await userRef.update({
          date: updatedSchedules,
        })
          .then(() => {
            console.log("Schedule added!");
          })
          .catch((error) => {
            console.error("Error adding schedule: ", error);
          });
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
      <h1 className="text-center">Add Appointments</h1>
      <form onSubmit={handleAddSchedule}>
        <div className="form-group mb-3">
          <label htmlFor="schedule">Schedule:</label>
          <input type="datetime-local" className="form-control" id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{editIndex !== null ? "Update" : "Add"}</button>
      </form>
      <AllSchedules schedules={schedules} handleEditSchedule={handleEditSchedule} handleDeleteSchedule={handleDeleteSchedule} />
    </div>
  );
}

export default AddAppointments;