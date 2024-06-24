import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompleteProfile.css';

function CompleteProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [street, setStreet] = useState(user.address.street || '');
    const [suite, setSuite] = useState(user.address.suite || '');
    const [city, setCity] = useState(user.address.city || '');
    const [zipcode, setZipcode] = useState(user.address.zipcode || '');
    const [geoLat, setGeoLat] = useState(user.address.geo.lat || '');
    const [geoLng, setGeoLng] = useState(user.address.geo.lng || '');
    const [companyName, setCompanyName] = useState(user.company.name || '');
    const [companyCatchPhrase, setCompanyCatchPhrase] = useState(user.company.catchPhrase || '');
    const [companyBs, setCompanyBs] = useState(user.company.bs || '');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedUser = {
            ...user,
            name,
            email,
            phone,
            address: {
                street,
                suite,
                city,
                zipcode,
                geo: {
                    lat: geoLat,
                    lng: geoLng
                }
            },
            company: {
                name: companyName,
                catchPhrase: companyCatchPhrase,
                bs: companyBs
            }
        };

        try {
            const fetchResponse = await fetch(`http://localhost:3001/user?id=${user.id}`);
            if (!fetchResponse.ok) {
                throw new Error('Failed to fetch user');
            }
            const fetchedUsers = await fetchResponse.json();
            if (fetchedUsers.length === 0) {
                throw new Error(`User with ID ${user.id} not found`);
            }
            const existingUser = fetchedUsers[0];

            const response = await fetch(`http://localhost:3001/user/${existingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            localStorage.setItem('user', JSON.stringify(updatedUser));
            navigate('/home');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form2">
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div>
                <label>Street:</label>
                <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </div>
            <div>
                <label>Suite:</label>
                <input
                    type="text"
                    value={suite}
                    onChange={(e) => setSuite(e.target.value)}
                />
            </div>
            <div>
                <label>City:</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div>
                <label>Zipcode:</label>
                <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                />
            </div>
            <div>
                <label>Geo Latitude:</label>
                <input
                    type="text"
                    value={geoLat}
                    onChange={(e) => setGeoLat(e.target.value)}
                />
            </div>
            <div>
                <label>Geo Longitude:</label>
                <input
                    type="text"
                    value={geoLng}
                    onChange={(e) => setGeoLng(e.target.value)}
                />
            </div>
            <div>
                <label>Company Name:</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>
            <div>
                <label>Company CatchPhrase:</label>
                <input
                    type="text"
                    value={companyCatchPhrase}
                    onChange={(e) => setCompanyCatchPhrase(e.target.value)}
                />
            </div>
            <div>
                <label>Company Bs:</label>
                <input
                    type="text"
                    value={companyBs}
                    onChange={(e) => setCompanyBs(e.target.value)}
                />
            </div>
            <input type="submit" value="Complete Profile" />
        </form>
    );
}

export default CompleteProfile;
