import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Card, Paper, TextField, Button } from '@mui/material';
import {
  Search as SearchIcon,
  ContactSupport as SupportIcon,
  Schedule as TimeIcon,
  Info as InfoIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

export default function Contact({ t }) {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');

  const handleTrackSubmit = () => {
    if (trackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          color="primary.main"
          sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Lora", serif' }}
        >
          {t.contact}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {t.contactSubtitle}
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 3, fontFamily: '"Lora", serif' }}>
            {t.helplineDirectory}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            {t.contactDesc}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Box sx={{ display: 'inline-flex', bgcolor: 'primary.light', color: 'primary.main', p: 1.5, borderRadius: 3, height: 'fit-content' }}>
                <SupportIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {t.egovOffice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {t.egovOfficeDesc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Box sx={{ display: 'inline-flex', bgcolor: 'secondary.light', color: 'secondary.main', p: 1.5, borderRadius: 3, height: 'fit-content' }}>
                <TimeIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {t.workingHours}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                  {t.workingHoursDesc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Box sx={{ display: 'inline-flex', bgcolor: 'warning.light', color: 'warning.main', p: 1.5, borderRadius: 3, height: 'fit-content' }}>
                <PhoneIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {t.primaryHelplines}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                  {t.primaryHelplinesDesc}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Quick Guest tracking card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 4.5,
              borderRadius: 5,
              boxShadow: '0 12px 40px rgba(2, 84, 70, 0.05)',
              border: '1.5px solid rgba(2, 84, 70, 0.08)',
              bgcolor: 'background.paper'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Lora", serif',
                fontWeight: 'bold',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: 'primary.main'
              }}
            >
              <SearchIcon fontSize="medium" /> {t.guestTrack}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4.5, lineHeight: 1.6 }}>
              {t.guestTrackDesc}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 0.6,
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid rgba(2, 84, 70, 0.12)',
                borderRadius: 50,
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}
            >
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder={t.trackInputPlaceholder}
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrackSubmit()}
                InputProps={{ disableUnderline: true, sx: { px: 2.5 } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleTrackSubmit}
                sx={{ px: 4.5, py: 1.3, borderRadius: 50, fontWeight: 'bold' }}
              >
                {t.searchBtn}
              </Button>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
