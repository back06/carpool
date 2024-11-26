// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add token to request headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//
// export const viewEventDetails = (eventId) => api.get(`/api/events/${eventId}`);
export const getCarpools = (eventId) => api.get(`/carpools?eventId=${eventId}`);
export const createCarpool = (carpoolData) => api.post('/carpools/create', carpoolData);
export const joinCarpool = (joinData) => api.post('/carpools/join', joinData);
//

// Signup function
export const registerUser = (data) => api.post('/users/register', data);
// Login function
export const loginUser = (data) => api.post('/users/login', data);
// Logout function
export const logoutUser = () => localStorage.removeItem('token');

// Event Management APIs
export const createEvent = async (data) => {
  console.log(data)
  await api.post('/events', data);
}
  
export const listEvents = () => api.get('/events');
export const viewEventDetails = (eventId) => api.get(`/events/${eventId}`);

// Carpool Management APIs
export const getCarpoolDetails = (carpoolId) => api.get(`/carpools/${carpoolId}`);
export const optOutCarpool = (carpoolId, userId) => api.delete(`/carpools/${carpoolId}/unjoin/${userId}`);
export const deleteCarpool = (carpoolId) => api.delete(`/carpools/${carpoolId}`);
export const fetchUserProfile = (userId) =>  api.get(`/users/profile/${userId}`);


export default api;