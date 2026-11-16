import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { WaterDrop as WaterIcon, Phone as PhoneIcon, QueryBuilder as TimeIcon, Opacity as QualityIcon } from '@mui/icons-material';
import ComplaintForm from '../components/ComplaintForm';

export default function WaterIssue({ t }) {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={5}>
        {/* Left Column: Department details & info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pr: { md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'inline-flex', bgcolor: 'secondary.light', color: 'secondary.main', p: 1.8, borderRadius: 3 }}>
                <WaterIcon fontSize="large" />
              </Box>
              <Typography variant="h3" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', color: 'secondary.main' }}>
                {t.watersupplyTitle}
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
              {t.waterPageDesc}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 4 }}>
              {t.waterSubmitInfo}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Department SLA & Contact Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', gap: 2, p: 2.5 }}>
                    <TimeIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {t.serviceSla}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {t.waterSla}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', gap: 2, p: 2.5 }}>
                    <PhoneIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {t.waterHotline}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +91 94408 12302<br />
                        waterboard@team7.gov.in
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* FAQ List */}
            <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 2.5, color: 'text.primary' }}>
              {t.commonInquiries}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.5 }}>
                  {t.wFaqQ1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.wFaqA1}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.5 }}>
                  {t.wFaqQ2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.wFaqA2}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Column: Embedded Complaint Form */}
        <Grid item xs={12} md={6}>
          <ComplaintForm type="water" onClose={handleClose} t={t} embed={true} />
        </Grid>
      </Grid>
    </Container>
  );
}
