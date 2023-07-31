import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NavMenu from '../../components/NavMenu';
import { Button, Card, Col, Container, FormControl, Row } from 'react-bootstrap';
import FormTextLabel from '../../components/FormTextLabel';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [full_name, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const senData = (e) => {
        e.preventDefault();
        const user = {
            full_name,
            email,
            password
        };
        axios.post("http://localhost:8000/api/register", user)
            .then((response) => {
                navigate("/");
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
                                <Card.Title>Sign up</Card.Title>
                                <form onSubmit={senData}>
                                    <div>
                                        <FormTextLabel inputId="name" titulo="Name" />
                                        <FormControl value={full_name} required type="name" id="name" onChange={(e) => {
                                            setFullName(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="email" titulo="Email" />
                                        <FormControl value={email} required type="email" id="email" onChange={(e) => {
                                            setEmail(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="password" titulo="Password" />
                                        <FormControl value={password} required type="password" id="password" onChange={(e) => {
                                            setPassword(e.target.value);
                                        }} />
                                    </div>

                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">Register</Button>
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

export default Register;