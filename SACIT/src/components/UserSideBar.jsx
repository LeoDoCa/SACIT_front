import React, { useState, useContext, useEffect } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom"
import { FaUser, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../config/context/auth-context';
import { logout } from '../config/http-client/authService';
import { handleLogout } from '../utils/logoutHelper';

const UserSideBar = () => {
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserData({
            name: user.name + " " + user.lastName || 'Usuario',
            email: user.email || 'correo@example.com',
            role: user.role || 'ROLE_USER' 
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    }
  }, [isLoggedIn]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button 
        variant="dark" 
        onClick={toggleSidebar} 
        className="position-fixed top-0 start-0 m-2 z-3 d-block"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </Button>
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header mt-0">
          <Button 
            variant="link" 
            onClick={toggleSidebar} 
            className="close-btn d-none d-md-block"
          >
            <FaTimes size={20} />
          </Button>
          <div className="user-avatar mt-4 mb-0">
            <FaUser size={40} />
          </div>
          {isLoggedIn ? (
            <div className="user-info mt-2">
              <h3>{userData.name}</h3>
              <p>{userData.email}</p>
            </div>
          ) : (
            <div className="register-button">
              <div className="register-text">
                <p>¿No tienes cuenta?</p>
              </div>
            </div>
          )}
        </div>
        
        <Nav className="flex-column sidebar-nav">
        {isLoggedIn ? (
                <>
                {userData.role === 'ROLE_USER' && (
                    <Nav.Link as={Link} to="/history" className="sidebar-item">
                        <FaHistory className="icon" /> Historial de Trámites
                    </Nav.Link>
                )}
                <Nav.Link className="sidebar-item mt-auto" onClick={() => handleLogout(logout, dispatch, navigate)}>
                    <FaSignOutAlt className="icon" /> Cerrar sesión
                </Nav.Link>
                </>
            ) : (
                <>
                <Nav.Link as={Link} to="/register" className="sidebar-item">
                    <FaUserPlus className="register-icon" size={25}/>
                    Registrarse
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="sidebar-item mt-auto">
                    <FaSignOutAlt className="icon" size={20} /> Iniciar sesión
                </Nav.Link>
                </>
            )}
        </Nav>
      </div>
      
      {isOpen && (
        <div 
          className="sidebar-overlay d-md-none" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background-color: #1e2a3a;
          color: white;
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar.closed {
          transform: translateX(-100%);
        }
        
        .sidebar-header {
          padding: 20px;
          text-align: center;
          background-color: #152238;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .user-avatar {
          background-color: #f1f1f1;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
          color: #1e2a3a;
        }
        
        .user-info h3 {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }
        
        .user-info p {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.8;
        }
        
        .register-button {
          display: flex;
          align-items: center;
          margin-top: 20px;
          cursor: pointer;
        }
        
        .register-icon {
          font-size: 2rem;
          margin-right: 10px;
        }
        
        .register-text p {
          margin: 0;
        }

        .register-text strong {
          font-size: 1rem;
        }

        .sidebar-nav {
          padding: 20px 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-item {
          padding: 15px 20px;
          color: white;
          display: flex;
          align-items: center;
          transition: background-color 0.2s;
        }
        
        .sidebar-item:hover, .sidebar-item:focus {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .sidebar-item .icon {
          margin-right: 10px;
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          color: white;
          font-size: 1.5rem;
          z-index: 1;
        }
        
      `}</style>
    </>
  );
};

export default UserSideBar;
