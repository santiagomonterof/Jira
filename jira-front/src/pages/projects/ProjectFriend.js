import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ProjectFriend = () => {
    const navigate = useNavigate();
    const { code } = useParams();

    const [user_id, setUserId] = useState('');
    const [project_id, setProjectId] = useState('');
    const [admin, setAdmin] = useState(0);
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!code) {
            return;
        }
        getUserList();
        getProjectByCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])


    const getUserList = () => {
        axios.get("http://localhost:8000/api/getUserList", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setUsers(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }



    const getProjectByCode = () => {
        axios.get("http://localhost:8000/api/projectByCode/" + code, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setProjectId(response.data.id);
        }).catch((error) => {
            console.log(error);
        });
    }


    const sendData = (e) => {
        e.preventDefault();
        const project = {
            user_id,
            project_id,
            is_owner: 0,
            is_admin: admin,
        };
        addProjectFriend(project);
    }

    const addProjectFriend = (project) => {
        axios.post("http://localhost:8000/api/userProject/", project, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                navigate("/project/home");
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
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
                                <Card.Title>Add Friend</Card.Title>
                                <form onSubmit={sendData}>
                                    {errorMessage && <Card>{errorMessage}</Card>}
                                    <div>
                                        <Form.Label htmlFor="user_id">Friend You Want To Add</Form.Label>
                                        <Form.Select id="user_id" value={user_id} onChange={(e) => setUserId(e.target.value)} required>
                                            <option value="">Select a user</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.full_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="admin" titulo="Add Admin" />
                                        <FormControl as="select" value={admin} required id="admin" onChange={(e) => {
                                            setAdmin(e.target.value);
                                        }}>
                                            <option value={1}>Sí</option>
                                            <option value={0}>No</option>
                                        </FormControl>
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

export default ProjectFriend;