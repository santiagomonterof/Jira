import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';

const SprintPlanning = () => {
    const [sprintsData, setSprintsData] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);

    const fetchData = () => {
        const token = localStorage.getItem('token');
        const idUser = localStorage.getItem('idUser');

        axios
            .get(`http://localhost:8000/api/sprintsWithStoriesByUser/${idUser}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                const sprintData = response.data;
                setSprintsData(sprintData);
            })
            .catch((error) => {
                console.error('Error al obtener los datos del sprint:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const organizeStoriesBySprint = (sprints) => {
        const handleStoryClick = (story) => {
            setSelectedStory(story);
        };

        return sprints.map((sprint) => (
            <Container key={sprint.id} className="mb-4">
                <h2>Sprint {sprint.id}</h2>
                <div className="d-flex flex-wrap">
                    {sprint.stories.map((story) => (
                        <Card key={story.id} className="m-2">
                            <Card.Header>Story {story.id}</Card.Header>
                            <Card.Body>
                                <Button className='ml-0' variant="button" onClick={() => handleStoryClick(story)}>
                                    <Card.Text className="mb-0">Name: {story.name}</Card.Text>
                                </Button>
                                <Card.Text className="mb-0">Description: {story.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Container>
        ));
    };

    return (
        <div className="bg-dark text-light p-4">
            <h1 className="text-center mb-4">Sprint Planning</h1>
            {organizeStoriesBySprint(sprintsData)}
            {selectedStory && (
                <div className="row mt-4">
                    <div className="col-md-4">
                        <Card className="mb-4">
                            <Card.Header>Story Detail</Card.Header>
                            <Card.Body>
                                <Card.Text>Name: {selectedStory.name}</Card.Text>
                                <Card.Text>Description: {selectedStory.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>

                    {selectedStory.epic && (
                        <div className="col-md-4">
                            <Card className="mb-4">
                                <Card.Header>Epic Detail</Card.Header>
                                <Card.Body>
                                    <Card.Text>Name: {selectedStory.epic.name}</Card.Text>
                                    <Card.Text>Description: {selectedStory.epic.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    )}

                    {selectedStory.user && (
                        <div className="col-md-4">
                            <Card className="mb-4">
                                <Card.Header>Creator Detail</Card.Header>
                                <Card.Body>
                                    <Card.Text>Name: {selectedStory.user.full_name}</Card.Text>
                                    <Card.Text>Email: {selectedStory.user.email}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SprintPlanning;