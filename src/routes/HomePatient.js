import React, { useState, useEffect } from 'react';
import {auth, firestore,} from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../WellFresh.css'

function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="input-group w-50">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button">Search</button>
      </div>
    </div>
  );
}

function AllUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const usersRef = firestore.collection("users");
  const unsubscribe = usersRef.where("role", "==", "Doctor").onSnapshot((usersSnapshot) => {
    const usersData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setUsers(usersData);
  });

  return () => {
    unsubscribe();
  };
}, []);

  return (
    <div>
    <h6 className='wf-h6 fw-bold my-4'>Doctors</h6>
    <ul className='list-unstyled row w-100'>
      {users.map((user) => (
        <li key={user.id} className='col-md-4 col-sm-12 p-1 m-0'>
          <button className="btn border rounded w-100 p-3" onClick={() => navigate(`/doctorDetails/?docId=${user.id}`)}>
            <div className='row'>
              <div className='col-4'>
                <div style={{ width: '84px', height: '84px' }}>
                  <img className="rounded" style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={user.imageUrl} alt={user.imageUrl} />
                </div> 
              </div>
              <div className='col-8 text-start'>
                <p className='wf-title'>Dr. {user.lastname} {user.firstname}</p>
                <p className='wf-subtitle'>Specialty: {user.specialties ? user.specialties[0] : 'Dentist'}</p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
    </div>
  );
}

function HomePatient() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate('/');
      return;
    }

    const userRef = firestore.collection("users").doc(currentUser.uid);
    const unsubscribe = userRef.onSnapshot((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUser(userData);
      } else {
        console.log("User not found");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser, navigate]);

  return (
    <div className="container mt-5">
      <h2>Hi, {user.firstname} {user.lastname}</h2>
      <h2>Let's find your top doctor!</h2>
      <AllUsers />
    </div>
  );
}

export default HomePatient;