import React from 'react';
import { Container, Grid, Box, Typography, Paper } from '@mui/material';
import {
  Lightbulb as LightIcon,
  Search as SearchIcon,
  CheckCircle as DoneIcon
} from '@mui/icons-material';

export default function HowItWorks({ t }) {
  const steps = [
    {
      num: '1',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: <LightIcon fontSize="large" />,
      color: 'primary.main',
      bgColor: 'primary.light'
    },
    {
      num: '2',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: <SearchIcon fontSize="large" />,
      color: 'secondary.main',
      bgColor: 'secondary.light'
    },
    {
      num: '3',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: <DoneIcon fontSize="large" />,
      color: 'warning.main',
      bgColor: 'warning.light'
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
          {t.howItWorks}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {t.howItWorksSubtitle}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {steps.map((step, idx) => (
          <Paper
            key={step.num}
            variant="outlined"
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: 5,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
              border: '1px solid rgba(2, 84, 70, 0.08)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4
            }}
          >
            {/* Number indicator */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: step.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 'bold',
                flexShrink: 0,
                boxShadow: `0 8px 25px rgba(0, 0, 0, 0.1)`
              }}
            >
              {step.num}
            </Box>

            {/* Content info */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}
              >
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                {step.desc}
              </Typography>
            </Box>

            {/* Icon decoration */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: step.bgColor,
                color: step.color,
                p: 3,
                borderRadius: '50%',
                flexShrink: 0
              }}
            >
              {step.icon}
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
