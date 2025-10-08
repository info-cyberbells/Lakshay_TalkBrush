import {React, useEffect

} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout, verify } from '../features/userSlice';

const dashboard = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useEffect(() => {
    //   dispatch(verify());
    // }, [])

    useEffect(() => {
    const verifyUser = async () => {
      const result = await dispatch(verify());
      // If verification fails, redirect to login
      if (verify.rejected.match(result)) {
        navigate('/');
      }
    };
    verifyUser();
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };
    

    const handleClick = () => {
        dispatch(logout());
        navigate('/');
    }
  
    return (
    <div>
        <button onClick={handleClick}>logout</button>
    </div>
  )
}

export default dashboard