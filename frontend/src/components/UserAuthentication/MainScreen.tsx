import React from 'react';
import './MainScreen.css';

export default function MainScreen():JSX.Element {
  return (
    <>
      <div className='makeStyles-container-5'>
        <div className='makeStyles-innerContainer-6'>
          <h2>Sign in to your account</h2>

          <div>
            <button type='button'>Login</button>
          </div>

          <div>
            <button type='button'>Register</button>
          </div>
        </div>
      </div>
    </>
  )
}