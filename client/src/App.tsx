import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import Home from './features/Home';
import Journey from './features/Journey';
import NewJourney from './features/Journey/NewJourney';
import SingleJourney from './features/Journey/SingleJourney';
import Station from './features/Station';
import SingleStation from './features/Station/SingleStation';
import 'react-toastify/dist/ReactToastify.css';
import NewStation from './features/Station/NewStation';
import Page404 from './components/Layout/Page404';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="station">
            <Route index element={<Station />} />
            <Route path="new" element={<NewStation />} />
            <Route path=":stationId" element={<SingleStation />} />
          </Route>

          <Route path="journey">
            <Route index element={<Journey />} />
            <Route path="new" element={<NewJourney />} />
            <Route path=":journeyId" element={<SingleJourney />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
