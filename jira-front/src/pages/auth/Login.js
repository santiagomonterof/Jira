import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NavMenu from '../../components/NavMenu';
import { Button, Card, Col, Container, FormControl, Row } from 'react-bootstrap';
import FormTextLabel from '../../components/FormTextLabel';
import axios from 'axios';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const sendData = (e) => {
        e.preventDefault();
        const usuario = {
            email,
            password
        };
        axios.post("http://localhost:8000/api/login", usuario)
            .then((response) => {
                const token = response.data.access_token;
                localStorage.setItem("token", token);
                axios.get("http://localhost:8000/api/me", {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                })
                    .then((response) => {
                        const idUser = response.data.id;
                        localStorage.setItem("idUser", idUser);
                        navigate("/project/home");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3">
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Login</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="email" titulo="Email" />
                                        <FormControl value={email}  type="email" id="email" onChange={(e) => {
                                            setEmail(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="password" titulo="Password" />
                                        <FormControl value={password}  type="password" id="password" onChange={(e) => {
                                            setPassword(e.target.value);
                                        }} />
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">Sign In</Button>
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

export default Login;