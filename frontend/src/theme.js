import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#124f77',
      dark: '#05335b',
      light: '#E0F3FF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#14bfe5',
      dark: '#0e5b9f',
      light: '#E8FDF0',
      contrastText: '#ffffff',
    },
    success: {
      main: '#0b24e1',
      light: '#DCFCE7',
      dark: '#166534',
    },
    warning: {
      main: '#d85e16',
      light: '#FEF3C7',
      dark: '#B45309',
    },
    error: {
      main: '#F43F5E',
      light: '#FFE4E6',
      dark: '#BE123C',
    },
    info: {
      main: '#38BDF8',
      light: '#E0F2FE',
      dark: '#0284C7',
    },
    background: {
      default: '#F4FAFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(29, 155, 240, 0.18)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 14px 35px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(29, 155, 240, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});
