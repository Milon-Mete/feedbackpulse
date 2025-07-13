import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../component/Form';

function Dashboard() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupreview, setShowPopupreview] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviews, setReviews] = useState([]);

    // Fetch review history by email
    const fetchReviews = () => {
        if (email) {
            fetch(`http://localhost:5000/userrating?email=${email}`)
                .then(res => res.json())
                .then(data => setReviews(data))
                .catch(err => console.error('Error fetching reviews:', err));
        }
    };

    // Check role
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'user') {
            navigate('/');
        }
    }, [navigate]);

    // Load user info and fetch review history
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');

        if (!storedName || !storedEmail) {
            setShowPopup(true);
        } else {
            setName(storedName);
            setEmail(storedEmail);
        }
    }, []);

    // Fetch reviews when email is set
    useEffect(() => {
        fetchReviews();
    }, [email]);

    const handleSubmit = () => {
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        setShowPopup(false);
    };

    return (
        <>
    {/* Header */}
    <div className="bg-gray-100 p-4 shadow-md flex justify-between items-center">
        <div>
            <p className="font-semibold text-lg">👤 {name || 'User'}</p>
            <p className="text-sm text-gray-600">📧 {email || 'Email not set'}</p>
        </div>
        <button
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => setShowPopup(true)}
        >
            Edit Info
        </button>
    </div>

    {/* Welcome Title */}
    <h1 className="text-3xl font-bold text-center mt-6 mb-4 text-gray-800">
        🎉 Welcome to Your Dashboard
    </h1>

    {/* Add Review Button */}
    <div className="text-center mt-4">
        <button
            onClick={() => setShowPopupreview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
            ➕ Add New Review
        </button>
    </div>

    {/* Review History */}
    <div className="mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">🕓 Previous Review History</h2>
        {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">You haven't submitted any reviews yet.</p>
        ) : (
            <ul className="space-y-4">
                {reviews.map((review) => (
                    <li
                        key={review._id}
                        className="bg-white border p-4 rounded shadow hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-md text-gray-800 font-medium mb-1">
                                    {review.message}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Submitted: {new Date(review.submittedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-yellow-500 text-lg leading-tight">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Popup: Add Review */}
    {showPopupreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-red-100 p-6 rounded-lg shadow-md relative w-[90%] max-w-md">
                {/* Close button */}
                <button
                    onClick={() => setShowPopupreview(false)}
                    className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-red-600"
                    aria-label="Close"
                >
                    ×
                </button>
                <Form
                    name={name}
                    email={email}
                    onClose={() => setShowPopupreview(false)}
                    onReviewSubmitted={fetchReviews}
                />
            </div>
        </div>
    )}

    {/* Popup: Edit Info */}
    {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">✏️ Edit Your Info</h2>
                <input
                    type="text"
                    placeholder="Name"
                    className="border w-full mb-3 p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border w-full mb-4 p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-1 rounded border border-gray-400 text-gray-700"
                        onClick={() => {
                            const storedName = localStorage.getItem('name');
                            const storedEmail = localStorage.getItem('email');
                            setName(storedName || '');
                            setEmail(storedEmail || '');
                            setShowPopup(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 rounded border border-green-500 text-green-600"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )}
</>

    );
}

export default Dashboard;
