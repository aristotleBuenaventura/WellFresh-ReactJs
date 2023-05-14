import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { GiRocketThruster } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function Navbar(props) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = props;
  const [click, setClick] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

    handleClose();
  };

  const handleClose = () => setShowLogoutModal(false);
  const handleShow = () => setShowLogoutModal(true);

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
              {userRole === "Doctor" && (
                <>
                  <Link
                    to="/Home/HomeDoctor"
                    className="navbar-logo mt-4 "
                    onClick={closeMobileMenu}
                  >
                    <p className="h3">Well Fresh Dental Clinic</p>
                  </Link>
                </>
              )}
              {userRole === "Patient" && (
                <>
                  <Link
                    to="/Home/HomePatient"
                    className="navbar-logo mt-4 "
                    onClick={closeMobileMenu}
                  >
                    <p className="h3">Well Fresh Dental Clinic</p>
                  </Link>
                </>
              )}
              <div className="menu-icon" onClick={handleClick}>
                {click ? <FaTimes /> : <FaBars />}
              </div>
              <ul className={click ? "nav-menu active" : "nav-menu"}>
                {userRole === "Doctor" && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/home/HomeDoctor"
                        className={({ isActive }) =>
                          "nav-links" + (isActive ? " activated" : "")
                        }
                        onClick={closeMobileMenu}
                      >
                        Home
                      </NavLink>
                    </li>
                  </>
                )}
                {userRole === "Patient" && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/home/HomePatient"
                        className={({ isActive }) =>
                          "nav-links" + (isActive ? " activated" : "")
                        }
                        onClick={closeMobileMenu}
                      >
                        Home
                      </NavLink>
                    </li>
                  </>
                )}
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
                        to="/appointmentList"
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
                        to="/AddAppointments"
                        className={({ isActive }) =>
                          "nav-links" + (isActive ? " activated" : "")
                        }
                        onClick={closeMobileMenu}
                      >
                        Add Appointments
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
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={handleShow}
                  >
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </IconContext.Provider>
      )}
      <Modal show={showLogoutModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar;
