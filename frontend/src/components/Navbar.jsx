import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import {
  Translate as TranslateIcon,
  AccountCircle as UserIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import RsrpLogo from './RsrpLogo';

// Custom logo representing rural areas, mapping and connectivity
export default function Navbar({ lang, toggleLanguage, t, token, setToken, username, setUsername, role, setRole, setSpecialization, setAuthModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    setAdminToken(localStorage.getItem('adminToken'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('citizenToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('citizenUsername');
    localStorage.removeItem('citizenUserId');
    localStorage.removeItem('citizenRole');
    localStorage.removeItem('citizenSpecialization');
    setToken('');
    setUsername('');
    if (setRole) setRole('CITIZEN');
    if (setSpecialization) setSpecialization('');
    navigate('/login');
  };

  // Nav menu links mapping to routes
  const menuItems = [
    { label: t.home, path: '/' },
    { label: t.services, path: '/services' },
    { label: t.howItWorks, path: '/how-it-works' },
    { label: t.about, path: '/about' },
    { label: t.reviews, path: '/reviews' },
    { label: t.contact, path: '/contact' }
  ];

  if (token && role === 'STAFF') {
    menuItems.push({ label: t.staffPortal || 'Staff Dashboard', path: '/staff' });
  }
  if (token && role === 'ADMIN') {
    menuItems.push({ label: t.admin || 'Admin Portal', path: '/admin' });
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid rgba(2, 84, 70, 0.08)',
        backdropFilter: 'blur(12px)',
        py: 0.5,
        boxShadow: '0 4px 18px rgba(2, 84, 70, 0.03)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo capsule pill */}
          <Box
            onClick={() => navigate(role === 'STAFF' ? '/staff' : role === 'ADMIN' ? '/admin' : '/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#ffffff',
              border: '1.5px solid rgba(2, 84, 70, 0.1)',
              borderRadius: '50px',
              py: 0.7,
              px: 2.2,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(2, 84, 70, 0.06)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <RsrpLogo />
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Poppins", "Segoe UI", sans-serif',
                fontWeight: 500,
                color: 'primary.main',
                fontSize: '1.5rem',
                letterSpacing: -0.1,
                lineHeight: 1,
                textAlign: 'center'
              }}
            >
              {t.title}
            </Typography>
          </Box>

          {/* Desktop Navigation Routing Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: lang === 'te' ? { md: 1, lg: 1.8 } : { md: 2, lg: 3.5 } }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: 600,
                    fontSize: lang === 'te' ? '0.85rem' : '0.95rem',
                    px: 0.5,
                    py: 0.5,
                    minWidth: 'auto',
                    background: 'none',
                    borderRadius: 0,
                    borderBottom: '2px solid',
                    borderColor: isActive ? 'primary.main' : 'transparent',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      background: 'none',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* User actions on right */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Lang switcher */}
            <IconButton
              onClick={toggleLanguage}
              color="primary"
              sx={{
                border: '1.5px solid rgba(2, 84, 70, 0.1)',
                borderRadius: '50px',
                px: 1.5,
                py: 0.7,
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              <TranslateIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold', fontSize: '0.75rem' }}>
                {lang === 'en' ? 'తె' : 'EN'}
              </Typography>
            </IconButton>

            {/* Desktop Auth Actions */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {token ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.7,
                      px: 2,
                      py: 0.8,
                      bgcolor: 'primary.light',
                      borderRadius: 50,
                      color: 'primary.main',
                      border: '1px solid rgba(2, 84, 70, 0.1)'
                    }}
                  >
                    <UserIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {username} ({role})
                    </Typography>
                  </Box>
                  <Button
                    onClick={handleLogout}
                    color="error"
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    sx={{ borderRadius: 50 }}
                  >
                    {t.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: 50,
                      px: lang === 'te' ? { md: 1.5, lg: 2.2 } : { md: 2.5, lg: 3.2 },
                      py: 0.8,
                      bgcolor: '#ffffff',
                      borderColor: 'rgba(2, 84, 70, 0.2)',
                      color: 'text.primary',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light'
                      }
                    }}
                  >
                    {t.loginBtn}
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 50,
                      px: lang === 'te' ? { md: 1.5, lg: 2.2 } : { md: 2.5, lg: 3.2 },
                      py: 0.9,
                      bgcolor: 'primary.main',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    {t.registerBtn}
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile menu trigger */}
            <IconButton
              color="primary"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, border: '1.5px solid rgba(2, 84, 70, 0.1)', borderRadius: '50px' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 2, bgcolor: 'background.default' }
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 2, px: 2, color: 'primary.main' }}>
          {t.ruralMenu}
        </Typography>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary'
                  }}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ p: 2, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {token ? (
            <>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                {t.loggedInAs || 'Logged in as'} <strong>{username}</strong> ({role})
              </Typography>
              <Button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<LogoutIcon />}
                sx={{ borderRadius: 50 }}
              >
                {t.logout}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                fullWidth
                variant="outlined"
                sx={{ borderRadius: 50 }}
              >
                {t.loginBtn}
              </Button>
              <Button
                onClick={() => { navigate('/register'); setMobileOpen(false); }}
                fullWidth
                variant="contained"
                sx={{ borderRadius: 50 }}
              >
                {t.registerBtn}
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
