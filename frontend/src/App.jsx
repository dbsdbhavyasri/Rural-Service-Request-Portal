import React, { useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Button } from '@mui/material';

// Import Shared Configurations
import { theme } from './theme';
import { translations } from './translations';

// Import Custom Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

// Import Custom Page Views
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import StreetLight from './pages/StreetLight';
import WaterIssue from './pages/WaterIssue';
import RoadMaintenance from './pages/RoadMaintenance';
import Others from './pages/Others';
import TrackStatus from './pages/TrackStatus';
import Admin from './pages/Admin';
import Staff from './pages/Staff';

// ProtectedRoute Wrapper: Enforces login-first access
function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/landing" replace />;
  }
  return children;
}

function MainLayout({
  lang,
  toggleLanguage,
  t,
  token,
  setToken,
  username,
  setUsername,
  role,
  setRole,
  setSpecialization,
  authModal,
  setAuthModal
}) {
  const location = useLocation();

  // Hide Navbar only on Landing page
  const isLandingPage =
    location.pathname === '/landing' ||
    (!token && location.pathname === '/');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        isolation: 'isolate',
        bgcolor: 'background.default',
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: '-12px',
          zIndex: -2,
          backgroundImage: 'url("/background_1%20.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.03)'
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundColor: 'rgba(244, 250, 255, 0.72)'
        }
      }}
    >
      {/* Header Navigation bar - Hidden on Landing page */}
      {!isLandingPage && (
        <Navbar
          lang={lang}
          toggleLanguage={toggleLanguage}
          t={t}
          token={token}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
          role={role}
          setRole={setRole}
          setSpecialization={setSpecialization}
          setAuthModal={setAuthModal}
        />
      )}

      {/* Core Routes View */}
      <Box sx={{ flexGrow: 1, py: isLandingPage ? 0 : 4 }}>
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/landing"
            element={
              token ? (
                role === 'STAFF' ? (
                  <Navigate to="/staff" replace />
                ) : role === 'ADMIN' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              token ? (
                role === 'STAFF' ? (
                  <Navigate to="/staff" replace />
                ) : role === 'ADMIN' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login
                  setToken={setToken}
                  setUsername={setUsername}
                  setRole={setRole}
                  setSpecialization={setSpecialization}
                  t={t}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                role === 'STAFF' ? (
                  <Navigate to="/staff" replace />
                ) : role === 'ADMIN' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login
                  setToken={setToken}
                  setUsername={setUsername}
                  setRole={setRole}
                  setSpecialization={setSpecialization}
                  t={t}
                />
              )
            }
          />

          {/* Root Route: Shows LandingPage when unauthenticated, Home Dashboard when authenticated */}
          <Route
            path="/"
            element={
              token ? (
                <Home
                  lang={lang}
                  t={t}
                  token={token}
                  setToken={setToken}
                  username={username}
                  setUsername={setUsername}
                  setAuthModal={setAuthModal}
                />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/services"
            element={
              <ProtectedRoute token={token}>
                <Services t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <ProtectedRoute token={token}>
                <HowItWorks t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute token={token}>
                <About t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute token={token}>
                <Reviews t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute token={token}>
                <Contact t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute token={token}>
                <TrackStatus t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute token={token}>
                <Admin t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute token={token}>
                <Staff t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/streetlight"
            element={
              <ProtectedRoute token={token}>
                <StreetLight t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute token={token}>
                <WaterIssue t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/road"
            element={
              <ProtectedRoute token={token}>
                <RoadMaintenance t={t} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/others"
            element={
              <ProtectedRoute token={token}>
                <Others t={t} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to={token ? "/" : "/landing"} replace />} />
        </Routes>
      </Box>

      {/* Footer Bar - Hidden on Landing page */}
      {!isLandingPage && (
        <Box
          sx={{
            py: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mt: 'auto'
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              &copy; {new Date().getFullYear()} {t.title} - Team 7 Civic Initiative. Built with React & Spring Boot.
            </Typography>
            {token && role === 'ADMIN' && (
              <Button
                component={Link}
                to="/admin"
                variant="text"
                size="small"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'primary.light' }
                }}
              >
                {t.admin}
              </Button>
            )}
          </Container>
        </Box>
      )}

      {/* Global Citizen Authentication Modal */}
      <AuthModal
        open={authModal !== null}
        mode={authModal}
        onClose={() => setAuthModal(null)}
        setMode={setAuthModal}
        setToken={setToken}
        setUsername={setUsername}
        setRole={setRole}
        setSpecialization={setSpecialization}
        t={t}
      />
    </Box>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const [token, setToken] = useState(localStorage.getItem('citizenToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('citizenUsername') || '');
  const [role, setRole] = useState(localStorage.getItem('citizenRole') || 'CITIZEN');
  const [specialization, setSpecialization] = useState(localStorage.getItem('citizenSpecialization') || '');

  const [authModal, setAuthModal] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout
          lang={lang}
          toggleLanguage={toggleLanguage}
          t={t}
          token={token}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
          role={role}
          setRole={setRole}
          setSpecialization={setSpecialization}
          authModal={authModal}
          setAuthModal={setAuthModal}
        />
      </Router>
    </ThemeProvider>
  );
}
