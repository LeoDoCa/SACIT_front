import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FaUser, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
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
        <div className="sidebar-header">
          <div className="user-avatar">
            <FaUser size={50} />
          </div>
          {isLoggedIn ? (
            <div className="user-info">
              <h3>Nombre del Usuario</h3>
              <p>correo@example.com</p>
            </div>
          ) : (
            <div className="register-button">
              <div className="register-text">
                <p>¿No tienes cuenta?</p>
              </div>
            </div>
          )}
          
          <Button 
            variant="link" 
            onClick={toggleSidebar} 
            className="close-btn d-none d-md-block"
          >
            <FaTimes size={20} />
          </Button>
        </div>
        
        <Nav className="flex-column sidebar-nav">
            {isLoggedIn ? (
                <>
                <Nav.Link href="#" className="sidebar-item">
                    <FaHistory className="icon" /> Historial de Trámites
                </Nav.Link>
                <Nav.Link href="#" className="sidebar-item mt-auto">
                    <FaSignOutAlt className="icon" /> Cerrar sesión
                </Nav.Link>
                </>
            ) : (
                <>
                <Nav.Link href="#" className="sidebar-item">
                    <FaUserPlus className="register-icon" />
                    Registrarse
                </Nav.Link>
                <Nav.Link href="/login" className="sidebar-item mt-auto">
                    <FaSignOutAlt className="icon" /> Iniciar sesión
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
      
      <style jsx>{`
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
          top: 20px;
          right: 20px;
          color: white;
          font-size: 1.5rem;
        }
        
      `}</style>
    </>
  );
};

export default Sidebar;
