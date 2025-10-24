import React from 'react';
import { useData } from './contexts/DataContext';
import LoadingScreen from './components/LoadingScreen';
import TeamEntryForm from './components/TeamEntryForm';
export default function Home() {
    const { loading } = useData();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <TeamEntryForm />
        </div>
    );
}