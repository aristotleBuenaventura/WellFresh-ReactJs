import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import './EditProfilePage.css';

function EditProfilePage() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [biography, setBiography] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const docRef = firestore.collection('users').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          const userData = doc.data();
          setFirstName(userData.firstname);
          setLastName(userData.lastname);
          setEmail(userData.email);
          setGender(userData.gender);
          setPhoneNumber(userData.phoneNumber);
          setImageUrl(userData.imageUrl);
          setUserRole(userData.role);
          if (userData.role === 'Doctor') {
            setBiography(userData.biography || '');
          }
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpdateImage = async () => {
    const user = auth.currentUser;

    if (user && imageFile) {
      try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${auth.currentUser.uid}/${imageFile.name}`);
        await fileRef.put(imageFile);
        const imageUrl = await fileRef.getDownloadURL();
        await firestore.collection('users').doc(user.uid).update({ imageUrl });
        setImageUrl(imageUrl);
        alert('Profile image updated successfully!');
      } catch (error) {
        console.log('Error updating profile image:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await firestore.collection('users').doc(user.uid).update({
          firstname: firstname,
          lastname: lastname,
          email: email,
          gender: gender,
          phoneNumber: phoneNumber,
          biography: biography,
        });
        if (imageFile) {
          await handleUpdateImage();
        }
        alert('Your profile has been successfully updated!');
      } catch (error) {
        console.log('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="card">

      <h5 className="card-title" style={{ textAlign: 'center' }}>
        <i className="fas fa-user" style={{ marginRight: '10px' }}></i>Edit Profile
      </h5>

      <div className="card-body">

        <div className="avatar">
          <img src={imageUrl} alt="Avatar" />
          <label className="file-label">
            <input type="file" onChange={handleImageChange} />
            <span className="file-button">Upload Image</span>
          </label>
        </div>
        <div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName"></label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstname}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName"></label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastname}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender"></label>
              <select
                className="form-control"
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber"></label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Phone Number"
              />
            </div>
           {userRole === "Doctor" && (
  <div className="form-group">
    <label htmlFor="biography"></label>
    <textarea
      className="form-control"
      id="biography"
      value={biography}
      onChange={(e) => setBiography(e.target.value)}
      placeholder="Biography"
      required
    />
  </div>
)}

            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>

  );
}

export default EditProfilePage;

