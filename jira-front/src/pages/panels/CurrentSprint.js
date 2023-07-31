import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const CurrentSprint = () => {
    const [, setUserProjectsSprints] = useState([]);
    const [currentSprint, setCurrentSprint] = useState([]);
    const [, setStates] = useState([]);
    const [, setStories] = useState([]);
    const [organizedData, setOrganizedData] = useState({});
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadFromApi();
    }, []);

    const loadFromApi = () => {
        axios
            .get("http://localhost:8000/api/sprintByUserId/" + localStorage.getItem("idUser"), {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                setUserProjectsSprints(response.data);
                const sprints = response.data.sprints;
                console.log(sprints);
                if (sprints.length > 0) {
                    const sprint = sprints.find((sprint) => sprint.status === 1);
                    setCurrentSprint(sprint);
                }
                const { states, stories } = response.data;
                const statesArray = states.map((state) => state);
                setStates(statesArray);
                const storiesArray = stories.map((story) => story);
                setStories(storiesArray);

                console.log("Data:", response.data);
                console.log("States:", statesArray);
                console.log("Stories:", storiesArray);

                // Organizar los datos en filas y columnas
                const organizedData = {};
                states.forEach((state) => {
                    organizedData[state.name] = stories.filter((story) => story.state_id === state.id);
                });
                setOrganizedData(organizedData);
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
    };

    const moveRight = (indexCol, indexFila) => {
        const columnKeys = Object.keys(organizedData);
        const currentCol = columnKeys[indexCol];
        const nextCol = columnKeys[indexCol + 1];
        const nextColValue = organizedData[nextCol];
        nextColValue.push(organizedData[currentCol][indexFila]);
        const newOrganizedData = { ...organizedData };
        newOrganizedData[nextCol] = nextColValue;
        const currentColValue = newOrganizedData[currentCol];
        currentColValue.splice(indexFila, 1);
        newOrganizedData[currentCol] = currentColValue;
        setOrganizedData(newOrganizedData);

        const taskId = nextColValue[nextColValue.length - 1].id;
        axios
            .post(`http://localhost:8000/api/task/moveNextRoster/${taskId}`)
            .then((response) => {
                console.log("Task moved to the next roster: ", response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const moveLeft = (indexCol, indexFila) => {
        if (indexCol > 0) {
            const columnKeys = Object.keys(organizedData);
            const currentCol = columnKeys[indexCol];
            const prevCol = columnKeys[indexCol - 1];
            const prevColValue = organizedData[prevCol];
            prevColValue.push(organizedData[currentCol][indexFila]);

            const newOrganizedData = { ...organizedData };
            newOrganizedData[prevCol] = prevColValue;

            const currentColValue = newOrganizedData[currentCol];
            currentColValue.splice(indexFila, 1);
            newOrganizedData[currentCol] = currentColValue;

            setOrganizedData(newOrganizedData);

            const taskId = prevColValue[prevColValue.length - 1].id;
            axios
                .post(`http://localhost:8000/api/task/moveBackRoster/${taskId}`)
                .then((response) => {
                    console.log("Task moved to the previous roster: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const moveUp = (indexCol, indexFila, taskId) => {
        if (indexFila > 0) {
            const columnKeys = Object.keys(organizedData);
            const currentCol = columnKeys[indexCol];
            const currentColValue = organizedData[currentCol];
            const movedItem = currentColValue.splice(indexFila, 1)[0];
            currentColValue.splice(indexFila - 1, 0, movedItem);
            const newOrganizedData = { ...organizedData };
            newOrganizedData[currentCol] = currentColValue;
            setOrganizedData(newOrganizedData);

            axios
                .post(`http://localhost:8000/api/task/orderRest/${taskId}`)
                .then((response) => {
                    console.log("Task order updated: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const moveDown = (indexCol, indexFila, taskId) => {
        const columnKeys = Object.keys(organizedData);
        const currentCol = columnKeys[indexCol];
        const currentColValue = organizedData[currentCol];
        if (indexFila < currentColValue.length - 1) {
            const movedItem = currentColValue.splice(indexFila, 1)[0];
            currentColValue.splice(indexFila + 1, 0, movedItem);
            const newOrganizedData = { ...organizedData };
            newOrganizedData[currentCol] = currentColValue;
            setOrganizedData(newOrganizedData);

            axios
                .post(`http://localhost:8000/api/task/orderSum/${taskId}`)
                .then((response) => {
                    console.log("Task order updated: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setShowModal(false);
    };

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <>
                            <p>Title: {selectedTask.title}</p>
                            <p>Status: {selectedTask.status}</p>
                            <p>Order: {selectedTask.order}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {error && (
                <div className="card">
                    <div className="card-body">
                        <p className="card-text">{error}</p>
                    </div>
                </div>
            )}
            <h1>Current Sprint</h1>
            {currentSprint && (
                <Card>
                    <Card.Body>
                        <Card.Title>Sprint {currentSprint.order}</Card.Title>
                        <Card.Text>Start Date: {currentSprint.start_date}</Card.Text>
                        <Card.Text>End Date: {currentSprint.end_date}</Card.Text>
                    </Card.Body>
                </Card>
            )}
            <div className="container mt-5">
                <div className="row">
                    {Object.entries(organizedData).map(([stateName, stateStories], indexCol) => (
                        <div key={stateName} className="col-md-3">
                            <div className="card">
                                <div className="card-header">{stateName}</div>
                                <div className="card-body">
                                    {stateStories.map((story, indexFila) => (
                                        <div key={story.id} className="card mb-3">
                                            <div className="card-body">
                                                <h5 className="card-title">Story: {story.name}</h5>
                                                <p className="card-text">Description: {story.description}</p>
                                                <Card className='mb-3'>
                                                    <Card.Header>Tasks</Card.Header>
                                                    {story.tasks &&
                                                        story.tasks.map((task) => (
                                                        
                                                            <Card.Body
                                                                key={task.id}
                                                                onClick={() => handleTaskClick(task)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                Title: {task.title}
                                                            </Card.Body>
                                                        ))}
                                                </Card>
                                                <div className="d-flex justify-content-between">
                                                    <Button variant="secondary" onClick={() => moveUp(indexCol, indexFila, story.id)}>
                                                        Up
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => moveDown(indexCol, indexFila, story.id)}>
                                                        Down
                                                    </Button>
                                                    {indexCol > 0 && (
                                                        <Button variant="secondary" onClick={() => moveLeft(indexCol, indexFila)}>
                                                            Left
                                                        </Button>
                                                    )}
                                                    {indexCol < Object.keys(organizedData).length - 1 && (
                                                        <Button variant="secondary" onClick={() => moveRight(indexCol, indexFila)}>
                                                            Right
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CurrentSprint;