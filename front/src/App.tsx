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
    <Router>
      <Routes>
        <Route
          path='/:userId'
          element={
            <GlobalProvider>
              <Main />
            </GlobalProvider>
          }
        />
        <Route
          path='/login/:userId'
          element={
            <GlobalProvider>
              <Login />
            </GlobalProvider>
          }
        />
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
          path='/schedule/:userId'
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
    </Router>
  );
}
export default App;
