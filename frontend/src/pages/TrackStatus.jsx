import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  AssignmentTurnedIn as AssignedIcon
} from '@mui/icons-material';
import API from '../services/api';

export default function TrackStatus({ t }) {
  const location = useLocation();
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    if (idParam) {
      setComplaintId(idParam);
      fetchComplaint(idParam);
    }
  }, [location.search]);

  const fetchComplaint = async (idToFetch) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setComplaint(null);
    try {
      const res = await API.get(`/complaints/track/${idToFetch.trim()}`);
      setComplaint(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.errorNotFound);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchComplaint(complaintId);
  };

  const getStepIndex = (status) => {
    if (!status) return 0;
    switch(status.toLowerCase()) {
      case 'pending': return 0;
      case 'in progress':
      case 'inprogress': return 1;
      case 'resolved': return 2;
      default: return 0;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t.trackingTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          {t.subtitle}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label={t.complaintIdLabel}
            placeholder={t.trackInputPlaceholder}
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} sx={{ px: 4 }}>
            {t.searchBtn}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {complaint && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Visual Stepper Progression */}
            <Box sx={{ width: '100%', py: 2 }}>
              <Stepper activeStep={getStepIndex(complaint.status)} alternativeLabel>
                <Step>
                  <StepLabel>{t.pending}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t.inProgress}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t.resolved}</StepLabel>
                </Step>
              </Stepper>
            </Box>

            <Divider />

            {/* Grievance Details Card */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.type}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {complaint.type === 'streetlight' ? t.streetlight : 
                   complaint.type === 'water' ? t.water : 
                   complaint.type === 'road' ? t.road : 
                   complaint.type === 'others' ? t.others : 
                   complaint.type}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.location}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {complaint.location}
                </Typography>

                {complaint.gpsCoords && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {t.coords}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {complaint.gpsCoords.lat.toFixed(6)}, {complaint.gpsCoords.lng.toFixed(6)}
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.status}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      display: 'inline-block',
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 2, 
                      fontWeight: 'bold', 
                      fontSize: '0.85rem',
                      color: complaint.status === 'Resolved' ? 'success.dark' : complaint.status === 'In Progress' ? 'warning.dark' : 'error.dark',
                      bgcolor: complaint.status === 'Resolved' ? 'success.light' : complaint.status === 'In Progress' ? 'warning.light' : 'error.light'
                    }}
                  >
                    {complaint.status === 'Resolved' ? t.resolved : complaint.status === 'In Progress' ? t.inProgress : t.pending}
                  </Paper>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.submissionDate}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>

                {complaint.assignedTo && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {t.assignedTo}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {complaint.assignedTo}
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.description}
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', mt: 0.5 }}>
                  <Typography variant="body2">{complaint.description}</Typography>
                </Paper>
              </Grid>

              {complaint.photos && complaint.photos.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    {t.uploadedAttachment}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                    {complaint.photos.map((url, i) => (
                      <Card key={i} sx={{ width: 120, height: 120 }}>
                        <Box 
                          component="img" 
                          src={url} 
                          alt="Grievance context" 
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/120?text=Photo+Uploaded';
                          }}
                        />
                      </Card>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider />

            {/* History timeline list */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignedIcon color="primary" /> {t.history}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {complaint.statusHistory && complaint.statusHistory.map((item, idx) => (
                  <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: '16px !important' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          {item.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>{item.notes}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {t.by}: {item.updatedBy}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
