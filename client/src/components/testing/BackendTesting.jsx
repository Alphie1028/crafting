import React, { useState, useEffect } from 'react';

const BackendTesting: React.FC = () => {
    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        fetchCounter();
    }, []);

    const fetchCounter = async () => {
        try {
        const response = await fetch('http://localhost:5000/counter');
        const data = await response.json();
        setCounter(data.value);
        } catch (err) {
        console.error(err);
        }
    };

    const incrementCounter = async () => {
        try {
        const response = await fetch('http://localhost:5000/counter', {
            method: 'POST'
        });
        const data = await response.json();
        setCounter(data.value);
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div>
        <p>Counter value (from DB): {counter}</p>
        <button onClick={incrementCounter}>Increment Counter</button>
        </div>
    );
};

export default BackendTesting;
