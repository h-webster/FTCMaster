import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const navigate = useNavigate();

  const goAbout = () => {
    navigate('/about');
  } 
  const goHome = () => {
    navigate('/');
  }

  const goLookup = () => {
    navigate('/lookup');
  }
  const goPredict = () => {
    navigate('/predict');
  }
  return (
    <div className='header'>
      <img className="big-img" alt="logo" src="/bot.png"/>
      <h1 className='big-text'>FTCMaster</h1>
      <button className='home-btn' onClick={goHome}>Home</button>
      <button className='home-btn' onClick={goLookup}>Team Lookup</button>
      <button className='home-btn' onClick={goPredict}>Match Predictor</button>
      <button className='home-btn' onClick={goAbout}>About</button>
    </div>
  );
}