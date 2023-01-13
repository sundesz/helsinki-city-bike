import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  document.title = 'HSL Bike app';

  return (
    <Container>
      <Header />
      <main className="my-2 viewport-height-50">
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
};

export default Layout;
