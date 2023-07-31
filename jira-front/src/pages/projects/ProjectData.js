/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, NavLink, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import NavMenu from '../../components/NavMenu';

const ProjectData = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [codeProject, setCodeProject] = useState('');
    const [listStates, setListStates] = useState([]);
    const [listSprints, setListSprints] = useState([]);
    const [, setCurrentComponent] = useState('projectCreate');

    const changeComponent = (componentName) => {
        setCurrentComponent(componentName);
    };

    useEffect(() => {
        fetchProject();
    }, [code]);

    const fetchProject = () => {
        axios
            .get(`http://localhost:8000/api/projectByCode/${code}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                const project = response.data;
                setName(project.name);
                setCodeProject(project.code);
                fetchListStates(project.id);
                fetchListSprints(project.id);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchListStates = (idProject) => {
        console.log(idProject);
        axios
            .get(`http://localhost:8000/api/stateByProjectId/${idProject}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log(response.data);
                setListStates(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchListSprints = (idProject) => {
        console.log(idProject);
        axios
            .get(`http://localhost:8000/api/sprintByProjectId/${idProject}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log(response.data);
                setListSprints(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const editState = (id) => {
        navigate(`/state/edit/${id}`);
    };
    const deleteState = (id) => {
        if (window.confirm('Are you sure?') === false) {
            return;
        }
        axios
            .delete(`http://localhost:8000/api/state/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const editSprint = (id) => {
        navigate(`/sprint/edit/${id}`);
    };
    const deleteSprint = (id) => {
        if (window.confirm('Are you sure?') === false) {
            return;
        }
        axios
            .delete(`http://localhost:8000/api/sprint/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const CreateState = () => {
        const handleDropdownItemClick = (route) => {
            navigate(route);
        };

        return (
            <Container className="mt-4 text-center">
                <Dropdown >
                    <Dropdown.Toggle as={Button} variant="secondary">
                        State
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => handleDropdownItemClick('/state/create')}
                            as={NavLink}
                            className='text-center'
                        >
                            Create State
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        );
    };
    const CreateSprint = () => {
        const handleDropdownItemClick = (route) => {
            navigate(route);
        };

        return (
            <Container className="mt-4 text-center">
                <Dropdown>
                    <Dropdown.Toggle as={Button} variant="secondary">
                        Sprint
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDropdownItemClick('/sprint/create')} as={NavLink} className='text-center'>
                            Create Sprint
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        );
    };

    return (
        <>
            <NavMenu changeComponent={changeComponent} />
            <Container>
                <Row
                    className="mt-3"
                    style={{
                        backgroundColor: '#1E1E1E',
                        color: '#FFFFFF',
                        padding: '20px',
                        borderRadius: '8px',
                    }}
                >
                    <Col className="d-flex justify-content-center align-items-center">
                        <Card
                            className="text-center"
                            style={{
                                backgroundColor: '#333333',
                                borderRadius: '10px',
                                padding: '30px',
                                width: '80%',
                            }}
                        >
                            <Card.Title
                                style={{ fontSize: '32px', marginBottom: '30px', color: '#FFFFFF' }}
                            >
                                Project Data
                            </Card.Title>
                            <div
                                style={{
                                    backgroundColor: '#444444',
                                    borderRadius: '8px',
                                    padding: '30px',
                                }}
                            >
                                <h2
                                    style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}
                                >
                                    Name: {name}
                                </h2>
                                <h2 style={{ fontSize: '24px', color: 'white' }}>Code: {codeProject}</h2>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Container className="mt-4 d-flex">
                    <CreateState />
                    <CreateSprint />
                </Container>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>List of States</Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Finalized</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listStates.map((state) => {
                                            return (
                                                <tr key={state.id}>
                                                    <td>{state.id}</td>
                                                    <td>{state.name}</td>
                                                    <td style={{ color: state.is_finalized === 1 ? 'green' : 'red' }}>
                                                        {state.is_finalized === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                editState(state.id);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => {
                                                                deleteState(state.id);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>List of Sprints</Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Order</th>
                                            <th>Status</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSprints.map((sprint) => {
                                            return (
                                                <tr key={sprint.id}>
                                                    <td>{sprint.id}</td>
                                                    <td>{sprint.start_date}</td>
                                                    <td>{sprint.end_date}</td>
                                                    <td>{sprint.order}</td>
                                                    <td style={{ color: sprint.status === 1 ? 'green' : sprint.status === 2 ? 'blue' : 'red' }}>
                                                        {sprint.status === 1 ? 'Open' : sprint.status === 2 ? 'Pending' : 'Closed'}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                editSprint(sprint.id);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => {
                                                                deleteSprint(sprint.id);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProjectData;