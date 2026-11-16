import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  CircularProgress,
  Snackbar,
  Card,
  Paper,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  MyLocation as LocationIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import API from '../services/api';

export default function ComplaintForm({ type, onClose, t, embed = false }) {
  const [formData, setFormData] = useState({
    location: '',
    address: '',
    description: '',
    phone: '',
    gpsCoords: '',
    photo: '' // Mock photo URL
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); // stores submitted complaint details
  const [errors, setErrors] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleGPSDetect = () => {
    // Simulated coordinate capture
    const randomLat = (16.2 + Math.random() * 0.2).toFixed(6);
    const randomLng = (80.3 + Math.random() * 0.2).toFixed(6);
    handleInputChange('gpsCoords', `${randomLat}, ${randomLng}`);
    setSnackbarMessage(t.gpsDetected);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setSnackbarMessage("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    handleInputChange('photo', '');
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.location.trim()) tempErrors.location = t.requiredError;
    if (!formData.address.trim()) tempErrors.address = t.requiredError;
    if (!formData.description.trim()) tempErrors.description = t.requiredError;
    if (!formData.phone.trim()) {
      tempErrors.phone = t.requiredError;
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      tempErrors.phone = t.phoneError;
    }
    if (!formData.photo) tempErrors.photo = t.requiredError;
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let coordsObj = null;
      if (formData.gpsCoords) {
        const parts = formData.gpsCoords.split(',');
        if (parts.length === 2) {
          coordsObj = {
            lat: parseFloat(parts[0].trim()),
            lng: parseFloat(parts[1].trim())
          };
        }
      }

      const payload = {
        type: type,
        location: formData.location,
        address: formData.address,
        description: formData.description,
        phone: formData.phone,
        gpsCoords: coordsObj,
        photos: formData.photo ? [formData.photo] : []
      };

      const res = await API.post('/complaints/submit', payload);
      setSuccessData(res.data);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(t.submitFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.complaintId);
      setSnackbarMessage(t.copied);
    }
  };

  const formLabel =
    type === 'streetlight' ? t.streetlight :
      type === 'water' ? t.water :
        type === 'road' ? t.road :
          type === 'others' ? t.others :
            type;

  const titleText = successData ? t.success : `${t.submitComplaint}: ${formLabel}`;

  // RENDER INLINE / EMBEDDED LAYOUT
  if (embed) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(2, 84, 70, 0.04)',
          border: '1px solid rgba(2, 84, 70, 0.08)',
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main', fontFamily: '"Lora", serif' }}>
          {titleText}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {successData ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t.complaintSubmitted}
            </Typography>
            <Box sx={{ my: 3, p: 2.2, bgcolor: '#f4f7f5', borderRadius: 3, border: '1.5px dashed rgba(2, 84, 70, 0.15)' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t.yourId}
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold', letterSpacing: 1, my: 1 }}>
                {successData.complaintId}
              </Typography>
              <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={handleCopyId} sx={{ borderRadius: 50 }}>
                {t.copyId}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4.5 }}>
              {t.keepIdNotice}
            </Typography>
            <Button variant="contained" fullWidth onClick={onClose} sx={{ borderRadius: 50, py: 1.2 }}>
              {t.returnHome}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label={t.location}
              fullWidth
              required
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.address}
              fullWidth
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.phone}
              fullWidth
              required
              placeholder="e.g. 9876543210"
              inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]{10}' }}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.description}
              fullWidth
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <TextField
                  label={t.coords}
                  fullWidth
                  required
                  placeholder="lat, lng"
                  value={formData.gpsCoords}
                  onChange={(e) => handleInputChange('gpsCoords', e.target.value)}
                  InputProps={{ sx: { borderRadius: 3 } }}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={handleGPSDetect} startIcon={<LocationIcon />} sx={{ height: 56, borderRadius: 3 }}>
                  {t.detectLocation}
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'medium' }}>
                {t.uploadPhoto}
              </Typography>
              {errors.photo && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {errors.photo}
                </Typography>
              )}
              <input
                required
                accept="image/*"
                style={{ display: 'none' }}
                id="complaint-photo-upload-embed"
                type="file"
                onChange={handleFileChange}
              />
              {formData.photo ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
                  <Box
                    component="img"
                    src={formData.photo}
                    alt="Preview"
                    sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {t.photoSelected}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.readyToUpload}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleRemovePhoto} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <label htmlFor="complaint-photo-upload-embed">
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'rgba(2, 84, 70, 0.2)',
                      borderRadius: 3,
                      py: 3,
                      px: 2,
                      cursor: 'pointer',
                      bgcolor: 'rgba(2, 84, 70, 0.01)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(2, 84, 70, 0.04)'
                      }
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {t.clickToUpload}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.maxSizeNotice}
                    </Typography>
                  </Box>
                </label>
              )}
            </Box>

            <Box sx={{ mt: 2.5, display: 'flex', gap: 2 }}>
              <Button onClick={onClose} disabled={loading} color="inherit" fullWidth sx={{ borderRadius: 50, py: 1.2 }}>
                {t.cancel}
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ borderRadius: 50, py: 1.2 }}
              >
                {loading ? t.submitting : t.submitComplaint}
              </Button>
            </Box>
          </Box>
        )}

        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage('')}
          message={snackbarMessage}
        />
      </Paper>
    );
  }

  // RENDER MODAL DIALOG LAYOUT
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ pb: 1, fontWeight: 'bold', fontFamily: '"Lora", serif', color: 'primary.main' }}>
        {titleText}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        {successData ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t.complaintSubmitted}
            </Typography>
            <Box sx={{ my: 3, p: 2, bgcolor: '#f4f7f5', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t.yourId}
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold', letterSpacing: 1, my: 1 }}>
                {successData.complaintId}
              </Typography>
              <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={handleCopyId} sx={{ borderRadius: 50 }}>
                {t.copyId}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t.keepIdNotice}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label={t.location}
              fullWidth
              required
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.address}
              fullWidth
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.phone}
              fullWidth
              required
              placeholder="e.g. 9876543210"
              inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]{10}' }}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label={t.description}
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <TextField
                  label={t.coords}
                  fullWidth
                  required
                  placeholder="lat, lng"
                  value={formData.gpsCoords}
                  onChange={(e) => handleInputChange('gpsCoords', e.target.value)}
                  InputProps={{ sx: { borderRadius: 3 } }}
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={handleGPSDetect} startIcon={<LocationIcon />} sx={{ height: 56, borderRadius: 3 }}>
                  {t.detectLocation}
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'medium' }}>
                {t.uploadPhoto}
              </Typography>
              {errors.photo && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {errors.photo}
                </Typography>
              )}
              <input
                required
                accept="image/*"
                style={{ display: 'none' }}
                id="complaint-photo-upload-modal"
                type="file"
                onChange={handleFileChange}
              />
              {formData.photo ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
                  <Box
                    component="img"
                    src={formData.photo}
                    alt="Preview"
                    sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {t.photoSelected}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.readyToUpload}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleRemovePhoto} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <label htmlFor="complaint-photo-upload-modal">
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'rgba(2, 84, 70, 0.2)',
                      borderRadius: 3,
                      py: 3,
                      px: 2,
                      cursor: 'pointer',
                      bgcolor: 'rgba(2, 84, 70, 0.01)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(2, 84, 70, 0.04)'
                      }
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {t.clickToUpload}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.maxSizeNotice}
                    </Typography>
                  </Box>
                </label>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        {successData ? (
          <Button variant="contained" fullWidth onClick={onClose} sx={{ borderRadius: 50, py: 1.2 }}>
            {t.close}
          </Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={loading} color="inherit" sx={{ borderRadius: 50 }}>
              {t.cancel}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ borderRadius: 50 }}
            >
              {loading ? t.submitting : t.submitComplaint}
            </Button>
          </>
        )}
      </DialogActions>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Dialog>
  );
}
