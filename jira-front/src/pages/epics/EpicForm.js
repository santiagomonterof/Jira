import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EpicForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [state_id, setStateId] = useState("");
    const [project_id, setProjectId] = useState("");
    const [projects, setProjectList] = useState([]);
    const [projectStates, setProjectStates] = useState([]);

    useEffect(() => {
        fetchProjectList();
        if (!id) {
            return;
        }
        fetchEpic();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchEpic = () => {
        axios
            .get("http://localhost:8000/api/epic/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const epic = response.data;
                setName(epic.name);
                setDescription(epic.order);
                setStateId(epic.state_id);
                setProjectId(epic.project_id);
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
                console.log(response.data);
                setProjectList(response.data);
                if (response.data.length > 0) {
                    const selectedProject = response.data[0].project;
                    setProjectId(selectedProject.id);
                    setStateId(selectedProject.states[0].id);
                    setProjectStates(selectedProject.states);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const sendData = (e) => {
        e.preventDefault();
        const epic = {
            name,
            description,
            state_id,
            project_id,
        };
        if (id) {
            updateEpic(epic);
        } else {
            createEpic(epic);
        }
    };

    const updateEpic = (epic) => {
        axios
            .put("http://localhost:8000/api/epic/" + id, epic, {
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

    const createEpic = (epic) => {
        axios
            .post("http://localhost:8000/api/epic/", epic, {
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
                                <Card.Title>Form Epic</Card.Title>
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
                                        <Form.Label htmlFor="project_id">Project</Form.Label>
                                        <Form.Select
                                            id="project_id"
                                            value={project_id}
                                            onChange={(e) => {
                                                setProjectId(e.target.value);
                                                const selectedProject = projects.find(
                                                    (project) => project.project.id === parseInt(e.target.value)
                                                );
                                                if (selectedProject && selectedProject.project.states.length > 0) {
                                                    setProjectStates(selectedProject.project.states);
                                                    setStateId(selectedProject.project.states[0].id);
                                                } else {
                                                    setProjectStates([]);
                                                    setStateId("");
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

export default EpicForm;