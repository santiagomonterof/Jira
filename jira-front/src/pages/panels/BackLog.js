    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import { Button, Card, Col, Container, Row, Table, Modal, Form } from "react-bootstrap";

    const Backlog = () => {
        const [sprints, setSprints] = useState([]);
        const [stories, setStories] = useState([]);
        const [showSprintModal, setShowSprintModal] = useState(false);
        const [showAddToSprintModal, setShowAddToSprintModal] = useState(false);
        const [selectedSprintStories, setSelectedSprintStories] = useState([]);
        const [selectedStory, setSelectedStory] = useState("");
        const [selectedSprint, setSelectedSprint] = useState("");

        useEffect(() => {
            loadSprints();
            loadStories();
        }, []);

        const loadSprints = () => {
            axios
                .get(
                    "http://localhost:8000/api/sprintByUserId/" +
                    localStorage.getItem("idUser"),
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                )
                .then((response) => {
                    setSprints(response.data.sprints);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const loadStories = () => {
            axios
                .get(
                    "http://localhost:8000/api/storiesNotAssigned/" +
                    localStorage.getItem("idUser"),
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                )
                .then((response) => {   
                    setStories(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const handleListStories = (sprintId) => {
            axios
                .get(`http://localhost:8000/api/storiesBySprintId/${sprintId}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    setSelectedSprintStories(response.data);
                    setShowSprintModal(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const handleAddToSprint = (story) => {
            setSelectedStory(story);
            setShowAddToSprintModal(true);
        };

        const handleSprintSelection = (event) => {
            setSelectedSprint(event.target.value);
        };

        const handleAddToSprintSubmit = () => {
            // Aquí puedes realizar la lógica para agregar la historia al sprint seleccionado
            console.log("Selected Story:", selectedStory);
            console.log("Selected Sprint:", selectedSprint);
            const data = {
                story_id: selectedStory,
                sprint_id: selectedSprint,
            };
            axios
                .post("http://localhost:8000/api/sprintStory", data, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    loadSprints();
                    loadStories();
                })
                .catch((error) => {
                    console.log(error);
                });

            setShowAddToSprintModal(false);
        };

        return (
            <>
                <Container>
                    <Row className="mt-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>List of Sprints</Card.Title>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Order</th>
                                                <th>Status</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sprints.map((sprint) => {
                                                return (
                                                    <tr key={sprint.id}>
                                                        <td>{sprint.id}</td>
                                                        <td>{sprint.start_date}</td>
                                                        <td>{sprint.end_date}</td>
                                                        <td>{sprint.order}</td>
                                                        <td
                                                            style={{
                                                                color:
                                                                    sprint.status === 1
                                                                        ? "green"
                                                                        : sprint.status === 2
                                                                            ? "blue"
                                                                            : "red",
                                                            }}
                                                        >
                                                            {sprint.status === 1
                                                                ? "Open"
                                                                : sprint.status === 2
                                                                    ? "Pending"
                                                                    : "Closed"}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() => {
                                                                    handleListStories(sprint.id);
                                                                }}
                                                            >
                                                                List Stories
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>List of Stories</Card.Title>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Story Points</th>
                                                <th>Epic Id</th>
                                                <th>State</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {console.log(stories)}
                                            {stories.map((story) => {
                                                return (
                                                    <tr key={story.id}>
                                                        <td>{story.id}</td>
                                                        <td>{story.name}</td>
                                                        <td>{story.description}</td>
                                                        <td>{story.story_points}</td>
                                                        <td>{story.epic_id}</td>
                                                        <td>{story.state_id}</td>
                                                        <td>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() => {
                                                                    handleAddToSprint(story.id);
                                                                }}
                                                            >
                                                                Add to Sprint
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {/* Modal para mostrar las historias del sprint */}
                <Modal show={showSprintModal} onHide={() => setShowSprintModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Stories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    {/* Agrega más columnas según las propiedades que desees mostrar */}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSprintStories.map((story) => (
                                    <tr key={story.id}>
                                        <td>{story.id}</td>
                                        <td>{story.name}</td>
                                        {/* Agrega más celdas según las propiedades que desees mostrar */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSprintModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal para agregar una historia a un sprint */}
                <Modal show={showAddToSprintModal} onHide={() => setShowAddToSprintModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Story to Sprint</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="sprintSelection">
                                <Form.Label>Select Sprint</Form.Label>
                                <Form.Control as="select" onChange={handleSprintSelection}>
                                    <option value="">Select Sprint</option>
                                    {sprints.map((sprint) => (
                                        <option key={sprint.id} value={sprint.id}>
                                            Sprint {sprint.order}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddToSprintModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddToSprintSubmit}>
                            Add to Sprint
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    };

    export default Backlog;