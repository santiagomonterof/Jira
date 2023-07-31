import { Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState([]);
    useEffect(() => {
        fetchProjectList();
    }, [])

    const fetchProjectList = () => {
        axios.get("http://localhost:8000/api/projectsByUserId/" + localStorage.getItem("idUser"), {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                setProjectList(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    const editProject = (id) => {
        navigate("/project/edit/" + id);
    }

    const deleteProject = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/project/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            fetchProjectList();
        }).catch((error) => {
            console.log(error);
        });
    }

    const addFriend = (code) => {
        navigate("/project/dataFriend/" + code);
    }

    const infoProject = (code) => {
        navigate("/project/data/" + code);
    }

    const handleDeleteEpic = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/epic/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            fetchProjectList();
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleDeleteStory = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/story/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            fetchProjectList();
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleDeleteTask = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/task/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            fetchProjectList();
        }).catch((error) => {
            console.log(error);
        });
    }


    return (<>
        <Container>
            <Row className="mt-3">
                {projectList.map((project) => (
                    <Col key={project.id} sm={12} md={6} lg={4} xl={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.project.name}</Card.Title>
                                <Card.Text>Code: {project.project.code}</Card.Text>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Epics</Card.Title>
                                        {project.project.epics.map((epic) => (
                                            <Card key={epic.id} className="mb-4">
                                                <Card.Header>{epic.name}</Card.Header>
                                                <Card.Body className="d-flex justify-content-evenly">
                                                    <Button variant="light" onClick={() => navigate("/epic/data/" + epic.id)}>Info</Button>
                                                    <Button variant="light" onClick={() => navigate("/epic/edit/" + epic.id)}>Edit</Button>
                                                    <Button variant="danger" onClick={() => handleDeleteEpic(epic.id)}>Delete</Button>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                </Card>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Stories</Card.Title>
                                        {project.project.stories.map((story) => (
                                            <Card key={story.id} className="mb-4">
                                                <Card.Header>{story.name}</Card.Header>
                                                <Card.Body className="d-flex justify-content-evenly">
                                                    <Button variant="light" onClick={() => navigate("/story/data/" + story.id)}>Info</Button>
                                                    <Button variant="light" onClick={() => navigate("/story/edit/" + story.id)}>Edit</Button>
                                                    <Button variant="danger" onClick={() => handleDeleteStory(story.id)}>Delete</Button>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                </Card>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Tasks</Card.Title>
                                        {project.project.stories.map((story) =>
                                            story.tasks.map((task) => (
                                                <Card key={task.id} className="mb-4">
                                                    <Card.Header>{task.title}</Card.Header>
                                                    <Card.Body className="d-flex justify-content-evenly">
                                                        <Button variant="light" onClick={() => navigate("/task/data/" + task.id)}>Info</Button>
                                                        <Button variant="light" onClick={() => navigate("/task/edit/" + task.id)}>Edit</Button>
                                                        <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                                        </Card.Body>
                                                </Card>
                                            ))
                                        )}
                                    </Card.Body>
                                </Card>

                                {project.is_admin === 1 && (
                                    <div className="d-flex justify-content-evenly">
                                        <Button variant="light" onClick={() => infoProject(project.project.code)}>Info</Button>
                                        <Button variant="light" onClick={() => addFriend(project.project.code)}>Add Friend</Button>
                                        <Button variant="light" onClick={() => editProject(project.project.id)}>Edit</Button>
                                        <Button variant="danger" onClick={() => deleteProject(project.project.id)}>Delete</Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    </>
    );
}

export default ProjectList;
