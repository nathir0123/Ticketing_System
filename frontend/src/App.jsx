import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = () => <div className="P-8 text-2xl font-bold">Welcome to the Dashboard! </div>

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />
        <Route path="/" element={<Login />}/>
      </Routes>
    </Router>  
  );
}

export default App;
