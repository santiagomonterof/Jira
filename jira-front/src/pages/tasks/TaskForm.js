import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const TaskForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState(0);
    const [stories, setStoryList] = useState([]);
    const [selectedStoryId, setSelectedStoryId] = useState('');

    useEffect(() => {
        fetchProjectList();
        if (!id) {
            return;
        }
        fetchTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchProjectList = () => {
        axios
            .get("http://localhost:8000/api/projectsByUserId/" + localStorage.getItem("idUser"), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const projects = response.data;
                const allStories = projects.flatMap((project) => project.project.stories);
                setStoryList(allStories);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchTask = () => {
        axios.get("http://localhost:8000/api/task/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const task = response.data;
            setTitle(task.title);
            setStatus(task.status);
            setStoryList(task.project.stories); // Agregar esta línea
        }).catch((error) => {
            console.log(error);
        });
    }
    const sendData = (e) => {
        e.preventDefault();
        const task = {
            title,
            status,
            story_id: selectedStoryId, // Actualizar el story_id con el selectedStoryId
        };
        if (id) {
            updateTask(task);
        } else {
            createTask(task);
        }
    }
    const updateTask = (task) => {
        axios.put("http://localhost:8000/api/task/" + id, task, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                navigate("/project/home");
            }).catch((error) => {
                console.log(error);
            });
    }
    const createTask = (task) => {
        axios.post("http://localhost:8000/api/task/", task, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                navigate("/project/home");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3">
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Form Task</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl value={title} required type="text" id="title" onChange={(e) => {
                                            setTitle(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="status" titulo="Status" />
                                        <Form.Select
                                            value={status}
                                            required
                                            id="status"
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                            }}
                                        >
                                            <option value="1">Fullfilled</option>
                                            <option value="0">Not Fullfilled</option>
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="story_id" titulo="Story" />
                                        <Form.Select
                                            id="story_id"
                                            value={selectedStoryId}
                                            onChange={(e) => {
                                                setSelectedStoryId(e.target.value);
                                            }}
                                            required
                                        >
                                            <option value="">Select a story</option>
                                            {stories.map((story) => (
                                                <option key={story.id} value={story.id}>
                                                    {story.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">Submit</Button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default TaskForm;