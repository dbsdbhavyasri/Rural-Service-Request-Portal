import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ open, mode, onClose, setMode, setToken, setUsername, setRole, setSpecialization, t }) {
  const navigate = useNavigate();
  // Input fields
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('CITIZEN');
  const [selectedSpecialization, setSelectedSpecialization] = useState('Electrician');

  // Form status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset state on open or mode switch
  useEffect(() => {
    setUser('');
    setPass('');
    setPhone('');
    setSelectedRole('CITIZEN');
    setSelectedSpecialization('Electrician');
    setErrorMsg('');
    setSuccessMsg('');
  }, [open, mode]);

  const handleSubmit = async () => {
    if (!user.trim() || !pass.trim()) {
      setErrorMsg(t.authRequiredFields);
      return;
    }

    if (mode === 'register' && !phone.trim()) {
      setErrorMsg(t.authRequiredPhone);
      return;
    }

    if (mode === 'register' && !/^[0-9]{10}$/.test(phone.trim())) {
      setErrorMsg(t.phoneError);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const res = await API.post('/auth/citizen/login', {
          username: user.trim(),
          password: pass.trim()
        });
        localStorage.setItem('citizenToken', res.data.token);
        localStorage.setItem('citizenUsername', res.data.username);
        localStorage.setItem('citizenRole', res.data.role);
        localStorage.setItem('citizenSpecialization', res.data.specialization || '');
        setToken(res.data.token);
        setUsername(res.data.username);
        if (setRole) setRole(res.data.role);
        if (setSpecialization) setSpecialization(res.data.specialization || '');
        onClose();
        if (res.data.role === 'STAFF') {
          navigate('/staff');
        }
      } else {
        await API.post('/auth/citizen/register', {
          username: user.trim(),
          password: pass.trim(),
          phone: phone.trim(),
          role: selectedRole,
          specialization: selectedRole === 'STAFF' ? selectedSpecialization : null
        });
        setSuccessMsg(t.registerSuccess);
        // Auto-switch to login after registration success
        setTimeout(() => {
          setMode('login');
          setUser(user.trim());
          setPass('');
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || t.authFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 2,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {mode === 'login' ? t.citizenLogin : t.citizenRegister}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {mode === 'login'
            ? t.authLoginDesc
            : t.authRegisterDesc}
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{successMsg}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label={t.username}
            fullWidth
            required
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />
          <TextField
            label={t.password}
            type="password"
            fullWidth
            required
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />

          {mode === 'register' && (
            <>
              <TextField
                label={t.phone}
                placeholder="e.g. 9876543210"
                fullWidth
                required
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]{10}' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />
              <FormControl fullWidth sx={{ mt: 0.5 }}>
                <InputLabel id="role-select-label">{t.role}</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole}
                  label={t.role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="CITIZEN">{t.citizen}</MenuItem>
                  <MenuItem value="STAFF">{t.staff}</MenuItem>
                </Select>
              </FormControl>
              {selectedRole === 'STAFF' && (
                <FormControl fullWidth sx={{ mt: 0.5 }}>
                  <InputLabel id="specialization-select-label">{t.specialization}</InputLabel>
                  <Select
                    labelId="specialization-select-label"
                    value={selectedSpecialization}
                    label={t.specialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="Electrician">{t.electrician}</MenuItem>
                    <MenuItem value="Plumber">{t.plumber}</MenuItem>
                    <MenuItem value="Road Maintenance Specialist">{t.roadWorker}</MenuItem>
                    <MenuItem value="Waste Management Worker">{t.wasteWorker}</MenuItem>
                    <MenuItem value="Other Support Staff">{t.otherStaff}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            py: 1.3,
            borderRadius: 50,
            fontWeight: 'bold',
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : (mode === 'login' ? t.loginBtn : t.registerBtn)}
        </Button>

        <Divider sx={{ width: '100%', my: 0.5 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {mode === 'login' ? t.authNewToPortal : t.authAlreadyRegistered}{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            sx={{ fontWeight: 'bold', color: 'secondary.main', p: 0, minWidth: 'auto', ml: 0.5 }}
          >
            {mode === 'login' ? t.authRegisterAccount : t.authSignIn}
          </Button>
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
          {t.authIsAdminPrompt}{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => { onClose(); navigate('/admin'); }}
            sx={{ fontWeight: 'bold', color: 'primary.main', p: 0, minWidth: 'auto' }}
          >
            {t.authGoToAdmin}
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
