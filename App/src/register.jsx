import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
    return <RegisterForm />;
}

async function checkUsernameAvailability(username) {
    const response = await fetch('http://localhost:3001/user');
    if (!response.ok) {
        throw new Error('Failed to check username availability');
    }
    const users = await response.json();
    return !users.find(u => u.username === username);
}

async function registerUser(user) {
    const response = await fetch('http://localhost:3001/user');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const users = await response.json();
    const newId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;

    const newUser = { ...user, id: newId.toString() }; // שמירה של ה-ID כמחרוזת

    const registerResponse = await fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(`Failed to register: ${errorData.message}`);
    }

    return await registerResponse.json();
}

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== passwordVerify) {
            setError('Passwords do not match');
            return;
        }

        try {
            const isAvailable = await checkUsernameAvailability(username);
            if (!isAvailable) {
                setError('Username already taken');
                return;
            }

            const newUser = {
                username,
                website: password, // שדה website ישמש כסיסמה לצורך הדוגמה
                name: '',
                email: '',
                phone: '',
                address: {
                    street: '',
                    suite: '',
                    city: '',
                    zipcode: '',
                    geo: {
                        lat: '',
                        lng: ''
                    }
                },
                company: {
                    name: '',
                    catchPhrase: '',
                    bs: ''
                }
            };

            const createdUser = await registerUser(newUser);
            localStorage.setItem('user', JSON.stringify(createdUser));
            navigate('/complete-profile');
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <label>
                Verify Password:
                <input
                    type="password"
                    value={passwordVerify}
                    onChange={(e) => setPasswordVerify(e.target.value)}
                />
            </label>
            {error && <p>{error}</p>}
            <input type="submit" value="Register" />
        </form>
    );
}

export default Register;
