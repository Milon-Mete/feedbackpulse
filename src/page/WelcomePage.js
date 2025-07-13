import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const [key, setKey] = useState('');
    const navigate = useNavigate();

    function handleSubmit() {
        if (key === '1234') {
            localStorage.setItem('role', 'user');
            navigate('/DashboardPage');
        } else if (key === '4321') {
            localStorage.setItem('role', 'admin');
            navigate('/Admindashboardpage');
        } else {
            alert('Incorrect key');
        }
    }

    return (
 <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full animate-fade-in">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    🔐 Welcome to Secure Entry
                </h1>
                <p className="text-gray-600 text-center mb-4">
                    Please enter your access key below to continue
                </p>
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your key..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 mb-5"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                >
                    🚀 Enter
                </button>
            </div>
        </div>
    );
}

export default Welcome;
