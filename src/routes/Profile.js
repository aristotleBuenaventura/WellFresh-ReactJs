import React, { useState, useEffect } from "react";
import { FaEdit, FaCalendarAlt, FaShoppingCart, FaUser } from "react-icons/fa";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { auth, firestore } from "../firebase";
import "./Profile.css";
import "../WellFresh.css";

function Profile() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          const userData = doc.data();
          setFirstName(userData.firstname);
          setLastName(userData.lastname);
          setEmail(userData.email);
          setPhoneNumber(userData.phoneNumber);
          setGender(userData.gender);
          setImageUrl(userData.imageUrl);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profilescreen">
      <div className="card mb-3">
        <div className="card-body">
          <div className="profilescreen-header">
            <img src={imageUrl} alt="Profile" />
          </div>
        </div>
      </div>
      <div className="info">
        <div className="detailed">
          <FaUser className="icon" />
          <p className="wf-subtext">{firstname} {lastname}</p>
        </div>
        <div className="detailed">
          <AiOutlineUser className="icon" />
          <p className="wf-subtext">{gender}</p>
        </div>
        <div className="detailed">
          <AiOutlineMail className="icon" />
          <p className="wf-subtext">{email}</p>
        </div>
        <div className="detailed">
          <AiOutlinePhone className="icon" />
          <p className="wf-subtext">{phoneNumber}</p>
        </div>
      </div>
      <div className="d-flex justify-content-start my-3">
        <button className="wf-button wf-button-primary">
          <Link className="text-white" to="/EditProfilePage">Edit Profile</Link>
        </button>
      </div>
    </div>
  );
}

export default Profile;