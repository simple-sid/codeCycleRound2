import React, { useState, useRef } from 'react';
import './App.css';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const defaultCenter = {
    latitude: 13.0843,
    longitude: 80.2705,
    zoom: 12
};

function App() {
    const [location, setLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [error, setError] = useState('');
    const [trustedContacts, setTrustedContacts] = useState([]);
    const [newContactName, setNewContactName] = useState('');
    const [newContactNumber, setNewContactNumber] = useState('');
    const [experienceReport, setExperienceReport] = useState('');
    const [reportVisible, setReportVisible] = useState(false);
    const clickTimeout = 250;
    const clickCountRef = useRef(0);

    const handlePanicButtonClick = () => {
        clickCountRef.current += 1;

        setTimeout(() => {
            if (clickCountRef.current === 1) {
                alert("False alarm. No action taken.");
            } else if (clickCountRef.current === 2) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setLocation({ latitude, longitude });
                            alert(`Emergency alert sent: Latitude ${latitude}, Longitude ${longitude}`);
                        },
                        (error) => setError(error.message)
                    );
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            }
            clickCountRef.current = 0;
        }, clickTimeout);
    };

    const viewSafetyMap = () => {
        setShowMap(true);
    };

    const addTrustedContact = () => {
        if (newContactName.trim() && newContactNumber.trim()) {
            setTrustedContacts([...trustedContacts, { name: newContactName.trim(), number: newContactNumber.trim() }]);
            setNewContactName('');
            setNewContactNumber('');
        } else {
            alert("Please enter a valid name and number.");
        }
    };

    const removeContact = (index) => {
        setTrustedContacts(trustedContacts.filter((_, i) => i !== index));
    };

    const handleExperienceReportChange = (e) => {
        setExperienceReport(e.target.value);
    };

    const handleExperienceSubmit = () => {
        if (experienceReport.trim()) {
            alert(`Experience reported: ${experienceReport}`);
            setExperienceReport('');
            setReportVisible(false);
        } else {
            alert("Please enter a valid report.");
        }
    };

    return (
        <div className="container">
            <h1>Report Harassment</h1>
            <button className="panic-button" onClick={handlePanicButtonClick}>
                Panic Button
            </button>
            <button className="view-map" onClick={viewSafetyMap}>View Safety Map</button>

            <div className="trusted-contacts">
                <h2>Trusted Contacts</h2>
                <input 
                    type="text" 
                    value={newContactName} 
                    onChange={(e) => setNewContactName(e.target.value)} 
                    placeholder="Enter name" 
                />
                <input 
                    type="text" 
                    value={newContactNumber} 
                    onChange={(e) => setNewContactNumber(e.target.value)} 
                    placeholder="Enter phone number" 
                />
                <button onClick={addTrustedContact}>Add Contact</button>
                <ul>
                    {trustedContacts.map((contact, index) => (
                        <li key={index}>
                            {contact.name} - {contact.number}
                            <button onClick={() => removeContact(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="report-experience" onClick={() => setReportVisible(!reportVisible)}>
                Report an Experience
            </button>
            {reportVisible && (
                <div>
                    <textarea 
                        value={experienceReport} 
                        onChange={handleExperienceReportChange} 
                        placeholder="Describe your experience" 
                    />
                    <button onClick={handleExperienceSubmit}>Submit</button>
                </div>
            )}

            {error && <p className="error">{error}</p>}
            {location && (
                <p className="location">
                    Current Location: Latitude {location.latitude}, Longitude {location.longitude}
                </p>
            )}
            {showMap && (
                <Map
                    initialViewState={{
                        ...defaultCenter,
                        ...(location && { latitude: location.latitude, longitude: location.longitude })
                    }}
                    style={{ width: '100%', height: '400px' }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken="pk.eyJ1Ijoic2lkZGhlc2gyMDA0IiwiYSI6ImNtMnJkYWV4ZjFjOXkyb3ByZ2NvN3Bnem0ifQ.9osz_ykutvNUaofyXy5s2Q"
                >
                    {location && (
                        <Marker latitude={location.latitude} longitude={location.longitude} color="red" />
                    )}
                </Map>
            )}
        </div>
    );
}

export default App;

