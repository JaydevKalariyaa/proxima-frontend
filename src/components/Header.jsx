import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../store/slices/authSlice';

import { toast } from 'react-toastify';
import Logo from "../assets/logo.png"
const Header = ({ showProfile = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
   
      // Always clear local state and redirect
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
   
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{
        backgroundColor: '#222222',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: '0px',
        
        
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between',height: isMobile ? "64px" : "72px", padding:"8px 24px" }}>
        {/* Logo Section */}
        <Box >
          
            <img 
              src={Logo}
              alt="Logo" 
              style={{height:isMobile ? "40px" : "46px"}}
              // style={{ height: 32, marginRight: 8 }} 
            />
           
        
        </Box>

        {/* Profile Section */}
        {showProfile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 500 
                }}
              >
                {user?.username}
              </Typography>
            )}
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{ p: 0.5 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  width: 40,
                  height: 40
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
