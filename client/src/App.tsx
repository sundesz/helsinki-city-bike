import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './features/Home';
import JourneyList from './features/Journey/JourneyList';
import StationList from './features/Station/StationList';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/journey" element={<JourneyList />} />
          <Route path="/station" element={<StationList />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
