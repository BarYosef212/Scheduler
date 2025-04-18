import './App.css';
import Main from './components/Main/Main';
import { ScheduleProvider } from './components/Schedule/context/ScheduleContext';
import { AdminProvider } from './components/Admin/context/AdminContext';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import AdminControl from './components/Admin/AdminControl';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MultiForm from './components/Schedule/MultiForm';
import { GlobalProvider } from './components/GlobalContext/GlobalContext';


function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route
            path='/:userId'
            element={
              <GlobalProvider>
                <Main />
              </GlobalProvider>
            }
          />
          <Route path='/Login/:userId' element={<Login />} />
          <Route
            path='/admin/:userId'
            element={
              <GlobalProvider>
                <ProtectedRoute>
                  <AdminProvider>
                    <AdminControl />
                  </AdminProvider>
                </ProtectedRoute>
              </GlobalProvider>
            }
          />
          <Route
            path='/Schedule/:userId'
            element={
              <GlobalProvider>
                <ScheduleProvider>
                  <MultiForm />
                </ScheduleProvider>
              </GlobalProvider>
            }
          />
          <Route path='*' element={<p>404! There is nothing here!</p>} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
