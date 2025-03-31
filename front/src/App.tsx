import './App.css';
import Main from './components/Main/Main';
import { ScheduleProvider } from './components/Schedule/context/ScheduleContext';
import { AdminProvider } from './components/Admin/context/AdminContext';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import AdminControl from './components/Admin/AdminControl';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MultiForm from './components/Schedule/MultiForm';
import {
  GlobalProvider,
  useValuesGlobal,
} from './components/GlobalContext/GlobalContext';

function App() {
  return (
    <Router>
      {/* change to AuthProvider */}
      <GlobalProvider>
        <Routes>
          <Route path='/:userId' element={<Main />} />
          <Route path='/Login/:userId' element={<Login />} />
          <Route
            path='/admin/:userId'
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminControl />
                </AdminProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path='/Schedule/:userId'
            element={
              <ScheduleProvider>
                <MultiForm />
              </ScheduleProvider>
            }
          />
          <Route path='*' element={<p>404! There is nothing here!</p>} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
