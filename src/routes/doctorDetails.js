import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function DoctorDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("docId");

  const navigate = useNavigate();
  const [user, setUser] = useState([]);

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
      
    </div>
  );
}

export default DoctorDetails;
