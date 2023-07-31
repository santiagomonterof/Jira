import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const SearchElement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const requestData = {
            search: searchTerm
        };

        axios.post("http://localhost:8000/api/searchElement/" + localStorage.getItem('idUser'), requestData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleResultClick = (element) => {
        setSelectedElement(element);
        setShowModal(true);
    };

    const renderElementProperties = (element) => {
        return Object.keys(element).map((key) => {
            const value = element[key];
            if (value === null) {
                return null; // Ignorar elementos null
            }
            return (
                <div key={key}>
                    <strong>{key}: </strong>
                    {key === 'epic' || key === 'story' || key === 'task' ? (
                        <p>{value.name}</p> // Mostrar nombre en lugar de ID
                    ) : (
                        <p>{value}</p> // Mostrar valor simple en una etiqueta <p>
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <h1>Search</h1>
            <form className="mb-4" onSubmit={handleFormSubmit}>
                <div className="input-group">
                    <input type="text" className="form-control" value={searchTerm} onChange={handleInputChange} />
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
            </form>

            <h2>Search Results</h2>
            {searchResults.length > 0 ? (
                <ul className="list-group">
                    {searchResults.map((result, index) => (
                        <li className="list-group-item" key={index} onClick={() => handleResultClick(result)}>
                            <h3>{result.type === 'task' ? result.element.title : result.element.name}</h3>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}
            {showModal && selectedElement && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedElement.element.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>{selectedElement.type}</h4>
                        {renderElementProperties(selectedElement.element)}
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default SearchElement;