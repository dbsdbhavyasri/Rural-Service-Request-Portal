import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import RsrpLogo from '../components/RsrpLogo';

// Atmospheric SVG vector silhouette of rural Indian village background (Light mode adapted)
const RuralSilhouetteBg = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: { xs: '35vh', md: '45vh', lg: '50vh' },
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0.12,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end'
    }}
  >
    <svg
      viewBox="0 0 1440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="silhouetteGradLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#053733" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#124F77" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Far Distant Hills */}
      <path
        d="M0 280 Q 250 210, 500 250 T 1000 220 Q 1250 190, 1440 230 L 1440 380 L 0 380 Z"
        fill="url(#silhouetteGradLight)"
        opacity="0.3"
      />

      {/* Mid-ground Village Terrain & Roads */}
      <path
        d="M0 310 Q 320 260, 680 300 T 1440 270 L 1440 380 L 0 380 Z"
        fill="url(#silhouetteGradLight)"
        opacity="0.5"
      />

      {/* Winding Village Road Silhouette */}
      <path
        d="M620 380 C 640 340, 670 320, 690 300 C 705 285, 715 280, 720 275"
        stroke="#053733"
        strokeWidth="3"
        strokeDasharray="6 4"
        opacity="0.4"
      />

      {/* Electricity Poles & Distant Lines (Left side) */}
      <g fill="#053733" opacity="0.85">
        <rect x="140" y="160" width="3" height="130" rx="1.5" />
        <line x1="125" y1="175" x2="155" y2="175" stroke="#053733" strokeWidth="2.5" />
        <line x1="130" y1="190" x2="150" y2="190" stroke="#053733" strokeWidth="2" />
        <rect x="290" y="195" width="2.5" height="95" rx="1" />
        <line x1="278" y1="207" x2="302" y2="207" stroke="#053733" strokeWidth="2" />
        <path d="M125 175 Q 200 195, 278 207" stroke="#053733" strokeWidth="1" opacity="0.6" fill="none" />
        <path d="M155 175 Q 220 195, 302 207" stroke="#053733" strokeWidth="1" opacity="0.6" fill="none" />
      </g>

      {/* Electricity Poles & Distant Lines (Right side) */}
      <g fill="#053733" opacity="0.85">
        <rect x="1220" y="170" width="3" height="120" rx="1.5" />
        <line x1="1205" y1="185" x2="1235" y2="185" stroke="#053733" strokeWidth="2.5" />
        <rect x="1080" y="190" width="3" height="100" rx="1.5" />
        <path d="M1081.5 190 C 1081.5 180, 1095 175, 1105 175" stroke="#053733" strokeWidth="2.5" fill="none" />
        <polygon points="1102,171 1118,175 1108,181" />
      </g>

      {/* Village Houses & Structures */}
      <g fill="#053733" opacity="0.8">
        <polygon points="210,250 245,225 280,250" />
        <rect x="218" y="250" width="56" height="35" />
        <polygon points="170,260 195,240 220,260" />
        <rect x="175" y="260" width="40" height="26" />
        <polygon points="1140,255 1175,230 1210,255" />
        <rect x="1148" y="255" width="54" height="38" />
        <line x1="1175" y1="230" x2="1175" y2="215" stroke="#053733" strokeWidth="1.5" />
        <polygon points="1175,215 1188,220 1175,225" />
        <polygon points="980,270 1005,252 1030,270" />
        <rect x="985" y="270" width="40" height="25" />
        <g transform="translate(670, 275) scale(0.95)">
          <rect x="0" y="22" width="28" height="6" rx="2" />
          <rect x="11" y="0" width="6" height="22" rx="1" />
          <rect x="4" y="8" width="8" height="4" rx="1" />
          <path d="M4 12 L 2 16" stroke="#053733" strokeWidth="2" />
          <path d="M16 4 L 26 12" stroke="#053733" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Trees & Foliage Silhouettes */}
      <g fill="#053733" opacity="0.75">
        <path d="M85 285 L85 240 C60 235, 50 215, 65 195 C75 180, 105 180, 115 195 C130 185, 150 205, 140 225 C150 240, 130 255, 105 245 L105 285 Z" />
        <path d="M460 290 L463 235 C445 220, 435 225, 430 230 M463 235 C455 210, 465 200, 470 205 M463 235 C480 220, 490 225, 495 230" stroke="#053733" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="463" cy="235" r="14" opacity="0.8" />
        <path d="M920 295 L920 250 C900 245, 890 225, 905 210 C915 195, 940 195, 950 210 C965 200, 980 220, 970 235 C980 250, 960 260, 940 255 L940 295 Z" />
        <path d="M1360 280 L1360 235 C1340 230, 1330 210, 1345 195 C1355 180, 1380 180, 1390 195 C1405 185, 1420 205, 1410 220 C1420 235, 1400 250, 1380 245 L1380 280 Z" />
      </g>
    </svg>
  </Box>
);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'transparent',
        color: '#032321',
        overflow: 'hidden',
        px: { xs: 3, sm: 4, md: 6 },
        py: { xs: 6, md: 8 },
        boxSizing: 'border-box'
      }}
    >
      {/* Subtle Atmospheric Rural Silhouette Background */}
      <RuralSilhouetteBg />

      {/* Main Centered Content Container */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          my: 'auto'
        }}
      >
        {/* TOP/CENTER BRANDING WITH RSRP PROJECT LOGO */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 4, md: 5 }
          }}
        >
          <RsrpLogo alt="Rural Service Request Portal Logo" />

          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              letterSpacing: '0.02em',
              color: '#032321',
              mt: 2,
              lineHeight: 1.2
            }}
          >
            Rural Service
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#053733',
              mt: 0.5
            }}
          >
            Request Portal
          </Typography>
        </Box>

        {/* MAIN HEADLINE */}
        <Typography
          component="h1"
          sx={{
            fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.5rem', lg: '5.2rem' },
            lineHeight: { xs: 1.15, md: 1.1 },
            letterSpacing: '-0.02em',
            mb: { xs: 3, md: 3.5 },
            maxWidth: '900px',
            color: '#032321'
          }}
        >
          Better Services
          <Box
            component="span"
            sx={{
              display: 'block',
              color: '#B45309', // Warm golden amber tone for strong contrast on light background
              fontWeight: 700,
              mt: { xs: 0.5, md: 1 }
            }}
          >
            for Every Village.
          </Box>
        </Typography>

        {/* SUPPORTING TEXT */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
            lineHeight: 1.6,
            color: '#334155',
            maxWidth: '620px',
            mb: { xs: 4, md: 5 },
            px: 2
          }}
        >
          A simple digital platform to report, track, and resolve civic issues in rural communities.
        </Typography>

        {/* CTA BUTTON */}
        <Button
          onClick={() => navigate('/login')}
          variant="contained"
          size="large"
          disableElevation
          sx={{
            bgcolor: '#053733',
            color: '#FFFFFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            py: { xs: 1.6, sm: 1.8 },
            px: { xs: 4, sm: 5 },
            borderRadius: '50px',
            textTransform: 'none',
            letterSpacing: '0.02em',
            boxShadow: '0 12px 30px rgba(5, 55, 51, 0.28)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#032321',
              transform: 'translateY(-3px) scale(1.02)',
              boxShadow: '0 18px 40px rgba(5, 55, 51, 0.38)'
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.99)'
            }
          }}
        >
          Raise a Request &nbsp;&rarr;
        </Button>
      </Container>
    </Box>
  );
}
