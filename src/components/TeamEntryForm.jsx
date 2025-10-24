import Header from './Header.jsx';
import './TeamEntryForm.css';
import Admin from './Admin.jsx';
import React from 'react';

export default function TeamEntryForm() {
    return (
        <div className="team-entry-screen">
            <Header />
            <form className='team-entry-form'>
                <h1>FTCMaster</h1>
                <label htmlFor="team-name">Enter Team Number/Name:</label>
                <div className='input-container'>
                    <input type="text" id="team-name" name="team-name"/>
                </div>
            </form>
            { process.env.NODE_ENV != 'production' && (
               <Admin />
            )}
        </div>
    );
}