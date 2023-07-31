import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const NavMenu = ({ changeComponent }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("idUser");
        navigate("/");
    }
    return (<Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand href="#home">Jira</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {token ? (
                        <>
                            <NavDropdown title="Project" id="basic-nav-dropdown">
                                <NavLink
                                    className="dropdown-item"
                                    to="/project/home"
                                    onClick={() => changeComponent('projectCreate')}
                                >
                                    Projects Status
                                </NavLink>
                            </NavDropdown>
                            <NavDropdown title="Epic" id="basic-nav-dropdown">
                                <NavLink
                                    className="dropdown-item"
                                    to="/epic/create"
                                >
                                    Create Epic
                                </NavLink>
                            </NavDropdown>
                            <NavDropdown title="User Stories" id="basic-nav-dropdown">
                                <NavLink
                                    className="dropdown-item"
                                    to="/story/create"
                                >
                                    Create User Stories
                                </NavLink>
                            </NavDropdown>
                            <NavDropdown title="Task" id="basic-nav-dropdown">
                                <NavLink
                                    className="dropdown-item"
                                    to="/task/create"
                                >
                                    Create Task
                                </NavLink>
                            </NavDropdown>
                            <button
                                onClick={cerrarSesion}
                                className="nav-link btn btn-link cerrarSesionLink"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink className="nav-link" to="/" onClick={() => changeComponent('')}>
                                Iniciar Sesión
                            </NavLink>
                            <NavLink className="nav-link" to="/register" onClick={() => changeComponent('')}>
                                Register
                            </NavLink>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}

export default NavMenu;