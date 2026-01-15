import Header from './Header.jsx';
import './TeamEntryForm.css';
import Admin from './Admin.jsx';
import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { getActiveTeamList, getTeamList } from '../api/pulling/TeamList.jsx';
import { createActiveAutocomplete, createAutocomplete, runSearch } from '../TeamSearch.js';
import MatchPredictor from './MatchPredict.jsx';


export default function TeamEntryForm() {
    const { loadingTeamList, setLoadingTeamList, teamList, setTeamList, loading, setLoading, setLoadingStatus } = useData();
    const [ searchResults, setSearchResults ] = useState([]);
    const [ inputFocused, setInputFocused ] = useState(false);

    useEffect(() => {
        if (teamList == undefined || teamList.length == 0) {
            setLoadingTeamList(true);
            const fetchTeams = async () => {
                const data = await getTeamList();
                const activeData = await getActiveTeamList(data);
                console.log(activeData);
                setTeamList(data);
                createAutocomplete(data);
                createActiveAutocomplete(activeData);
                setLoadingTeamList(false);
            }
            fetchTeams();
        }
    }, []);

    const inputChange = (e) => {
        const value = e.target.value;
        let autoComplete = runSearch(value);
        if (autoComplete == null) {
            createAutocomplete(teamList);
        } else {
            setSearchResults(autoComplete);
        }
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
            <div className="team-entry-main">

                <form className='team-entry-form'>
                    <h1 className='cool-title'>Team Lookup</h1>
                    <label htmlFor="team-name">Enter Team Number/Name:</label>
                    <div className='input-container'>
                        <input type="text" id="team-name" name="team-name" autoComplete="off" onChange={inputChange} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
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
                    <> 
                        {/*<Admin />*/}
                    </>
                )}
                <MatchPredictor comingSoon={process.env.NODE_ENV == 'production'}/>
            </div>
        </div>
    );
}