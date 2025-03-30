import './App.css';
import Main from './components/Main/Main';
import { ScheduleProvider } from './components/Schedule/context/ScheduleContext';
import { AdminProvider } from './components/Admin/context/AdminContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminControl from './components/Admin/AdminControl';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MultiForm from './components/Schedule/MultiForm';
import { GlobalProvider } from './components/GlobalContext/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/Login' element={<Login />} />
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminControl />
                </AdminProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path='/Schedule'
            element={
              <ScheduleProvider>
                <MultiForm />
              </ScheduleProvider>
            }
          />
          <Route path='*' element={<p>404! There is nothing here!</p>} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
