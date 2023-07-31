import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import { Button, Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ProjectForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [owner, setOwner] = useState('');

    useEffect(() => {
        if (!id) {
            setOwner(localStorage.getItem("idUser"));
            return;
        }
        fetchBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchBoard = () => {
        axios.get("http://localhost:8000/api/project/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const board = response.data;
            setName(board.name);
            setCode(board.code);
        }).catch((error) => {
            console.log(error);
        });
    }

    const sendData = (e) => {
        e.preventDefault();
        const board = {
            name,
            code,
        };
        if (id) {
            updateBoard(board);
        } else {
            createBoard(board);
        }
    }
    const updateBoard = (board) => {
        axios.put("http://localhost:8000/api/project/" + id, board, {
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

    const createBoard = (board) => {
        axios
            .post("http://localhost:8000/api/project", board, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const projectId = response.data.id;
                console.log(projectId);
                return axios.post(
                    "http://localhost:8000/api/userProject",
                    {
                        user_id: owner,
                        project_id: projectId,
                        is_admin: 1,
                    },
                    {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
            })
            .then((response) => {

                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            <Container >
                <Row className="mt-3">
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Form Project</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="name" titulo="Name" />
                                        <FormControl value={name} required type="text" id="name" onChange={(e) => {
                                            setName(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="code" titulo="Code" />
                                        <FormControl value={code} required type="text" id="code" onChange={(e) => {
                                            setCode(e.target.value);
                                        }} />
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

export default ProjectForm;