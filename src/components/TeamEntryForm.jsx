import Header from './Header.jsx';
import './TeamEntryForm.css';
import Admin from './Admin.jsx';
import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { getTeamList } from '../api/pulling/TeamList.jsx';
import { createAutocomplete, runSearch } from '../TeamSearch.js';


export default function TeamEntryForm() {
    const { loadingTeamList, setLoadingTeamList, teamList, setTeamList, loading, setLoading, setLoadingStatus } = useData();
    const [ searchResults, setSearchResults ] = useState([]);
    const [ inputFocused, setInputFocused ] = useState(false);

    useEffect(() => {
        if (teamList == undefined || teamList.length == 0) {
            setLoadingTeamList(true);
            const fetchTeams = async () => {
                const data = await getTeamList();
                setTeamList(data);
                createAutocomplete(data);
                setLoadingTeamList(false);
            }
            fetchTeams();
        }
    }, []);

    const inputChange = (e) => {
        const value = e.target.value;
        setSearchResults(runSearch(value));
        console.log(searchResults);
    }

    const resultClick = (number) => {
        setLoading(true);
        setLoadingStatus(`Loading team ${number}...`);
        console.log(`Clicked team ${number}`);
    }
    return (
        <div className="team-entry-screen">
            <Header />
            <form className='team-entry-form'>
                <h1>FTCMaster</h1>
                <label htmlFor="team-name">Enter Team Number/Name:</label>
                <div className='input-container'>
                    <input type="text" id="team-name" name="team-name" onChange={inputChange} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
                    { inputFocused &&
                        <div className='search-results'>
                            { loadingTeamList || !searchResults ? (
                                <div className='result'>
                                    <h2 className='name'>Loading...</h2>
                                </div>
                            ) : searchResults.length == 0 ? (
                                <div className='result'>
                                    <h2 className='name'>No results.</h2>
                                </div>
                            ) : (
                                searchResults.map((result) => (
                                    <div className='result' key={result.number} onMouseDown={() => resultClick(result.number)}>
                                        <h2 className='number'>{result.number}</h2>
                                        <h2 className='name'>{result.name}</h2>
                                        <h2 className='location'>{result.location}</h2>
                                    </div>
                                ))
                            )}
                        </div>
                    }
                </div>
            </form>
            { process.env.NODE_ENV != 'production' && (
               <Admin />
            )}
        </div>
    );
}