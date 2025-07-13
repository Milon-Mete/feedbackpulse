import React from 'react';

function StarRating({ rating, setRating }) {
  return (
    <div className="text-3xl cursor-pointer flex gap-4 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
      <p className="mt-1 text-lg ml-2">{rating}</p>
    </div>
  );
}

export default StarRating;
