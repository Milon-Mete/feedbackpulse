import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './page/WelcomePage';
import Dashboard from './page/DashboardPage';
import Admindashboard from './page/Admindashboardpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/DashboardPage" element={<Dashboard />} />
        <Route path="/Admindashboardpage" element={<Admindashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
