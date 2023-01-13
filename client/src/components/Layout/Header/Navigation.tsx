import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar className="bg-light-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Helsinki City Bike
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" href="#home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/station" href="#station">
              Station
            </Nav.Link>
            <Nav.Link as={Link} to="/journey" href="#journey">
              Journey
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
