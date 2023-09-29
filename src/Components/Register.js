import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post('http://127.0.0.1:8000/register/', {
      username,
      password,
      confirm_password
    });

    const data = await response.data;

    if (response.status === 201) {
      // Registration successful
      navigate('/login');
    } else {
      // Registration failed
      // Handle error
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='8'>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>
              <h2 className="fw-bold mb-2 text-center">Register</h2>
              <MDBInput wrapperClass='mb-4 w-100' placeholder='Username' id='username' type='username' size="md" value={username} onChange={(event) => setUsername(event.target.value)} />
              <MDBInput wrapperClass='mb-4 w-100' placeholder='Password' id='password' type='password' size="md" value={password} onChange={(event) => setPassword(event.target.value)} />
              <MDBInput wrapperClass='mb-4 w-100' placeholder='Confirm Password' id='confirm_password' type='password' size="md" value={confirm_password} onChange={(event) => setConfirmPassword(event.target.value)} />
              <MDBBtn size='md' className='mb-4' style={{ width: '300px',height:'40px'}} onClick={handleSubmit}>
               Register
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
