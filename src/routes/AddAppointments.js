import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";

function AllSchedules() {
  const [apmts, setApmts] = useState([]);
  const currentUser = auth.currentUser;

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  useEffect(() => {
    const apmtsRef = firestore.collection("users").doc(currentUser.uid);
    const unsubscribe = apmtsRef.onSnapshot((doc) => {
      if (doc.exists) {
        const tmpApmts = doc.data();
        setApmts(tmpApmts);
      }
      else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {apmts.date ? (
        <div className="text-center row">
          {apmts.date.map((apmt, index) => (
            <div key={index} className="border col-3 p-2">
              <p className="h6 fw-normal">{formatDate(apmt.toDate())}</p>
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

  const [schedule, setSchedule] = useState('');

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

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (schedule !== '') {
      const currentUser = await auth.currentUser.uid;
      const userDoc = await firestore.collection("users").doc(currentUser).get();
      const userData = userDoc.data();

      const timestamp = new Date(schedule);
      const userRef = firestore.collection("users").doc(currentUser);

      const updatedScheds = [...userData.date, timestamp];

      await userRef.update({
        date: updatedScheds,
      }).then(() => {
        console.log("Schedule added!");
      }).catch((error) => {
        console.error("Error adding schedule: ", error);
      });
    }
    else {
      console.log("Error: Schedule not set");
    }
  }

  return (
    <div className="container mt-5">
      <form>
        <div className="row mb-5">
          <p className="h3">Add a schedule</p>
          <div className="col-5 me-5">
            <input
              type="datetime-local"
              className="form-control"
              placeholder="Date and time"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
            />
          </div>
          <div className="col-2 ms-5">
            <button type="submit" className="btn btn-primary" onClick={handleAddAppointment}>Add schedule</button>
          </div>
        </div>
      </form>
      <div className="row">
        <p className="h3">Your schedules</p>
        <AllSchedules />
      </div>
    </div>
  );
}

export default AddAppointments;
