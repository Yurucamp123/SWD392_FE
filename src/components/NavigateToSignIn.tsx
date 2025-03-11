import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NavigateToSignIn() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/auth/signin");
    }, [navigate]);

    return null;
}

export default NavigateToSignIn;