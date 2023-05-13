import React, { useState, useEffect } from "react";
import "./Contact.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, firestore } from "../firebase";
import { FaClinicMedical, } from 'react-icons/fa';
import { AiOutlineFieldTime,AiOutlinePhone} from "react-icons/ai";

function Contact() {
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (message.trim() === "") {
      alert("Please enter a message");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await firestore.collection("feedbacks").add({
          firstname,
          email,
          message,
          userId: user.uid,
          timestamp: new Date(),
        });
        alert("Feedback submitted successfully!");
        setMessage("");
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="card">
      <div className="center">
        <div className="title">Contact Us</div>
        <br />
        <br />
        <div className="card2">
          <img
            src="https://c8.alamy.com/comp/2AHMJF9/dental-clinic-logo-template-dental-care-logo-designs-vector-2AHMJF9.jpg"
            alt="Logo"
            className="logo"
          />
          <div className="card-body">
           
            <p className="card-text">
            <div>  <FaClinicMedical className="icon" /> WellFresh Dental Clinic</div>
            <div>   &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; Front Desk</div>
            <div>
             <AiOutlineFieldTime className="icon" />  9 am - 6 pm </div>
            <div> <AiOutlinePhone className="icon" /> 0919123121</div>
           
           
             
             
            </p>
          </div>
        </div>
        <br />
        <p className="notice">Feel free to send us a message in the box below!</p>
        <br />
        <div className="namebox">
          <div className="frameName">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/0brwn4u5gzyc-264%3A1013?alt=media&token=ce8ced69-9ebb-4fa9-8d98-981c178e9020"
              alt="Not Found"
              className="document"
            />
            <p className="name">{firstname}</p>
          </div>
        </div>
        <br />
        <div className="emailbox">
          <div className="frameEmail">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/bvuo8l7oyeu-264%3A1067?alt=media&token=ebef0bf8-c57e-4ca8-a85d-bdef54bb13b2"
              alt="Not Found"
              className="userEmail"
            />
            <p className="email">{email}</p>
          </div>
        </div>
        <br />
        <div className="Inputform">
          <div className="input-container">
          
            <textarea
              rows="4"
              placeholder="Message"
              style={{ resize: "none" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="react-icon">
              <i className="fab fa-react"></i>
            </div>
          </div>
        </div>
        <br />
        <button type="submit" className="button" onClick={handleSubmit}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/s1ju6yrpyi-264%3A1045?alt=media&token=31ce68a8-5968-4de7-9517-ca30c55195fd"
            alt="Not Found"
            className="send"
          />
          <p className="submit">Submit</p>
          
  
        </button>
   
      </div>
  
    </div>

  );
  
}

export default Contact;
