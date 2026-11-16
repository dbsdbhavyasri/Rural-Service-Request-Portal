import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  WaterDrop as WaterIcon,
  Construction as RoadIcon,
  Help as OthersIcon,
  ExitToApp as LogoutIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import API from '../services/api';
import ActivitySection from '../components/ActivitySection';
import RsrpLogo from '../components/RsrpLogo';

export default function Home({ lang, t, token, setToken, username, setUsername, setAuthModal }) {
  const navigate = useNavigate();

  // Dashboard state
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMyComplaints();
    }
  }, [token]);

  const fetchMyComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const res = await API.get('/complaints/my');
      setMyComplaints(res.data);
    } catch (err) {
      console.error("Error fetching user complaints", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('citizenToken');
    localStorage.removeItem('citizenUsername');
    setToken('');
    setUsername('');
    setMyComplaints([]);
  };

  const getCategoryLabel = (type) => {
    if (type === 'streetlight') return t.streetlight;
    if (type === 'water') return t.water;
    if (type === 'road') return t.road;
    if (type === 'others') return t.others;
    return type;
  };

  // 1. Citizen is LOGGED IN: Render Citizen Dashboard
  if (token) {
    return (
      <Container maxWidth="lg">
        {/* User Hero Banner Section */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1D9BF0 0%, #22C55E 100%)',
          color: 'white',
          p: { xs: 4, md: 5 },
          borderRadius: 6,
          mb: 5,
          boxShadow: '0 10px 30px rgba(29, 155, 240, 0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 1 }}>
              {t.welcomeCitizen}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Logged in as: <strong>{username}</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              borderRadius: 50,
              px: 3.5,
              py: 1.2,
              fontWeight: 'bold',
              boxShadow: 'none'
            }}
          >
            {t.logout}
          </Button>
        </Box>

        <ActivitySection></ActivitySection>
        {/* Categories Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 3.5, color: 'primary.main' }}>
            {t.selectCategory}
          </Typography>
          <Grid container spacing={3.5} alignItems="stretch">
            {/* Streetlight */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(2, 84, 70, 0.08)' } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4.5 }}>
                  <Box sx={{ display: 'inline-flex', bgcolor: 'primary.light', color: 'primary.main', p: 2.2, borderRadius: '50%', mb: 2.5 }}>
                    <LightbulbIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold' }} gutterBottom>
                    {t.streetlight}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.streetlightDesc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pb: 3.5, px: 3.5 }}>
                  <Button fullWidth variant="contained" color="primary" component={Link} to="/streetlight" sx={{ borderRadius: 50 }}>
                    {t.submitComplaint}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Water */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(2, 84, 70, 0.08)' } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4.5 }}>
                  <Box sx={{ display: 'inline-flex', bgcolor: 'secondary.light', color: 'secondary.main', p: 2.2, borderRadius: '50%', mb: 2.5 }}>
                    <WaterIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold' }} gutterBottom>
                    {t.water}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.waterDesc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pb: 3.5, px: 3.5 }}>
                  <Button fullWidth variant="contained" color="secondary" component={Link} to="/water" sx={{ borderRadius: 50, color: 'white' }}>
                    {t.submitComplaint}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Road */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(2, 84, 70, 0.08)' } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4.5 }}>
                  <Box sx={{ display: 'inline-flex', bgcolor: 'warning.light', color: 'warning.main', p: 2.2, borderRadius: '50%', mb: 2.5 }}>
                    <RoadIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold' }} gutterBottom>
                    {t.road}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.roadDesc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pb: 3.5, px: 3.5 }}>
                  <Button fullWidth variant="contained" component={Link} to="/road" sx={{ borderRadius: 50, bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' }, color: 'white' }}>
                    {t.submitComplaint}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Others */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(2, 84, 70, 0.08)' } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4.5 }}>
                  <Box sx={{ display: 'inline-flex', bgcolor: 'primary.light', color: 'primary.main', p: 2.2, borderRadius: '50%', mb: 2.5 }}>
                    <OthersIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold' }} gutterBottom>
                    {t.others}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.othersDesc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pb: 3.5, px: 3.5 }}>
                  <Button fullWidth variant="contained" component={Link} to="/others" sx={{ borderRadius: 50, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white' }}>
                    {t.submitComplaint}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Active Grievances Table */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', color: 'primary.main' }}>
              {t.activeGrievances}
            </Typography>
            <Button variant="outlined" size="small" onClick={fetchMyComplaints} disabled={loadingComplaints} sx={{ borderRadius: 50 }}>
              Refresh Statuses
            </Button>
          </Box>

          {loadingComplaints ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : myComplaints.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 4, border: '1px dashed rgba(2, 84, 70, 0.2)' }}>
              <Typography color="text.secondary">{t.noCitizenComplaints}</Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, border: '1px solid rgba(2, 84, 70, 0.08)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Complaint ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{t.type}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{t.location}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{t.status}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Date Submitted</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myComplaints.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'primary.main' }}>
                        {item.complaintId}
                      </TableCell>
                      <TableCell>{getCategoryLabel(item.type)}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.6,
                          borderRadius: 50,
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: item.status === 'Resolved' ? 'success.dark' : item.status === 'In Progress' ? 'warning.dark' : 'error.dark',
                          bgcolor: item.status === 'Resolved' ? 'success.light' : item.status === 'In Progress' ? 'warning.light' : 'error.light'
                        }}>
                          {item.status === 'Resolved' ? t.resolved : item.status === 'In Progress' ? t.inProgress : t.pending}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/track?id=${item.complaintId}`)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                          {t.viewDetails}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    );
  }

  // 2. Citizen is NOT LOGGED IN: Render Entry Portal Landing
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <Box
        id="hero"
        sx={{
          background: 'linear-gradient(180deg, rgba(230, 239, 236, 0.4) 0%, rgba(244, 247, 245, 1) 100%)',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          {/* Main Serif Header */}
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              color: 'text.primary',
              lineHeight: 1.1,
              letterSpacing: -0.8,
              mb: 3
            }}
          >
            Rural Service
            <br />
            Request Portal
          </Typography>

          {/* Central Circular Graphic */}
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
            {/* Outer concentric dashed ring */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 290, sm: 350 },
                height: { xs: 290, sm: 350 },
                borderRadius: '50%',
                border: '1.5px dashed rgba(2, 84, 70, 0.25)',
                animation: 'spin 120s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />

            {/* Inner Circle displaying background_1.jpeg */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 250, sm: 300 },
                height: { xs: 250, sm: 300 },
                borderRadius: '50%',
                border: '6px solid #ffffff',
                boxShadow: '0 15px 45px rgba(2, 84, 70, 0.1)',
                backgroundImage: 'url("/background.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              {/* Center White Emblem Card */}
              <Box
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  borderRadius: '50%',
                  bgcolor: '#ffffff',
                  border: '3px solid #1D9BF0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  p: 1.5
                }}
              >
                <RsrpLogo />
              </Box>
            </Box>

            {/* Overlapping Blue Badge (top-right of circle) */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: 20, sm: 26 },
                right: { xs: 20, sm: 26 },
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#1976d2',
                border: '2.5px solid #ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                color: 'white',
                zIndex: 2
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Box>

            {/* Overlapping Green Dot (bottom-right of circle) */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: 25, sm: 32 },
                right: { xs: 15, sm: 20 },
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#22C55E',
                border: '2.5px solid #ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 2
              }}
            />
          </Box>

          {/* Subtitle Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 5.5,
              fontWeight: 500,
              lineHeight: 1.65,
              fontSize: { xs: '1rem', sm: '1.15rem' },
              maxWidth: 720,
              mx: 'auto'
            }}
          >
            Connecting villagers with local administration for faster issue resolution — water, street lights and roads, tracked in real time from complaint to completion.
          </Typography>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAuthModal('register')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 50,
                px: 4.5,
                py: 1.6,
                fontSize: '1.05rem',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(2, 84, 70, 0.15)'
              }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setAuthModal('login')}
              sx={{
                borderRadius: 50,
                px: 4.5,
                py: 1.6,
                fontSize: '1.05rem',
                bgcolor: '#ffffff',
                borderColor: 'rgba(2, 84, 70, 0.25)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
