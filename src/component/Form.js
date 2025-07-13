import { useState } from "react";
import StarRating from "./star";

function Form({ name, email, onClose, onReviewSubmitted }) {
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async () => {
        if (!message) {
            alert("Please enter a message");
            return;
        }

        const data = { name, email, message, rating };

        try {
            const response = await fetch('http://localhost:5000/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Review submitted successfully!");
                setMessage('');
                onReviewSubmitted();  // ✅ Refresh history in Dashboard
                onClose();            // ✅ Close modal
            } else {
                alert("Error submitting review.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] ">
    <div className="flex flex-col gap-5 w-[90%] max-w-lg bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold font-serif text-center text-red-700">📝 Submit Feedback</h1>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
                value={name}
                disabled
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed text-gray-700"
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
                value={email}
                disabled
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed text-gray-700"
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea
                placeholder="Please enter your feedback"
                className="w-full p-2 border rounded resize-none"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
        </div>

        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
            <StarRating rating={rating} setRating={setRating} />
        </div>

        <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow"
            onClick={handleSubmit}
        >
            ✅ Submit Review
        </button>
    </div>
</div>

    );
}

export default Form;
