import { Container } from 'react-bootstrap';
import Footer from './Footer';
import Header from './Header';

interface ILayoutProps {
  children: JSX.Element;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <Container>
      <Header />
      <main className="my-2 viewport-height-50">{children}</main>
      <Footer />
    </Container>
  );
};

export default Layout;
