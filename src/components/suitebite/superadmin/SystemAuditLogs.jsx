import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress, Chip, TextField, Button, Grid, Typography } from '@mui/material';
import { useSuitebiteStore } from '../../../store/stores/suitebiteStore';

const SystemAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    actionType: '',
    userId: ''
  });
  const { getSystemAuditLogs } = useSuitebiteStore();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await getSystemAuditLogs(filters);
      if (response.success) {
        setLogs(response.logs || []);
      }
    } catch (err) {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    loadAuditLogs();
  };

  const getActionTypeChip = (actionType) => {
    const colorMap = {
      'user_login': 'primary',
      'user_logout': 'info',
      'admin_action': 'warning',
      'system_change': 'error',
      'data_export': 'success',
      'user_suspension': 'error',
      'role_change': 'warning'
    };
    
    return (
      <Chip 
        label={actionType.replace('_', ' ').toUpperCase()} 
        color={colorMap[actionType] || 'default'} 
        size="small" 
      />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">System Audit Logs</Typography>}
      />
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Action Type"
              value={filters.actionType}
              onChange={(e) => handleFilterChange('actionType', e.target.value)}
              placeholder="e.g., user_login, admin_action"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="Filter by user ID"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({
                  startDate: '',
                  endDate: '',
                  actionType: '',
                  userId: ''
                });
                loadAuditLogs();
              }}
              disabled={loading}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
        
        {/* Audit Logs Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>User Agent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.user_name || 'System'}</TableCell>
                  <TableCell>{getActionTypeChip(log.action_type)}</TableCell>
                  <TableCell>
                    <div style={{ maxWidth: 300, wordBreak: 'break-word' }}>
                      {log.action_details}
                    </div>
                  </TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>
                    <div style={{ maxWidth: 200, wordBreak: 'break-word', fontSize: '0.8rem' }}>
                      {log.user_agent}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {logs.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No audit logs found for the selected filters.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAuditLogs; 