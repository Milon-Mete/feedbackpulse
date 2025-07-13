import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function Admindashboard() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filterMood, setFilterMood] = useState('');
    const [filterRating, setFilterRating] = useState('');

    // Redirect if not admin
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    // Fetch all feedback
    useEffect(() => {
        fetch('http://localhost:5000/allratings')
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Error fetching all reviews:', err));
    }, []);

    // Filtered reviews based on dropdowns
    const filteredReviews = reviews.filter(r => {
        return (!filterMood || r.mood === filterMood) &&
               (!filterRating || r.rating === parseInt(filterRating));
    });

    // Mood stats calculation
    const moodStats = { '😄': 0, '😐': 0, '😡': 0 };
    reviews.forEach(r => {
        moodStats[r.mood] = (moodStats[r.mood] || 0) + 1;
    });
    const total = reviews.length;
    const percent = mood => total ? ((moodStats[mood] / total) * 100).toFixed(1) : 0;

    // Last 7 days mood chart
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
    });

    const moodCountPerDay = last7Days.map(day => {
        const dayReviews = reviews.filter(r =>
            r.submittedAt && r.submittedAt.startsWith(day)
        );
        return {
            day,
            '😄': dayReviews.filter(r => r.mood === '😄').length,
            '😐': dayReviews.filter(r => r.mood === '😐').length,
            '😡': dayReviews.filter(r => r.mood === '😡').length,
        };
    });

    const chartData = {
        labels: last7Days,
        datasets: [
            {
                label: 'Positive 😄',
                data: moodCountPerDay.map(d => d['😄']),
                backgroundColor: 'green',
            },
            {
                label: 'Neutral 😐',
                data: moodCountPerDay.map(d => d['😐']),
                backgroundColor: 'gray',
            },
            {
                label: 'Negative 😡',
                data: moodCountPerDay.map(d => d['😡']),
                backgroundColor: 'red',
            }
        ]
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
    <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        🎯 Admin Review Dashboard
    </h1>

    {/* Insight Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {['😄', '😐', '😡'].map((mood) => (
            <div key={mood} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-1">
                    {mood} {mood === '😄' ? 'Positive' : mood === '😐' ? 'Neutral' : 'Negative'}
                </h2>
                <p className="text-3xl font-bold text-gray-700">{percent(mood)}%</p>
            </div>
        ))}
    </div>

    {/* Mood Chart */}
    <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">📈 Mood Trend (Last 7 Days)</h2>
        <Bar data={chartData} />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Filter by Mood:</label>
            <select
                className="border px-3 py-1 rounded"
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
            >
                <option value="">All</option>
                <option value="😄">Positive</option>
                <option value="😐">Neutral</option>
                <option value="😡">Negative</option>
            </select>
        </div>

        <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Filter by Rating:</label>
            <select
                className="border px-3 py-1 rounded"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
            >
                <option value="">All</option>
                {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} Star</option>
                ))}
            </select>
        </div>
    </div>

    {/* Review Cards */}
    <div className="space-y-6">
        {filteredReviews.length === 0 ? (
            <p className="text-center text-gray-500">No matching reviews.</p>
        ) : (
            filteredReviews.map((review) => {
                const avatarLetter = review.name?.charAt(0).toUpperCase() || '?';

                return (
                    <div
                        key={review._id}
                        className="bg-white p-5 rounded-lg shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-xl">
                            {avatarLetter}
                        </div>

                        {/* Review Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{review.name}</h3>
                            <p className="text-sm text-gray-500">{review.email}</p>
                            <p className="mt-2 text-gray-800">{review.message}</p>
                            <div className="text-sm text-gray-400 mt-1">
                                Submitted: {new Date(review.submittedAt).toLocaleString()}
                            </div>
                            <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium
                                ${review.mood === '😄' ? 'bg-green-100 text-green-700'
                                    : review.mood === '😡' ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'}`}>
                                Mood: {review.mood || '😐'}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="text-yellow-500 text-xl flex-shrink-0">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                );
            })
        )}
    </div>
</div>

    );
}

export default Admindashboard;
