import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';

import HomeScreen from './HomeScreen';


import { Card, Form, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginScreen = () => {
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
    } catch (error) {
      console.log(error);

    }
  };


  return (
    <div className="container c-flex justify-content-center align-items-center h-100">
    
      <Card>
        <Card.Header as="h3" className="text-center">
          Login
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={handleLogin}
          className="mr-2"
        >
          Login
        </Button>
        <Button
          variant="outline-primary"
          type="submit"
          onClick={() => navigate('/Register')}
        >
          Register
        </Button>
      </Form>
    </Card.Body>
  </Card>
</div>
);
};

export default LoginScreen;
