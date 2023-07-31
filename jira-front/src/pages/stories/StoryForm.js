import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const StoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [story_points, setStoryPoints] = useState("");
    const [epic_id, setEpicId] = useState("");
    const [state_id, setStateId] = useState("");
    const [project_id, setProjectId] = useState("");
    const [projects, setProjectList] = useState([]);
    const [projectStates, setProjectStates] = useState([]);
    const [, setEpics] = useState([]);
    const [selectedProjectEpics, setSelectedProjectEpics] = useState([]);

    useEffect(() => {
        fetchProjectList();
        if (!id) {
            return;
        }
        fetchStory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchStory = () => {
        axios
            .get("http://localhost:8000/api/story/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const story = response.data;
                setName(story.name);
                setDescription(story.order);
                setStateId(story.state_id);
                setEpicId(story.epic_id);
                setProjectId(story.project_id);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchProjectList = () => {
        axios
            .get("http://localhost:8000/api/projectsByUserId/" + localStorage.getItem("idUser"), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                setProjectList(response.data);
                if (response.data.length > 0) {
                    const selectedProject = response.data[0].project;
                    setProjectId(selectedProject.id);
                    setStateId(selectedProject.states[0].id);
                    setProjectStates(selectedProject.states);
                    setEpics(selectedProject.epics);
                    setSelectedProjectEpics(selectedProject.epics);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const sendData = (e) => {
        e.preventDefault();
        const story = {
            name,
            story_points,
            description,
            epic_id,
            state_id,
            project_id,
            user_id: localStorage.getItem("idUser"),
        };
        if (id) {
            updateEpic(story);
        } else {
            createEpic(story);
        }
    };

    const updateEpic = (story) => {
        axios
            .put("http://localhost:8000/api/story/" + id, story, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                navigate("/project/home");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const createEpic = (story) => {
        axios
            .post("http://localhost:8000/api/story/", story, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
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
                                <Card.Title>Form Story</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl
                                            value={name}
                                            required
                                            type="text"
                                            id="title"
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="description" titulo="Description" />
                                        <FormControl
                                            value={description}
                                            required
                                            type="text"
                                            id="description"
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="story_points" titulo="Story Points" />
                                        <FormControl
                                            value={story_points}
                                            required
                                            type="text"
                                            id="story_points"
                                            onChange={(e) => {
                                                setStoryPoints(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label htmlFor="project_id">Project</Form.Label>
                                        <Form.Select
                                            id="project_id"
                                            value={project_id}
                                            onChange={(e) => {
                                                setProjectId(e.target.value);
                                                const selectedProject = projects.find((project) => project.project.id === parseInt(e.target.value));
                                                if (selectedProject) {
                                                    const projectStates = selectedProject.project.states;
                                                    const defaultStateId = projectStates.length > 0 ? projectStates[0].id : "";
                                                    setProjectStates(projectStates);
                                                    setStateId(defaultStateId);
                                                    setSelectedProjectEpics(selectedProject.project.epics);
                                                    setEpicId("");
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Select a project</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.project.id}>
                                                    {project.project.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <Form.Label htmlFor="epic_id">Epic</Form.Label>
                                        <Form.Select
                                            id="epic_id"
                                            value={epic_id}
                                            onChange={(e) => {
                                                setEpicId(e.target.value);
                                            }}
                                            required
                                        >
                                            <option value="">Select an epic</option>
                                            {selectedProjectEpics.map((epic) => (
                                                <option key={epic.id} value={epic.id}>
                                                    {epic.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="state_id" titulo="State" />
                                        <FormControl
                                            value={state_id}
                                            required
                                            as="select"
                                            id="state_id"
                                            onChange={(e) => {
                                                setStateId(e.target.value);
                                            }}
                                        >
                                            {projectStates.map((state) => (
                                                <option key={state.id} value={state.id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </FormControl>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default StoryForm;