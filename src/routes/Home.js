import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useEffect, useState } from 'react';
import LoginScreen from '../LoginScreen';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // add loggedIn state

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // User is not logged in
      navigate(LoginScreen);
      return;
    }

    const usersRef = firestore.collection('users');
    usersRef
      .where('email', '==', user.email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          console.log('Document data:', data); // Logging the data to see if it's what we expect
          setUserRole(data.role);
          setLoggedIn(true); // set loggedIn to true when user role is fetched
        } else {
          console.log('No such document!');
          alert('An error occurred, please try again later');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
        alert('An error occurred, please try again later');
      });
  }, [navigate]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate('/Login');
      })
      .catch((error) => alert(error.message));
  };

  if (!loggedIn) {
    // User is not logged in
    return <LoginScreen />;
  }

  if (userRole === null) {
    // Waiting for user role to be fetched
    return <div>Loading...</div>;
  } else if (userRole === 'Doctor') {
    return (
      <>
        <Navbar /> {/* Show the Navbar if user is logged in */}
        {navigate('./HomeDoctor')}
      </>
    );
  } else {
    return (
      <>
        <Navbar /> {/* Show the Navbar if user is logged in */}
        {navigate('./HomePatient')}
        {/* <div>
          <p>You are a patient!</p>
          <button onClick={handleSignOut}>Sign out</button>
        </div> */}
      </>
    );
  }
};

export default Home;
