import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector(x => x.auth);
    const navigate = useNavigate();
    
    if (!token && window.location.pathname !== '/login') {
        // not logged in so redirect to login page with the return url
        navigate('/login')
    }

    // authorized so return child components
    return children;
}

export { PrivateRoute };