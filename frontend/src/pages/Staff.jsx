import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Refresh as RefreshIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Build as BuildIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Staff({ t }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('citizenToken') || '';
  const role = localStorage.getItem('citizenRole') || 'CITIZEN';
  const username = localStorage.getItem('citizenUsername') || '';
  const specialization = localStorage.getItem('citizenSpecialization') || '';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Update state
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  useEffect(() => {
    if (!token || role !== 'STAFF') {
      // If not staff, redirect or show message. We will just render unauthorized view inside render.
      return;
    }
    fetchTasks();
  }, [token, role]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/complaints/assigned');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch assigned tasks:', err);
      setToastMsg('Failed to fetch assigned tasks.');
      setToastSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setUpdateStatus(task.status);
    setUpdateNotes('');
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const handleUpdateStatusSubmit = async () => {
    if (!selectedTask) return;
    setActionLoading(true);
    try {
      const payload = {
        status: updateStatus,
        notes: updateNotes || `Status updated to ${updateStatus} by staff ${username}.`,
        updatedBy: username
      };

      await API.put(`/complaints/update/${selectedTask.id}`, payload);
      setToastMsg(t.statusUpdatedSuccessfully || 'Task status updated successfully!');
      setToastSeverity('success');
      handleCloseDetail();
      fetchTasks();
    } catch (err) {
      console.error(err);
      setToastMsg(t.updateFailed || 'Failed to update task.');
      setToastSeverity('error');
    } finally {
      setActionLoading(false);
    }
  };

  // Unauthorized page view
  if (!token || role !== 'STAFF') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'error.light', borderRadius: 4 }}>
          <CardContent>
            <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              This portal is restricted to registered Field Staff members. If you are a staff member, please log in with your credentials.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Dashboard Stats Calculations
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    resolved: tasks.filter(t => t.status === 'Resolved').length
  };

  // Helper for translating specializations
  const getSpecializationLabel = (spec) => {
    if (!spec) return '';
    const specLower = spec.toLowerCase();
    if (specLower.includes('electrician')) return t.electrician;
    if (specLower.includes('plumber')) return t.plumber;
    if (specLower.includes('road')) return t.roadWorker;
    if (specLower.includes('waste')) return t.wasteWorker;
    return spec;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header and Welcome */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BuildIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {t.welcomeStaff ? t.welcomeStaff.replace('{specialization}', getSpecializationLabel(specialization)) : `Field Staff Portal - ${specialization}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.staffWelcomeDesc || 'Review and update civic complaints assigned to your department.'}
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchTasks} disabled={loading} sx={{ borderRadius: 50 }}>
          {t.refresh}
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'primary.main', borderRadius: 2 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {t.total}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.total}</Typography>
                <TaskIcon color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'error.main', borderRadius: 2 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {t.pending}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 800 }}>{stats.pending}</Typography>
                <PendingIcon color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'warning.main', borderRadius: 2 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {t.inProgress}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="h4" color="warning.dark" sx={{ fontWeight: 800 }}>{stats.inProgress}</Typography>
                <BuildIcon color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'success.main', borderRadius: 2 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {t.resolved}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 800 }}>{stats.resolved}</Typography>
                <ResolvedIcon color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task List Table */}
      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {t.assignedTasks || 'My Assigned Tasks'}
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <TaskIcon color="action" sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography color="text.secondary">{t.noAssignedTasks || 'No tasks assigned to you currently.'}</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t.complaintIdLabel}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t.type}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t.location}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t.status}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t.dateLabel}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t.actions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{task.complaintId}</TableCell>
                    <TableCell>
                      {task.type === 'streetlight' ? t.streetlight :
                       task.type === 'water' ? t.water :
                       task.type === 'road' ? t.road :
                       task.type === 'others' ? t.others :
                       task.type}
                    </TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: task.status === 'Resolved' ? 'success.dark' : task.status === 'In Progress' ? 'warning.dark' : 'error.dark',
                          bgcolor: task.status === 'Resolved' ? 'success.light' : task.status === 'In Progress' ? 'warning.light' : 'error.light'
                        }}
                      >
                        {task.status}
                      </Box>
                    </TableCell>
                    <TableCell>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="text" onClick={() => handleOpenDetail(task)}>
                        {t.viewDetails}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Task Details & Status Update Dialog */}
      {selectedTask && (
        <Dialog open={true} onClose={handleCloseDetail} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {t.modifyGrievance || 'Modify Grievance'} {selectedTask.complaintId}
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.grievanceCategory}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {selectedTask.type === 'streetlight' ? t.streetlight :
                   selectedTask.type === 'water' ? t.water :
                   selectedTask.type === 'road' ? t.road :
                   selectedTask.type === 'others' ? t.others :
                   selectedTask.type}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.locationVillage}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {selectedTask.location}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.descriptionDetails}
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', mt: 0.5, mb: 3 }}>
                  <Typography variant="body2">{selectedTask.description}</Typography>
                </Paper>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {t.updateTaskStatus || 'Update Task Status'}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <FormControl fullWidth>
                    <InputLabel>{t.status}</InputLabel>
                    <Select
                      value={updateStatus}
                      label={t.status}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <MenuItem value="Pending">{t.pending || "Pending"}</MenuItem>
                      <MenuItem value="Assigned">{t.assigned || "Assigned"}</MenuItem>
                      <MenuItem value="In Progress">{t.inProgress || "In Progress"}</MenuItem>
                      <MenuItem value="Resolved">{t.resolved || "Resolved"}</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label={t.notes || 'Remarks/Completion Notes'}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe actions taken to fix the issue..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDetail} disabled={actionLoading}>
              {t.cancel}
            </Button>
            <Button
              onClick={handleUpdateStatusSubmit}
              variant="contained"
              color="primary"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {t.updateBtn}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={!!toastMsg}
        autoHideDuration={4000}
        onClose={() => setToastMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
