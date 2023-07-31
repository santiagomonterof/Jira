import React, { useState } from 'react';
import '../../index.css';
import { Container, Row, Col } from 'react-bootstrap';
import NavMenu from '../../components/NavMenu';
import ProjectCreate from './ProjectCreate';
import CurrentSprint from '../panels/CurrentSprint';
import Backlog from '../panels/BackLog';
import EpicList from '../panels/EpicList';
import SprintPlanning from '../panels/SprintPlanning';
import Search from '../panels/SearchElement';


const ProjectHome = () => {
    const [currentComponent, setCurrentComponent] = useState('projectCreate');

    const changeComponent = (componentName) => {
        setCurrentComponent(componentName);
    };

    return (
        <div className="App">
            <header>
                {/* Barra de navegación */}
                <NavMenu changeComponent={changeComponent} />
            </header>
            <div className="content">
                <Container fluid>
                    <Row>
                        {/* Barra lateral */}
                        <Col sm={3} md={2} className="sidebar">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <button
                                        className="nav-link text-white"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => changeComponent('currentSprint')}
                                    >
                                        Current Sprint
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link text-white"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => changeComponent('backlog')}
                                    >
                                        Backlog
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link text-white"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => changeComponent('epicList')}
                                    >
                                        Epic List
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link text-white"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => changeComponent('sprintPlanning')}
                                    >
                                        Sprint Planning
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link text-white" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => changeComponent('search')}
                                    >
                                        Search
                                    </button>
                                </li>
                                

                            </ul>
                        </Col>
                        {/* Espacio central */}
                        <Col sm={9} md={10} className="main">
                            {currentComponent === 'projectCreate' && <ProjectCreate />}
                            {currentComponent === 'currentSprint' && <CurrentSprint />}
                            {currentComponent === 'backlog' && <Backlog />}
                            {currentComponent === 'epicList' && <EpicList />}
                            {currentComponent === 'sprintPlanning' && <SprintPlanning />}
                            {currentComponent === 'search' && <Search />}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default ProjectHome;