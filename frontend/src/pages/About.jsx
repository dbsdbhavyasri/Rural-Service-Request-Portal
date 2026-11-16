import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import images correctly as modules from your src assets folder
import issueImg from '../assets/other_civis_issuse.jpeg';
import riImg from '../assets/RI_image.jpeg';
import sliImg from '../assets/SLI_image.jpeg';
import wiImg from '../assets/WI.jpeg';

export default function About({ t }) {
  const baseImages = [
    { url: issueImg, caption: '' },
    { url: riImg, caption: '' },
    { url: sliImg, caption: '' },
    { url: wiImg, caption: '' }
  ];

  const activityImages = [baseImages[baseImages.length - 1], ...baseImages, baseImages[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentIndex === activityImages.length - 1) {
      const timeoutId = window.setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
        window.setTimeout(() => setIsTransitioning(true), 50);
      }, 500);

      return () => window.clearTimeout(timeoutId);
    }

    if (currentIndex === 0) {
      const timeoutId = window.setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(activityImages.length - 2);
        window.setTimeout(() => setIsTransitioning(true), 50);
      }, 500);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [activityImages.length, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            color="primary.main"
            sx={{ fontWeight: 'bold', mb: 3, fontFamily: '"Lora", serif' }}
          >
            {t?.aboutTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
            {t?.aboutDesc1}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
            {t?.aboutDesc2}
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mt: 5, flexWrap: 'wrap' }}>
            <Box sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2, pr: 1 }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', fontFamily: '"Lora", serif' }}>
                100%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t?.aboutStat1}
              </Typography>
            </Box>
            <Box sx={{ borderLeft: '3px solid', borderColor: 'secondary.main', pl: 2, pr: 1 }}>
              <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold', fontFamily: '"Lora", serif' }}>
                2 Min
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t?.aboutStat2}
              </Typography>
            </Box>
            <Box sx={{ borderLeft: '3px solid', borderColor: 'warning.main', pl: 2, pr: 1 }}>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold', fontFamily: '"Lora", serif' }}>
                24/7
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t?.aboutStat3}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}