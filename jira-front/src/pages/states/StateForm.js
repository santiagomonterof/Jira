import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const StateForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [is_finalized, setFinalized] = useState(0);
    const [project_id, setProjectId] = useState('');
    const [, setOrder] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjectList();
        if (!id) {
            return;
        }
        fetchState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchState = () => {
        axios.get("http://localhost:8000/api/state/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const state = response.data;
            setName(state.name);
            setFinalized(state.is_finalized);
            setProjectId(state.project_id);
            setOrder(state.order);
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchProjectList = () => {
        axios.get("http://localhost:8000/api/projectsByUserId/" + localStorage.getItem("idUser"), {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                setProjects(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    const sendData = (e) => {
        e.preventDefault();
        const state = {
            name,
            project_id,
            is_finalized,
        };
        if (id) {
            updateState(state);
        } else {
            createState(state);
        }
    }
    const updateState = (state) => {
        axios.put("http://localhost:8000/api/state/" + id, state, {
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
    const createState = (state) => {
        axios.post("http://localhost:8000/api/state", state, {
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
                                <Card.Title>Form State</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl value={name} required type="text" id="title" onChange={(e) => {
                                            setName(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <Form.Label htmlFor="project_id">Project</Form.Label>
                                        <Form.Select id="project_id" value={project_id} onChange={(e) => setProjectId(e.target.value)} required>
                                            <option value="">Select a project</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.project.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    {id != null && (
                                        <div>
                                            <FormTextLabel inputId="is_finalized" titulo="Is Finalized?" />
                                            <FormControl as="select" value={is_finalized} required id="is_finalized" onChange={(e) => {
                                                setFinalized(e.target.value);
                                            }}>
                                                <option value={1}>Yes</option>
                                                <option value={0}>No</option>
                                            </FormControl>
                                        </div>
                                    )}
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

export default StateForm;