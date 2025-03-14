import './App.css';
import Main from './components/Main/Main';
import Schedule from './components/Schedule/Schedule';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/Schedule' element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;
