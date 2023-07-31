import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, ListGroupItem, Container, Card, Form } from 'react-bootstrap';

const EpicList = () => {
    const [epics, setEpics] = useState([]);
    const [selectedEpic, setSelectedEpic] = useState(null);
    const [, setSelectedStory] = useState(null);
    const [showEpicModal, setShowEpicModal] = useState(false);
    const [showStoryModal, setShowStoryModal] = useState(false);
    const [editedEpicFields, setEditedEpicFields] = useState({ name: '', description: '' });
    const [editedStoryFields, setEditedStoryFields] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchEpics = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/projectsByUserId/${localStorage.getItem("idUser")}`);
                const data = await response.json();
                setEpics(data[0]?.project?.epics || []);
                console.log(data[0]?.project?.epics || []);
            } catch (error) {
                console.error('Error fetching epics:', error);
            }
        };

        fetchEpics();
    }, []);

    const handleEpicClick = (epic) => {
        setSelectedEpic(epic);
        setSelectedStory(null);
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setShowStoryModal(true);
        setEditedStoryFields({ name: story.name, description: story.description });
    };

    const handleOpenEpicModal = () => {
        setShowEpicModal(true);
        setEditedEpicFields({ name: selectedEpic.name, description: selectedEpic.description });
    };

    const handleCloseEpicModal = () => {
        setShowEpicModal(false);
    };

    const handleCloseStoryModal = () => {
        setShowStoryModal(false);
    };

    const handleEpicFieldChange = (e) => {
        setEditedEpicFields({ ...editedEpicFields, [e.target.name]: e.target.value });
    };

    const handleStoryFieldChange = (e) => {
        setEditedStoryFields({ ...editedStoryFields, [e.target.name]: e.target.value });
    };

    const handleSaveEpicChanges = () => {
        // Aquí puedes implementar la lógica para guardar los cambios en el epic
        console.log('Edited Epic Fields:', editedEpicFields);
        handleCloseEpicModal();
    };

    const handleSaveStoryChanges = () => {
        // Aquí puedes implementar la lógica para guardar los cambios en la historia
        console.log('Edited Story Fields:', editedStoryFields);
        handleCloseStoryModal();
    };

    const handleTaskStatusChange = (taskId, status) => {
        // Aquí puedes implementar la lógica para cambiar el estado de una tarea
        console.log('Task ID:', taskId);
        console.log('New Status:', status);
    };


    return (
        <Container>

            <h1>Epic List</h1>
            <ListGroup>
                {epics.map((epic) => (
                    <ListGroupItem key={epic.id} onClick={() => handleEpicClick(epic)} action>
                        {epic.name}
                    </ListGroupItem>
                ))}
            </ListGroup>
            {selectedEpic && (
                <Container className='mt-4'>
                    <h2>Epic Details</h2>
                    <p>Name: {selectedEpic.name}</p>
                    <p>Description: {selectedEpic.description}</p>
                    <h3>Assigned Stories</h3>
                    <ListGroup>
                        {selectedEpic.stories.map((story) => (
                            <ListGroupItem key={story.id} action>
                                <span onClick={() => handleStoryClick(story)}>Name: {story.name}</span> - State: {story.state_id}
                                <p>TaskList</p>
                                <Card>
                                    {story.tasks && story.tasks.map((task) => (
                                        <Card.Body key={task.id}>
                                            <Card.Title>Title: {task.title}</Card.Title>
                                            <Form.Check
                                                type="checkbox"
                                                label="Completed"
                                                checked={task.status === 0}
                                                onChange={() => handleTaskStatusChange(task.id, 'completed')}
                                            />
                                            <Form.Check
                                                type="checkbox"
                                                label="Not Completed"
                                                checked={task.status === 1}
                                                onChange={() => handleTaskStatusChange(task.id, 'not_completed')}
                                            />
                                        </Card.Body>
                                    ))}
                                </Card>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    <Button variant="primary" onClick={handleOpenEpicModal} className='mt-4'>
                        Edit Epic
                    </Button>
                </Container>
            )}
            <Modal show={showEpicModal} onHide={handleCloseEpicModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Epic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editedEpicFields.name}
                            onChange={handleEpicFieldChange}
                            className="form-control"
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={editedEpicFields.description}
                            onChange={handleEpicFieldChange}
                            className="form-control"
                        />
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEpicModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEpicChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showStoryModal} onHide={handleCloseStoryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editedStoryFields.name}
                            onChange={handleStoryFieldChange}
                            className="form-control"
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={editedStoryFields.description}
                            onChange={handleStoryFieldChange}
                            className="form-control"
                        />
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseStoryModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveStoryChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EpicList;