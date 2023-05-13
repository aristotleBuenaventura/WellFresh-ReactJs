import React from 'react';

import './Footer.css';
import { Link } from 'react-router-dom';

function Footer(props) {
  const { isLoggedIn } = props;
  const currentYear = new Date().getFullYear();

  return (
    isLoggedIn && (
    <footer className="_footer">
      <div className="container py-3">
        <div className="row">
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <h5 className=" mb-3">Well-Fresh Dental Clinic</h5>
            <p>
            <br></br> "Healthy smiles for a happy life!"
            </p>
          </div>
          <div className="col-12 col-md-4">
            <h5 className="text-uppercase mb-3">Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/home" className="text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none">About</Link></li>
              {isLoggedIn ? <li><Link to="/appointmentHistoryPatient" className="text-decoration-none">Appointments</Link></li> : null}
              <li><Link to="/contact" className="text-decoration-none">Contact</Link></li>
            </ul>
          </div>
          <div className="col-12 col-md-4">
            <h5 className="text-uppercase mb-3">Contact Us</h5>
            <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>56-D Lilac St., Marikina City</p>
            <p className="mb-2"><i className="bi bi-telephone-fill me-2"></i>(02) 8691-1436</p>
            <p className="mb-2"><i className="bi bi-envelope-fill me-2"></i>wellfresh@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
      )
  );
}

export default Footer;