import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Build as StaffIcon,
  HowToReg as RegisterIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import API from '../services/api';
import RsrpLogo from '../components/RsrpLogo';

export default function Login({ setToken, setUsername, setRole, setSpecialization, t = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab mode: 0 for Login, 1 for Register
  const [tabIndex, setTabIndex] = useState(location.pathname === '/register' ? 1 : 0);

  // Form Fields
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('CITIZEN'); // CITIZEN, STAFF
  const [selectedSpecialization, setSelectedSpecialization] = useState('Electrician');
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [tabIndex, selectedRole]);

  useEffect(() => {
    setUser('');
    setPass('');
    setPhone('');
    setSelectedRole('CITIZEN');
    setSelectedSpecialization('Electrician');
    setErrorMsg('');
    setSuccessMsg('');

    // Password managers can refill the DOM after React state has been reset.
    const clearAutofilledValues = () => {
      [usernameInputRef, passwordInputRef, phoneInputRef].forEach((inputRef) => {
        if (inputRef.current) inputRef.current.value = '';
      });
    };
    clearAutofilledValues();
    const clearTimer = setTimeout(clearAutofilledValues, 100);
    return () => clearTimeout(clearTimer);
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user.trim() || !pass.trim()) {
      setErrorMsg(t.authRequiredFields || 'Username and password are required');
      return;
    }

    if (tabIndex === 1 && selectedRole !== 'ADMIN' && !phone.trim()) {
      setErrorMsg(t.authRequiredPhone || 'Mobile number is required');
      return;
    }

    if (tabIndex === 1 && selectedRole !== 'ADMIN' && !/^[0-9]{10}$/.test(phone.trim())) {
      setErrorMsg(t.phoneError || 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (tabIndex === 1 && pass.trim().length < 8) {
      setErrorMsg(t.passwordError || 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (tabIndex === 0) {
        // LOGIN FLOW
        const res = await API.post('/auth/login', {
          username: user.trim(),
          password: pass.trim()
        });

        const { token, username, userId, role, specialization } = res.data;

        // Store auth tokens
        localStorage.setItem('citizenToken', token);
        localStorage.setItem('citizenUsername', username);
        localStorage.setItem('citizenUserId', userId || '');
        localStorage.setItem('citizenRole', role);
        localStorage.setItem('citizenSpecialization', specialization || '');

        if (role === 'ADMIN') {
          localStorage.setItem('adminToken', token);
        }

        // Lift state
        setToken(token);
        setUsername(username);
        if (setRole) setRole(role);
        if (setSpecialization) setSpecialization(specialization || '');

        // Role-Aware Navigation
        if (role === 'STAFF') {
          navigate('/staff');
        } else if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // REGISTER FLOW
        await API.post('/auth/register', {
          username: user.trim(),
          password: pass.trim(),
          phone: phone.trim(),
          role: selectedRole,
          specialization: selectedRole === 'STAFF' ? selectedSpecialization : null
        });

        if (selectedRole === 'STAFF') {
          setSuccessMsg(t.staffRegisterSuccessPending || 'Staff registration submitted! Account requires Admin approval before login.');
        } else {
          setSuccessMsg(t.registerSuccess || 'Registration successful! You can now log in.');
        }

        setTimeout(() => {
          setTabIndex(0);
          setPass('');
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.message || err.message || (t.authFailed || 'Authentication failed');
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, mb: 6 }}>
      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(2, 84, 70, 0.12)',
          boxShadow: '0 12px 32px rgba(2, 84, 70, 0.08)'
        }}
      >
        <Box sx={{ bgcolor: 'primary.main', color: '#ffffff', p: 3, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <RsrpLogo />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold' }}>
            {t.titleShort || 'Rural Service Request Portal'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {t.loginSubtitle || 'Sign in or register to access civic services'}
          </Typography>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab icon={<LoginIcon fontSize="small" />} iconPosition="start" label={t.loginBtn || 'Login'} />
          <Tab icon={<RegisterIcon fontSize="small" />} iconPosition="start" label={t.registerBtn || 'Register'} />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
              {successMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Role Selection inside Register mode */}
              {tabIndex === 1 && (
                <FormControl fullWidth size="small">
                  <InputLabel id="register-role-label">{t.accountType || 'Account Type'}</InputLabel>
                  <Select
                    labelId="register-role-label"
                    value={selectedRole}
                    label={t.accountType || 'Account Type'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="CITIZEN">{t.citizen || 'Citizen'}</MenuItem>
                    <MenuItem value="STAFF">{t.staff || 'Field Staff'}</MenuItem>
                    <MenuItem value="ADMIN">{t.admin || 'Administrator'}</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Specialization selector for Staff Registration */}
              {tabIndex === 1 && selectedRole === 'STAFF' && (
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 3, border: '1px solid rgba(2, 84, 70, 0.15)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StaffIcon fontSize="small" /> {t.staffTradeSpecialization || 'Staff Trade Specialization'}
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel id="spec-select-label">{t.specialization || 'Trade Specialization'}</InputLabel>
                    <Select
                      labelId="spec-select-label"
                      value={selectedSpecialization}
                      label={t.specialization || 'Trade Specialization'}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      sx={{ bgcolor: '#ffffff', borderRadius: 2 }}
                    >
                      <MenuItem value="Electrician">{t.electrician || 'Electrician (Street Light Maintenance)'}</MenuItem>
                      <MenuItem value="Plumber">{t.plumber || 'Plumber (Water Supply Issues)'}</MenuItem>
                      <MenuItem value="Road Maintenance Specialist">{t.roadWorker || 'Road Maintenance / Mason'}</MenuItem>
                      <MenuItem value="General">{t.generalStaff || 'General / Support Staff'}</MenuItem>
                    </Select>
                  </FormControl>
                  <Chip
                    label={t.staffApprovalWarning || 'Requires Admin Approval before first login'}
                    color="warning"
                    size="small"
                    sx={{ mt: 1.5, fontWeight: 'bold', fontSize: '0.7rem', width: '100%' }}
                  />
                </Box>
              )}

              <TextField
                inputRef={usernameInputRef}
                label={t.username || 'Username / Name'}
                fullWidth
                required
                autoComplete="new-username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />

              {tabIndex === 1 && selectedRole !== 'ADMIN' && (
                <TextField
                  inputRef={phoneInputRef}
                  label={t.phone || 'Mobile Number (10 Digits)'}
                  placeholder="e.g. 9876543210"
                  fullWidth
                  required
                  inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]{10}' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }}
                />
              )}

              <TextField
                inputRef={passwordInputRef}
                label={t.password || 'Password'}
                type="password"
                fullWidth
                required
                autoComplete="new-password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.3,
                  borderRadius: 50,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  mt: 1
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : tabIndex === 0 ? (
                  t.loginBtn || 'Login'
                ) : (
                  t.registerBtn || 'Register Account'
                )}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            {tabIndex === 0 ? (
              <>
                {t.authNewToPortal || "Don't have an account?"}{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setTabIndex(1)}
                  sx={{ fontWeight: 'bold', color: 'primary.main', p: 0, minWidth: 'auto', ml: 0.5 }}
                >
                  {t.authRegisterAccount || 'Register now'}
                </Button>
              </>
            ) : (
              <>
                {t.authAlreadyRegistered || 'Already registered?'}{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setTabIndex(0)}
                  sx={{ fontWeight: 'bold', color: 'primary.main', p: 0, minWidth: 'auto', ml: 0.5 }}
                >
                  {t.authSignIn || 'Sign in'}
                </Button>
              </>
            )}
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block" align="center">
            <strong>Role-Aware Portal:</strong> Citizens, Field Staff, and Administrators all log in using the main form above.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
