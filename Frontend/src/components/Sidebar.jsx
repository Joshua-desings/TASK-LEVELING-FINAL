import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { animated, useSpring } from 'react-spring';
import { ListItem, ListItemIcon, ListItemText, List, Divider } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarAnimation = useSpring({
    width: isOpen ? '200px' : '64px',
    from: { width: '64px' },
  });

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Mejorar la gestión de errores aquí
    }
  };

  const sidebarItems = [
    { to: '/dashboard', text: 'Dashboard' },
    { to: '/profile', text: 'Profile' }
  ];

  return (
    <animated.div className="flex flex-col h-full bg-gray-800 text-white" style={sidebarAnimation}>
      {/* Barra superior */}
      <div className="p-4 flex items-center cursor-pointer" onClick={toggleSidebar}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="large" />
        </ListItemIcon>
        {isOpen && <ListItemText primary="Username" />}
      </div>
      <Divider />
      {/* Sección de menú */}
      <List>
        {isOpen && sidebarItems.map((item, index) => (
          <Link to={item.to} key={index} className="text-white">
            <ListItem button>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      {/* Botón de logout */}
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </animated.div>
  );
};

export default Sidebar;
