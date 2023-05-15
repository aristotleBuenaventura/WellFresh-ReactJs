import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "./firebase";

import { Card, Form, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import './RegisterScreen.css';

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setUserRole] = useState("Patient");
  const [errors, setErrors] = useState({});
  
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/Login");
      }
    });

    return unsubscribe;
  }, [navigate]);


  const fetchUserByEmail = async (email) => {
    const snapshot = await firestore
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .get();
  
    if (snapshot.empty) {
      return null;
    }
  
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
    };
  };

  

  const handleSignUp = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (password !== passwordConfirm) {
      alert("Passwords don't match");
      return;
    }

    if (Object.keys(errors).length > 0) {
      // display error message to the user
      alert("Please fill out all fields before submitting");
      return;
    }

    const emailLowerCase = email.toLowerCase(); // convert email to lowercase

    // check if the email is already used
    const existingUser = await fetchUserByEmail(emailLowerCase);
    if (existingUser) {
      alert("Email already used");
      return;
    }

    auth
  .createUserWithEmailAndPassword(emailLowerCase, password)
  .then((userCredentials) => {
    const user = userCredentials.user;
    console.log("Registered with:", user.email);

    // log the user out immediately after they are created
    auth.signOut().then(() => {
      console.log("User logged out");

      firestore
        .collection("users")
        .doc(user.uid)
        .set({
          firstname,
          lastname,
          email: emailLowerCase,
          password,
          role,
        })
        .then(() => {
          console.log("User data saved to Firestore");
          alert("Registered successfully!");
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to save user data");
        });
    });
  })
  .catch((error) => console.log(error));
  };

  
  const validateForm = () => {
    let errors = {};
  
    // Validate first name
    if (!firstname) {
      errors.firstname = "First name is required";
    } else if (firstname.length < 2) {
      errors.firstname = "First name should be at least 2 characters long";
    }
  
    // Validate last name
    if (!lastname) {
      errors.lastname = "Last name is required";
    } else if (lastname.length < 2) {
      errors.lastname = "Last name should be at least 2 characters long";
    }
  
    // Validate email
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
  
    // Validate password
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password should be at least 6 characters long";
    }
  
    // Validate confirm password
    if (password !== passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }
  
    // Show error messages for each field with invalid input
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
    }
  
    setErrors(errors);
    return errors;
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  return (
    <div className="container c-flex justify-content-center align-items-center h-100">
      <Card className="d-flex flex-row" style={{ height: "100%" }}>
        <Card.Body className="d-flex flex-row" style={{ height: "100%" }}>
         <div className="w-50 d-flex flex-column justify-content-center" style={{ zIndex: 1, width: "50%" }}>
         <h1 className="text-bold mb-4">Sign Up</h1>
         <h5 className="text-muted mb-4">Create your Wellfresh account</h5>
  <Form>
    <Form.Group controlId="formBasicFirstName" className="mb-3">
    
      <Form.Control
         className="mb-3"
        type="text"
        placeholder="Enter first name"
        value={firstname}
        onChange={(e) => setFirstName(e.target.value)}
        style={{ width: "100%" }}
        isInvalid={!!errors.firstname}
      />
    </Form.Group>

    <Form.Group controlId="formBasicLastName" className="mb-3">
   
      <Form.Control
         className="mb-3"
        type="text"
        placeholder="Enter last name"
        value={lastname}
        onChange={(e) => setLastName(e.target.value)}
        style={{ width: "100%" }}
        isInvalid={!!errors.lastname}
      />
    </Form.Group>

    <Form.Group controlId="formBasicEmail" className="mb-3">
    
      <Form.Control
         className="mb-3"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%" }}
        isInvalid={!!errors.email}
      />
    </Form.Group>

    <Form.Group controlId="formBasicPassword" className="mb-3">
   
      <Form.Control
         className="mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%" }}
        isInvalid={!!errors.password}
      />
    </Form.Group>

    <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
      
      <Form.Control
         className="mb-3"
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        style={{ width: "100%" }}
        isInvalid={!!errors.passwordConfirm}
      />
    </Form.Group>

  
    
    <Button
                variant="primary"
                type="submit"
                onClick={handleSignUp}
                className="mb-3"
              >
                Sign Up
              </Button>
        
          </Form>
     
          <div className="mt-3">
            <Button
              variant="link"
              href="/"
              style={{ color: "#393f81" }}
            >
              ALready have an Account? Sign In
            </Button>
          </div>
        </div>
          
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterScreen;
