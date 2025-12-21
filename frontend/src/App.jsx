import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import SupportChat from './components/Supportchat';


function App() {
  

  return (
    <Router>
         <SupportChat/> 
          <Routes>
   
        <Route path ="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />
        <Route path="/" element={<Login/>}/>
      </Routes>
    </Router>  
  );
}

export default App;
