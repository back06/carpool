// src/components/Header.js
import '../styles/navbar.css'
import React , {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/api';
import { CiSearch } from "react-icons/ci";
function Header({onSearch}) {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();  // Prevent the form from refreshing the page
        onSearch(searchTerm); // Call the onSearch function passed as a prop with the search term
        navigate('/events');  // Navigate to the event list page
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return(
        <>
        <nav class="navbar">
            <div class="navbar-left">
                <Link to={`/events`} class="navbar-brand">Safar Sathi</Link>
            </div>
            <div class="navbar-right">
                <form class="search-form" role="search" onSubmit={handleSearchSubmit}>
                    <input type="text" class="search-input" placeholder="Search..." value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)}/>
                    <CiSearch className="search-icon" onClick={handleSearchSubmit}/>
                </form>
                <Link to={`/profile`} class="profile-icon">
                    <span>&#128100;</span>
                </Link>
                <button class="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
        </>
    );
}

export default Header;