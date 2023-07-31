import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const SprintForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [status, setStatus] = useState(0);
    const [project_id, setProjectId] = useState('');
    const [, setOrder] = useState('');
       const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjectList();
        if (!id) {
            return;
        }
        fetchSprint();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchSprint = () => {
        axios.get("http://localhost:8000/api/sprint/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const state = response.data;
            setStartDate(state.start_date);
            setEndDate(state.end_date);
            setStatus(state.status);
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
        const sprint = {
            start_date,
            end_date,
            project_id,
            status,
        };
        if (id) {
            updateState(sprint);
        } else {
            createState(sprint);
        }
    }
    const updateState = (sprint) => {
        axios.put("http://localhost:8000/api/sprint/" + id, sprint, {
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
    const createState = (sprint) => {
        axios.post("http://localhost:8000/api/sprint", sprint, {
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
                                        <FormTextLabel inputId="start_date" titulo="Start Date" />
                                        <FormControl value={start_date} required type="date" id="start_date" onChange={(e) => {
                                            setStartDate(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="end_date" titulo="End Date" />
                                        <FormControl value={end_date} required type="date" id="end_date" onChange={(e) => {
                                            setEndDate(e.target.value);
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
                                            <FormTextLabel inputId="status" titulo="Status" />
                                            <FormControl as="select" value={status} required id="status" onChange={(e) => {
                                                setStatus(e.target.value);
                                            }}>
                                                <option value={0}>Close</option>
                                                <option value={1}>Open</option>
                                                <option value={2}>Pending</option>
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

export default SprintForm;