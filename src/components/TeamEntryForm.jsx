import Header from './Header.jsx';
import './TeamEntryForm.css';
import Admin from './Admin.jsx';
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext.jsx';


export default function TeamEntryForm() {
    const { loadingTeamList, setLoadingTeamList, teamList, setTeamList } = useData();

    useEffect(() => {
        if ()
    }, []);

    return (
        <div className="team-entry-screen">
            <Header />
            <form className='team-entry-form'>
                <h1>FTCMaster</h1>
                <label htmlFor="team-name">Enter Team Number/Name:</label>
                <div className='input-container'>
                    <input type="text" id="team-name" name="team-name"/>
                    <div className='search-results'>
                        <div className='result'>
                            <h2 className='number'>2939</h2>
                            <h2 className='name'>Rundle Robotics Cascade</h2>
                        </div>
                        <div className='result'>
                            <h2 className='number'>2939</h2>
                            <h2 className='name'>Rundle Radsscs Cascade <span className='location'>Virginia Beach, VA, USA</span></h2>
                        </div>
                    </div>
                </div>
            </form>
            { process.env.NODE_ENV != 'production' && (
               <Admin />
            )}
        </div>
    );
}