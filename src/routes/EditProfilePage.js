import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import './EditProfilePage.css'; // Update the path here
import { Modal } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

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
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedSpecialty, setEditedSpecialty] = useState('');
  const [editedSpecialtyIndex, setEditedSpecialtyIndex] = useState(-1);
  const [specialtiesChanged, setSpecialtiesChanged] = useState(false);
  

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
            setSpecialties(userData.specialties || []);
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
        const fileRef = storageRef.child(
          `images/${auth.currentUser.uid}/${imageFile.name}`
        );
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

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openEditModal = (index, specialty) => {
    setEditedSpecialtyIndex(index);
    setEditedSpecialty(specialty);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() !== '') {
      setSpecialties(prevSpecialties => [...prevSpecialties, newSpecialty]);
      setNewSpecialty('');
      closeAddModal();
      setSpecialtiesChanged(true);
      alert('Specialty added successfully!');
    }
  };
  
  const handleEditSpecialty = () => {
    if (editedSpecialty.trim() !== '') {
      const updatedSpecialties = [...specialties];
      updatedSpecialties[editedSpecialtyIndex] = editedSpecialty;
      if (specialties[editedSpecialtyIndex] !== editedSpecialty) {
        setSpecialties(updatedSpecialties);
        closeEditModal();
        setSpecialtiesChanged(true);
        alert('Specialty edited successfully!');
      }
    }
  };
  
  const handleDeleteSpecialty = (index) => {
    const updatedSpecialties = [...specialties];
    if (updatedSpecialties[index]) {
      updatedSpecialties.splice(index, 1);
      setSpecialties(updatedSpecialties);
      setSpecialtiesChanged(true);
      alert('Specialty deleted successfully!');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const updatedData = {
          firstname: firstname,
          lastname: lastname,
          email: email,
          gender: gender,
          phoneNumber: phoneNumber,
          biography: userRole === 'Doctor' ? biography : '',
          specialties: userRole === 'Doctor' ? specialties : [],
        };
  
        const docRef = firestore.collection('users').doc(user.uid);
        const doc = await docRef.get();
  
        if (doc.exists) {
          const userData = doc.data();
          const isProfileUpdated =
            userData.firstname !== updatedData.firstname ||
            userData.lastname !== updatedData.lastname ||
            userData.email !== updatedData.email ||
            userData.gender !== updatedData.gender ||
            userData.phoneNumber !== updatedData.phoneNumber ||
            (userRole === 'Doctor' &&
              (userData.biography !== updatedData.biography ||
                JSON.stringify(userData.specialties) !== JSON.stringify(updatedData.specialties)));
  
          if (isProfileUpdated) {
            await docRef.update(updatedData);
            alert('Your profile has been successfully updated!');
          } 
        } else {
          console.log('No such document!');
        }
  
        if (imageFile) {
          await handleUpdateImage();
        }
      } catch (error) {
        console.log('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="card" id="bodycard">
   

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
            <div className="form-group1">
              <label htmlFor="gender"></label>
              <select
                className="form-control"
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
            {userRole === 'Doctor' && (
              <div>
                <div className="form-group">
                
                  <label htmlFor="biography"></label>
                  <textarea
                    className="form-control"
                    id="biography"
                    value={biography}
                    onChange={(event) => setBiography(event.target.value)}
                    placeholder="Biography"
                      
                    required
                  />
                </div>
               
                <div className="form-group">
  <div className="add-specialty">
  <label htmlFor="specialties" style={{ marginLeft: '10px' }}>
    Specialties:
  </label>

    <button className="btn btn-add" onClick={openAddModal}>
      Add Specialty
    </button>
  </div>
 

<div className="specialties-container flex-column">
  {specialties.map((specialty, index) => (
    <div key={index} className="specialty-card">
      <div className="specialty-info">
        <div className="specialty-title">{specialty}</div>
      </div>
      <div className="specialty-icons">
        <button
          className="btn btn-edit"
          onClick={() => openEditModal(index, specialty)}
        >
          <BsPencilSquare className="edit-icon" />
        </button>
        <button
          className="btn btn-delete"
          onClick={() => handleDeleteSpecialty(index)}
        >
          <BsTrash className="delete-icon" />
        </button>
      </div>
    </div>
  ))}
</div>
</div>

           </div>
            )}
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </div>

      {/* Add Specialty Modal */}
      <Modal show={showAddModal} onHide={closeAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Specialty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={newSpecialty}
            onChange={(event) => setNewSpecialty(event.target.value)}
            placeholder="Add Specialty"
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleAddSpecialty}>
            Add
          </button>
          <button className="btn btn-secondary" onClick={closeAddModal}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit Specialty Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Specialty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={editedSpecialty}
            onChange={(event) => setEditedSpecialty(event.target.value)}
            placeholder="Edit Specialty"
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleEditSpecialty}>
            Save Changes
          </button>
          <button className="btn btn-secondary" onClick={closeEditModal}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditProfilePage;
