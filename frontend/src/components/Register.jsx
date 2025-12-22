import { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios'; 
import { jwtDecode } from 'jwt-decode';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();
    useEffect(() =>{
            const token = localStorage.getItem('access_token');
            if(token){
              try{
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if(decoded.exp > currentTime){
                navigate('/dashboard', {replace:true});
                }else
                  localStorage.clear();
            }catch(err){
              console.error("Token Decode Error:", err);
              localStorage.clear();
            }
            }
        }, [navigate]);

    const handleChange = (e) => {
        // Clear errors when the user starts typing again
        if (error) setError(''); 
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        
        try {
            // 1. Ensure the endpoint matches your backend (check if it needs a leading slash)
            const response = await api.post('/auth/register/', formData);
            
            // 2. Success check (Axios throws on 4xx/5xx, so if we're here, it worked)
            console.log("Registration Successful:", response.data);
            
            // 3. Redirection: Ensure '/login' is defined in your App.js/main.js routes
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err);
            
            // 4. Improved Error Handling: 
            // Checks for backend validation messages or fallback to generic message
            const serverMessage = err.response?.data?.message || 
                                  err.response?.data?.username?.[0] || 
                                  'Registration failed. Please try again.';
            setError(serverMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            name="username"
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={handleChange}
                            value={formData.username} // Added controlled component value
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={handleChange}
                            value={formData.email}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={handleChange}
                            value={formData.password}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading} // Prevent double-clicking
                        className={`w-full font-bold py-2 px-4 rounded-lg transition duration-300 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;