import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  WaterDrop as WaterIcon,
  Construction as RoadIcon,
  Help as OthersIcon
} from '@mui/icons-material';

export default function Services({ t }) {
  const navigate = useNavigate();

  const servicesList = [
    {
      id: 'streetlight',
      title: t.streetlight,
      desc: t.streetlightDesc,
      icon: <LightbulbIcon fontSize="large" />,
      color: 'primary.main',
      bgColor: 'primary.light',
      path: '/streetlight'
    },
    {
      id: 'water',
      title: t.water,
      desc: t.waterDesc,
      icon: <WaterIcon fontSize="large" />,
      color: 'secondary.main',
      bgColor: 'secondary.light',
      path: '/water'
    },
    {
      id: 'road',
      title: t.road,
      desc: t.roadDesc,
      icon: <RoadIcon fontSize="large" />,
      color: 'warning.main',
      bgColor: 'warning.light',
      path: '/road'
    },
    {
      id: 'others',
      title: t.others,
      desc: t.othersDesc,
      icon: <OthersIcon fontSize="large" />,
      color: 'primary.main',
      bgColor: 'primary.light',
      path: '/others'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          color="primary.main"
          sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Lora", serif' }}
        >
          {t.servicesDirectory}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {t.servicesSubtitle}
        </Typography>
      </Box>

      <Grid container spacing={4} direction="column" alignItems="center">
        {servicesList.map((item) => (
          <Grid item xs={12} key={item.id} sx={{ width: '100%', maxWidth: 640 }}>
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                p: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 35px rgba(2, 84, 70, 0.08)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  bgcolor: item.bgColor,
                  color: item.color,
                  p: 2.5,
                  borderRadius: 4,
                  mr: 3,
                  alignSelf: 'flex-start'
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 1, color: 'text.primary' }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 50,
                    px: 3,
                    py: 1,
                    bgcolor: item.id === 'road' ? 'warning.main' : item.id === 'others' ? 'primary.main' : undefined,
                    '&:hover': {
                      bgcolor: item.id === 'road' ? 'warning.dark' : item.id === 'others' ? 'primary.dark' : undefined,
                    }
                  }}
                >
                  {t.openDeptPage}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
