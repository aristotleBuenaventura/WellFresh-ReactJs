import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { GiRocketThruster } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';

function Navbar(props) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = props;
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((error) => alert(error.message));
  };


 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUserRole(userData.role);
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        // No user is signed in.
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);


  if (!isLoggedIn) {
    return null;
  }
  

  return (
    <>
      {isLoggedIn && (
        <IconContext.Provider value={{ color: "white" }}>
          <nav className="navbar">
            <div className="navbar-container container">
              <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                <GiRocketThruster className="navbar-icon" />
                Well-Freshed
              </Link>
              <div className="menu-icon" onClick={handleClick}>
                {click ? <FaTimes /> : <FaBars />}
              </div>
              <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={closeMobileMenu}
                    >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  "nav-links" + (isActive ? " activated" : "")
                }
                onClick={closeMobileMenu}
              >
                About
              </NavLink>
            </li>
            {userRole === "Patient" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/Appointment"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={closeMobileMenu}
                  >
                    Appointment
                  </NavLink>
                </li>
              </>
            )}
            {userRole === "Doctor" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/Appointments"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={closeMobileMenu}
                  >
                    Appointments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/addAppoitnments"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={closeMobileMenu}
                  >
                    Add Appoitnments
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink
                to="/EditProfilePage"
                className={({ isActive }) =>
                  "nav-links" + (isActive ? " activated" : "")
                }
                onClick={closeMobileMenu}
              >
                Edit Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Profile"
                className={({ isActive }) =>
                  "nav-links" + (isActive ? " activated" : "")
                }
                onClick={closeMobileMenu}
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "nav-links" + (isActive ? " activated" : "")
                }
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
            </li>
          </ul>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="btn btn-outline-danger my-2 my-sm-0" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </nav>
    </IconContext.Provider>
  )}
</>
);
}

export default Navbar;