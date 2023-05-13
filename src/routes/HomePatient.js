import React, { useState, useEffect } from 'react';
import {auth, firestore,} from '../firebase';
import { useNavigate } from 'react-router-dom';



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
    <h3 className='mt-4'>Doctors</h3>
    <ul className='text-center list-unstyled row w-100'>
        {users.map((user) => (
        <li key={user.id} className='col-6 p-2'>
            <button className="btn border" onClick={() => navigate(`/doctorDetails/?docId=${user.id}`)}>
        <div className='row '>
            <div className='col-12 col-lg-6'>
            <img className='w-25' src={user.imageUrl} alt="My Image" />  
            </div>
            <div className='col'>
            <p>Dr. {user.lastname} {user.firstname}</p>
            <p>Specialty: {user.specialties ? user.specialties[0] : 'Dentist'}</p>
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
        
      <h1>Hi, {user.firstname} {user.lastname}</h1>
      <div className='row'>
        <div className='col-6'>
            <h1>Let’s find your top doctor!</h1>
        </div>
        <div className='col-12 col-sm-12 col-md-6'>
            <SearchBar/>
        </div>
        <AllUsers/>
      </div>
      
    </div>
  );
}

export default HomePatient;