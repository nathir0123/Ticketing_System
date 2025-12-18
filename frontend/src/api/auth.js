import api from './axios'

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('auth/login/', { username , password});
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
    }catch(error){
        throw error.response.data;

    }
};