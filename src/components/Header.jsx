import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const goAbout = () => {
    navigate('/about');
  } 
  const goHome = () => {
    navigate('/');
  }

  return (
    <div className='header'>
      <img className='big-img' src="/ftcmaster.png"></img>
      <button className='home-btn' onClick={goHome}>Home</button>
      <button className='home-btn' onClick={goAbout}>About</button>
    </div>
  );
}