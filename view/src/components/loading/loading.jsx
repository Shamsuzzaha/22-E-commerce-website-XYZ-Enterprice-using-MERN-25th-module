import React, { useState, useEffect } from 'react';
import './Loading.css';  // Optional: For custom styling

const Loading = () => {
    const [count, setCount] = useState(15);

    useEffect(() => {
        if (count > 0) {
            const timer = setInterval(() => {
                setCount((prevCount) => prevCount - 1);  // Decrement the count by 1 every second
            }, 1000);

            return () => clearInterval(timer);  // Cleanup the timer on component unmount
        }
    }, [count]);  // Dependency on count to trigger the effect when count changes

    return (
        <div className="loading-container d-flex flex-column justify-content-center align-items-center">
            <div className="spinner"></div>
            <h3 className="text-center">Connecting to the server...</h3>
            <h4 className="text-center">Countdown: {count} seconds</h4>
        </div>
    );
};

export default Loading;
