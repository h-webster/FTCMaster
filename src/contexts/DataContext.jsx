import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingTeamList, setLoadingTeamList] = useState(true);
    const [teamList, setTeamList] = useState([]);
    const [loadingExtras, setLoadingExtras] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [error, setError] = useState(null);
    const [teamMap, setTeamMap] = useState(null);

    return (
        <DataContext.Provider value={{ teamData, setTeamData, loading, setLoading, loadingExtras, setLoadingExtras, loadingStatus, setLoadingStatus, error, setError, loadingTeamList, setLoadingTeamList, teamList, setTeamList, teamMap, setTeamMap }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
