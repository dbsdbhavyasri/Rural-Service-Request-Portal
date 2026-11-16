import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  ExitToApp as LogoutIcon,
  Error as ErrorIcon,
  MyLocation as LocationIcon,
  AssignmentTurnedIn as AssignedIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import API from '../services/api';

export default function Admin({ t }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) {
    return <AdminLogin onLogin={handleLoginSuccess} t={t} />;
  }

  return <AdminDashboard onLogout={handleLogout} t={t} />;
}

function AdminLogin({ onLogin, t }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (mode === 'login') {
        const res = await API.post('/auth/login', { username, password });
        onLogin(res.data.token);
      } else {
        await API.post('/auth/register', { username, password });
        setSuccessMsg(t.registerSuccess);
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      if (mode === 'login') {
        setErrorMsg(t.invalidAdminAuth);
      } else {
        setErrorMsg(err.response?.data?.message || t.adminRegFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setErrorMsg('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mt: 6, p: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            {mode === 'login' ? t.adminLogin : t.registerAdmin}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            {mode === 'login' ? t.adminLoginDesc : t.adminRegisterDesc}
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMsg}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t.username}
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label={t.password}
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading}
              size="large"
            >
              {loading ? (mode === 'login' ? t.authenticating : t.registering) : (mode === 'login' ? t.loginBtn : t.registerAdmin)}
            </Button>

            <Button variant="text" size="small" onClick={toggleMode} sx={{ mt: 1 }}>
              {mode === 'login' ? t.needAdminAccount : t.alreadyAdminAccount}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

function AdminDashboard({ onLogout, t }) {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [pendingStaff, setPendingStaff] = useState([]);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // Selected Detail Modal
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [updateAssign, setUpdateAssign] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, statsRes, staffRes, pendingStaffRes] = await Promise.all([
        API.get('/complaints/all'),
        API.get('/complaints/stats'),
        API.get('/auth/staff'),
        API.get('/auth/staff/pending').catch(() => ({ data: [] }))
      ]);
      setComplaints(compRes.data);
      setStats(statsRes.data);
      setStaffList(staffRes.data || []);
      setPendingStaff(pendingStaffRes.data || []);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        onLogout(); // expired token
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (filterArea) params.area = filterArea;

      const res = await API.get('/complaints/filter', { params });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilterType('');
    setFilterStatus('');
    setFilterArea('');
    fetchData();
  };

  const handleOpenDetail = (item) => {
    setSelectedGrievance(item);
    setUpdateStatus(item.status);
    setUpdateNotes('');
    setUpdateAssign(item.assignedTo || '');
    setSelectedStaffId(item.assignedStaffId || '');
  };

  const handleCloseDetail = () => {
    setSelectedGrievance(null);
  };

  const handleApproveStaff = async (id, status) => {
    setActionLoading(true);
    try {
      await API.put(`/auth/staff/approve/${id}`, { status });
      setToastMsg(`Staff account ${status.toLowerCase()} successfully!`);
      fetchData();
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to update staff approval status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatusSubmit = async () => {
    if (!selectedGrievance) return;
    setActionLoading(true);
    try {
      // If staff assignment changed
      if (selectedStaffId && selectedStaffId !== selectedGrievance.assignedStaffId) {
        const staffObj = staffList.find(s => s.id === selectedStaffId || s.username === updateAssign);
        await API.put(`/complaints/assign/${selectedGrievance.id}`, {
          staffId: selectedStaffId || staffObj?.id,
          assignedTo: staffObj?.username || updateAssign
        });
      } else {
        const payload = {
          status: updateStatus,
          notes: updateNotes || (t.autoStatusUpdateNotes ? t.autoStatusUpdateNotes.replace('{status}', updateStatus) : `Status updated to ${updateStatus}`),
          updatedBy: "Admin",
          assignedTo: updateAssign || null
        };
        await API.put(`/complaints/update/${selectedGrievance.id}`, payload);
      }
      
      setToastMsg(t.updateSuccess || 'Grievance updated successfully!');
      handleCloseDetail();
      fetchData();
    } catch (err) {
      console.error(err);
      setToastMsg(t.updateFailed || 'Failed to update grievance.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm(t.confirmDelete || 'Are you sure you want to delete this complaint?')) return;
    setActionLoading(true);
    try {
      await API.delete(`/complaints/delete/${id}`);
      setToastMsg(t.deleteSuccess || 'Complaint deleted.');
      handleCloseDetail();
      fetchData();
    } catch (err) {
      console.error(err);
      setToastMsg(t.deleteFailed || 'Failed to delete complaint.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to compute staff workload (open tasks)
  const getStaffWorkloadCount = (staffName, staffId) => {
    return complaints.filter(c => 
      (c.assignedTo === staffName || (c.assignedStaffId && c.assignedStaffId === staffId)) && 
      c.status !== 'Resolved'
    ).length;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon color="primary" fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {t.dashboard || 'Admin Task Assignment Panel'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading}>
            {t.refresh || 'Refresh'}
          </Button>
          <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={onLogout}>
            {t.logout || 'Logout'}
          </Button>
        </Box>
      </Box>

      {/* Overview stats cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.total || 'TOTAL'}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'error.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.pending || 'PENDING'}
                </Typography>
                <Typography variant="h4" color="error.main" sx={{ mt: 1 }}>
                  {stats.byStatus?.Pending || stats.byStatus?.pending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.inProgress || 'IN PROGRESS'}
                </Typography>
                <Typography variant="h4" color="warning.dark" sx={{ mt: 1 }}>
                  {stats.byStatus?.["In Progress"] || stats.byStatus?.["inprogress"] || stats.byStatus?.["In-Progress"] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid', borderLeftColor: 'success.main' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t.resolved || 'RESOLVED'}
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ mt: 1 }}>
                  {stats.byStatus?.Resolved || stats.byStatus?.resolved || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab control for panel toggles */}
      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label={t.activeGrievancesTab || 'Task Assignment'} />
        <Tab label={t.staffApprovalsTab || `Staff Approvals (${pendingStaff.length})`} />
        <Tab label={t.mapView || 'Geographic Map'} />
      </Tabs>

      {activeTab === 0 ? (
        <Grid container spacing={3}>
          {/* Sidebar Filter Controls */}
          <Grid item xs={12} md={3}>
            <Card variant="outlined" sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3 }}>
                {t.filterControls || 'Filter Complaints'}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t.type || 'Category'}</InputLabel>
                  <Select
                    value={filterType}
                    label={t.type || 'Category'}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="">{t.allCategories || 'All Categories'}</MenuItem>
                    <MenuItem value="streetlight">{t.streetlight || 'Street Light'}</MenuItem>
                    <MenuItem value="water">{t.water || 'Water Issue'}</MenuItem>
                    <MenuItem value="road">{t.road || 'Road Maintenance'}</MenuItem>
                    <MenuItem value="others">{t.others || 'Others'}</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>{t.status || 'Status'}</InputLabel>
                  <Select
                    value={filterStatus}
                    label={t.status || 'Status'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="">{t.allStatuses || 'All Statuses'}</MenuItem>
                    <MenuItem value="Pending">{t.pending || 'Pending'}</MenuItem>
                    <MenuItem value="Assigned">{t.assigned || 'Assigned'}</MenuItem>
                    <MenuItem value="In Progress">{t.inProgress || 'In Progress'}</MenuItem>
                    <MenuItem value="Resolved">{t.resolved || 'Resolved'}</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label={t.location || 'Location'}
                  placeholder={t.searchAreaPlaceholder || 'Search by village/location'}
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                />

                <Button variant="contained" color="primary" onClick={handleApplyFilter}>
                  {t.applyFilters || 'Apply Filters'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleResetFilter}>
                  {t.resetAll || 'Reset'}
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Grievances list table */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
              </Box>
            ) : complaints.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <ErrorIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
                <Typography color="text.secondary">{t.noComplaints || 'No complaints match the filter criteria.'}</Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t.complaintIdLabel || 'ID'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t.type || 'Type'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t.location || 'Location'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t.status || 'Status'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t.assignedStaff || 'Assigned Staff'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t.actions || 'Actions'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.map((item) => (
                      <TableRow key={item.id || item.complaintId} hover>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {item.complaintId}
                        </TableCell>
                        <TableCell>
                          {item.type === 'streetlight' ? (t.streetlight || 'Street Light') : 
                           item.type === 'water' ? (t.water || 'Water Supply') : 
                           item.type === 'road' ? (t.road || 'Road') : 
                           item.type === 'others' ? (t.others || 'Others') : 
                           item.type}
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1.5,
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: item.status === 'Resolved' ? 'success.dark' : item.status === 'In Progress' ? 'warning.dark' : item.status === 'Assigned' ? 'info.dark' : 'error.dark',
                              bgcolor: item.status === 'Resolved' ? 'success.light' : item.status === 'In Progress' ? 'warning.light' : item.status === 'Assigned' ? 'info.light' : 'error.light'
                            }}
                          >
                            {item.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item.assignedTo ? (
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {item.assignedTo}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Unassigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="contained" color="primary" onClick={() => handleOpenDetail(item)}>
                            {t.assignOrEdit || 'Assign / Manage'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      ) : activeTab === 1 ? (
        /* Staff Approvals & Workload Panel */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Pending Staff Approvals */}
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Pending Staff Registrations ({pendingStaff.length})
              </Typography>
            </Box>
            {pendingStaff.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No staff account registrations pending approval.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trade Specialization</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Approval Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingStaff.map((staff) => (
                      <TableRow key={staff.id} hover>
                        <TableCell sx={{ fontWeight: 'bold' }}>{staff.username}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2, fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {staff.specialization || 'General'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, bgcolor: 'warning.light', color: 'warning.dark', borderRadius: 2, fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {staff.approvalStatus || 'Pending'}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="success" 
                              onClick={() => handleApproveStaff(staff.id, 'Approved')}
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              onClick={() => handleApproveStaff(staff.id, 'Rejected')}
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          {/* Approved Staff Workload Overview */}
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Field Staff Workload Overview ({staffList.length} Staff Members)
              </Typography>
            </Box>
            {staffList.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No approved staff registered in system.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trade Specialization</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Active Workload (Open Tasks)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffList.map((staff) => {
                      const openCount = getStaffWorkloadCount(staff.username, staff.id);
                      return (
                        <TableRow key={staff.id} hover>
                          <TableCell sx={{ fontWeight: 'bold' }}>{staff.username}</TableCell>
                          <TableCell>{staff.specialization || 'General'}</TableCell>
                          <TableCell>{staff.phone}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: openCount > 3 ? 'error.main' : 'success.main' }}>
                                {openCount} Active Task{openCount !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Box>
      ) : (
        /* Geographic Map View */
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            {t.mapTitle || 'Geographic Grievance Map'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t.mapDesc || 'Spatial view of complaints across villages'}
          </Typography>

          <Box 
            sx={{ 
              width: '100%', 
              maxWidth: 700, 
              mx: 'auto', 
              aspectRatio: '16/9', 
              bgcolor: '#e3f2fd', 
              borderRadius: 3, 
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box 
              component="svg" 
              viewBox="0 0 100 100" 
              sx={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.2 }}
            >
              <path d="M10,20 Q30,10 50,20 T90,20 L90,80 Q70,90 50,80 T10,80 Z" fill="none" stroke="#1565c0" strokeWidth="0.5" />
              <path d="M40,0 L40,100 M0,50 L100,50" stroke="#1565c0" strokeWidth="0.25" strokeDasharray="2" />
            </Box>

            {complaints.filter(c => c.gpsCoords && c.gpsCoords.lat).map((item, idx) => {
              const xPos = ((item.gpsCoords.lng - 80.2) * 500) % 85 + 5;
              const yPos = ((item.gpsCoords.lat - 16.1) * 500) % 85 + 5;
              return (
                <IconButton 
                  key={idx}
                  onClick={() => handleOpenDetail(item)}
                  sx={{ 
                    position: 'absolute', 
                    left: `${xPos}%`, 
                    top: `${yPos}%`, 
                    color: item.status === 'Resolved' ? 'success.main' : item.status === 'In Progress' ? 'warning.main' : 'error.main',
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      transform: 'scale(1.2)'
                    }
                  }}
                  size="small"
                >
                  <LocationIcon fontSize="small" />
                </IconButton>
              );
            })}

            {complaints.filter(c => c.gpsCoords && c.gpsCoords.lat).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ zIndex: 1 }}>
                {t.noCoordsDesc || 'No complaints with GPS coordinates recorded.'}
              </Typography>
            )}
          </Box>
        </Card>
      )}

      {/* Selected Grievance details modal dialog */}
      {selectedGrievance && (
        <Dialog open={true} onClose={handleCloseDetail} fullWidth maxWidth="md">
          <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
              {t.modifyGrievance || 'Assign & Manage Grievance'} {selectedGrievance.complaintId}
            </Typography>
            <Button 
              color="error" 
              variant="outlined" 
              startIcon={<DeleteIcon />} 
              onClick={() => handleDeleteComplaint(selectedGrievance.id)}
              disabled={actionLoading}
            >
              {t.deleteBtn || 'Delete'}
            </Button>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              {/* Info Column */}
               <Grid item xs={12} md={6}>
                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                   {t.grievanceCategory || 'Category'}
                 </Typography>
                 <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                   {selectedGrievance.type === 'streetlight' ? (t.streetlight || 'Street Light') : 
                    selectedGrievance.type === 'water' ? (t.water || 'Water Supply') : 
                    selectedGrievance.type === 'road' ? (t.road || 'Road') : 
                    selectedGrievance.type === 'others' ? (t.others || 'Others') : 
                    selectedGrievance.type}
                 </Typography>

                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                   {t.locationVillage || 'Village / Location'}
                 </Typography>
                 <Typography variant="body1" sx={{ mb: 2 }}>
                   {selectedGrievance.location}
                 </Typography>

                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                   {t.citizenPhone || 'Citizen Mobile'}
                 </Typography>
                 <Typography variant="body1" sx={{ mb: 2 }}>
                   {selectedGrievance.phone}
                 </Typography>

                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                   {t.descriptionDetails || 'Issue Description'}
                 </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', mt: 0.5 }}>
                  <Typography variant="body2">{selectedGrievance.description}</Typography>
                </Paper>
              </Grid>

              {/* Action Column */}
              <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                   {t.adminActions || 'Assign Staff & Update Status'}
                 </Typography>
                 
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                   <FormControl fullWidth>
                     <InputLabel>{t.status || 'Status'}</InputLabel>
                     <Select
                       value={updateStatus}
                       label={t.status || 'Status'}
                       onChange={(e) => setUpdateStatus(e.target.value)}
                     >
                       <MenuItem value="Pending">{t.pending || 'Pending'}</MenuItem>
                       <MenuItem value="Assigned">{t.assigned || 'Assigned'}</MenuItem>
                       <MenuItem value="In Progress">{t.inProgress || 'In Progress'}</MenuItem>
                       <MenuItem value="Resolved">{t.resolved || 'Resolved'}</MenuItem>
                     </Select>
                   </FormControl>

                    <FormControl fullWidth>
                      <InputLabel id="assign-staff-label">{t.selectStaffToAssign || "Assign to Staff Member"}</InputLabel>
                      <Select
                        labelId="assign-staff-label"
                        value={selectedStaffId || updateAssign}
                        label={t.selectStaffToAssign || "Assign to Staff Member"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedStaffId(val);
                          const staffObj = staffList.find(s => s.id === val || s.username === val);
                          if (staffObj) {
                            setUpdateAssign(staffObj.username);
                            setUpdateStatus('Assigned');
                          }
                        }}
                      >
                        <MenuItem value=""><em>{t.notAssigned || "Unassigned"}</em></MenuItem>
                        {staffList.map((staff) => {
                          const isRecommended = 
                            (selectedGrievance.type === 'streetlight' && staff.specialization === 'Electrician') ||
                            (selectedGrievance.type === 'water' && staff.specialization === 'Plumber') ||
                            (selectedGrievance.type === 'road' && (staff.specialization === 'Road Maintenance Specialist' || staff.specialization === 'Mason')) ||
                            (selectedGrievance.type === 'others' && (staff.specialization === 'General' || staff.specialization === 'Other Support Staff'));
                          
                          const workload = getStaffWorkloadCount(staff.username, staff.id);

                          return (
                            <MenuItem key={staff.id} value={staff.id}>
                              {staff.username} ({staff.specialization || "General"}) - [{workload} active tasks] {isRecommended ? ` ★ Recommended Match` : ''}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                   <TextField
                     label={t.notes || 'Remarks / Notes'}
                     fullWidth
                     multiline
                     rows={2}
                     placeholder={t.notesPlaceholder || 'Add assignment notes or progress update...'}
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
               {t.cancel || 'Cancel'}
             </Button>
            <Button 
              onClick={handleUpdateStatusSubmit} 
              variant="contained" 
              color="primary" 
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {t.updateBtn || 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar 
        open={!!toastMsg} 
        autoHideDuration={3000} 
        onClose={() => setToastMsg('')}
        message={toastMsg}
      />
    </Container>
  );
}
