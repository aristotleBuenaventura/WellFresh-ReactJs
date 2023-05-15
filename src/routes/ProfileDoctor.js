import React, { useState, useEffect } from "react";
import { FaEdit, FaCalendarAlt, FaShoppingCart, FaUser } from "react-icons/fa";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { auth, firestore } from "../firebase";
import "./Profile.css";

function ProfileDoctor() {
  const [firstname, setFirstName] = useState("");
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
      <p>Doctor's Profile</p>
      <div className="card">
        <div className="card-body">
          <div className="profilescreen-header">
            <img src={imageUrl} alt="Profile" />
          </div>
        </div>
      </div>

      <div className="info">
        <div className="detailed">
          <FaUser className="icon" />
          <p>{firstname}</p>
        </div>
        <div className="detailed">
          <AiOutlineUser className="icon" />
          <p>{gender}</p>
        </div>
        <div className="detailed">
          <AiOutlineMail className="icon" />
          <p>{email}</p>
        </div>
        <div className="detailed">
          <AiOutlinePhone className="icon" />
          <p>{phoneNumber}</p>
        </div>
        <div className="detailed">
          <FaEdit className="icon" />
          <Link to="/EditProfilePage">Edit Profile</Link>
        </div>
        <div className="detailed">
          <FaCalendarAlt className="icon" />
          <a href="#">View Appointments</a>
        </div>
      </div>
    </div>
  );
}

export default ProfileDoctor;
