// src/App.js

import React , {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EventList from './components/events/EventList';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEvent from './components/events/CreateEvent';
import EventDetails from './components/events/EventDetails';
import CarpoolDetails from './components/carpool/CarpoolDetails';
import CreateCarpool from './components/carpool/CreateCarpool';
import Header from './components/Header';
import Profile from './components/profile/Profile';
import LoginSignup from './components/auth/LoginSignup';

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginSignup />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/events" element={
          <ProtectedRoute>
            {/* <Header/>
            <EventList /> */}
            <Header onSearch={handleSearch} />
            <EventList searchTerm={searchTerm} /> 
          </ProtectedRoute>
        } />

        <Route path="/event/create" element={
          <ProtectedRoute>
            <Header onSearch={handleSearch}/>
            <CreateEvent />
          </ProtectedRoute>
        } />

        <Route path="/events/:eventId" element={
          <ProtectedRoute>
            <Header onSearch={handleSearch}/>
            <EventDetails />
          </ProtectedRoute>
        } />

        <Route path="/events/:eventId/create-carpool" element={
          <ProtectedRoute> 
            <Header onSearch={handleSearch}/> 
              <CreateCarpool />
            </ProtectedRoute>
        } />
        
        <Route path="/carpools/:carpoolId" element={
          <ProtectedRoute> 
            <Header onSearch={handleSearch}/> 
              <CarpoolDetails />
            </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Header onSearch={handleSearch}/> 
              <Profile />
          </ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
