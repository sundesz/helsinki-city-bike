import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="home-title">Welcome to Helsinki City Bike App</div>
      <div className="text-center mb-5">
        <ListGroup>
          <ListGroup.Item>
            <Link to={'/journey'}>See all Journey</Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to={'/journey/new'}>Create new journey</Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to={'/station'}>See all Station</Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to={'/station/new'}>Create new station</Link>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </>
  );
};

export default Home;
