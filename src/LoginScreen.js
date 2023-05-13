import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { Card, Form, Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const LoginScreen = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/Home');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Logged in successfully!');
      setIsLoggedIn(true); // call setIsLoggedIn function passed down from parent
    } catch (error) {
      alert('Incorrect email or password'); // display an alert message
      console.log(error);
    }
  };
  
  return (
    <div className="container c-flex justify-content-center align-items-center h-100">
      <Card className="d-flex flex-row" style={{ height: "100%" }}>
        <Card.Body className="d-flex flex-row" style={{ height: "100%" }}>
          <div className="w-50 d-flex flex-column justify-content-center" style={{ zIndex: 1, width: "50%" }}>
            <div className="welcome-message mb-4">
              <h1 className="text-bold mb-4">Sign in</h1>
              <h5 className="text-muted mb-4">Welcome back!</h5>
            </div>
            <Form className="w-75 align-self-center">
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                onClick={handleLogin}
                className="mb-3"
              >
                Sign In
              </Button>

              <div className="mt-3">
                <Button variant="link" href="/Register" style={{ color: "#393f81" }}>
                  Don't have an account? Sign Up
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginScreen;
