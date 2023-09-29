import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
          username,
          password,
      });
      localStorage.setItem('token',response.data.token)
      localStorage.setItem('username',response.data.username)
      navigate('/task');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='8'>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  placeholder='Username'
                  id='formControlLg'
                  type='username'
                  size="md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <MDBInput
                  wrapperClass='mb-4 w-100'
                  placeholder='Password'
                  id='formControlLg'
                  type='password'
                  size="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <MDBBtn size='md' type="submit" style={{width:'300px',height:'40px'}}>
                  Login
                </MDBBtn>
              </form>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
