import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = useCallback(async (pageNumber, reset = false) => {
        const url = selectedLetter ? 
            `http://localhost:5000/users?letter=${selectedLetter}&page=${pageNumber}` : 
            `http://localhost:5000/users?page=${pageNumber}`;

        try {
            const response = await axios.get(url);
            setUsers(prevUsers => reset ? response.data.users : [...prevUsers, ...response.data.users]);
            setTotalUsers(response.data.total);
        } catch (error) {
            console.error(error);
        }
    }, [selectedLetter]); 
    useEffect(() => {
        setUsers([]); 
        setPage(1); // Réinitialise la pagination
        fetchUsers(1, true);
    }, [selectedLetter, fetchUsers]); // ✅ Ajout de fetchUsers comme dépendance

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUsers(nextPage);
    };

    const Row = ({ index, style }) => {
        const user = users[index];
        if (!user) return null;
        const [firstName, lastName] = user.split(' ') || ["Unknown", ""];
        return (
            <div className="list-group-item" style={style}>
                <strong>{firstName}</strong> {lastName}
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Large User List</h1>

            {/* Menu */}
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-danger m-1" onClick={() => setSelectedLetter(null)}>Afficher tous</button>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                    <button key={letter} className={`btn m-1 ${selectedLetter === letter ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedLetter(letter)}>
                        {letter}
                    </button>
                ))}
            </div>

            {/* Liste virtualisée */}
            <List height={500} width="100%" itemSize={40} itemCount={users.length}>
                {Row}
            </List>

            {/* Bouton "Charger plus" */}
            {users.length < totalUsers && (
                <div className="text-center mt-3">
                    <button className="btn btn-secondary" onClick={loadMore}>loadMore</button>
                </div>
            )}
        </div>
    );
};

export default App;
