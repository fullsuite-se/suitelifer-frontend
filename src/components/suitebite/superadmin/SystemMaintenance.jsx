import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Button, TextField, Grid, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useSuitebiteStore } from '../../../store/stores/suitebiteStore';

const SystemMaintenance = () => {
  const [operation, setOperation] = useState('');
  const [parameters, setParameters] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { performSystemMaintenance, exportSystemData } = useSuitebiteStore();

  const maintenanceOperations = [
    { value: 'clear_cache', label: 'Clear System Cache' },
    { value: 'optimize_database', label: 'Optimize Database' },
    { value: 'cleanup_logs', label: 'Cleanup Old Logs' },
    { value: 'backup_data', label: 'Create Data Backup' },
    { value: 'reset_counters', label: 'Reset System Counters' },
    { value: 'validate_data', label: 'Validate Data Integrity' }
  ];

  const handleMaintenance = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await performSystemMaintenance(operation, parameters);
      if (response.success) {
        setMessage(`Maintenance operation '${operation}' completed successfully`);
      } else {
        setError(response.message || 'Maintenance operation failed');
      }
    } catch (err) {
      setError('Failed to perform maintenance operation');
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await exportSystemData();
      if (response.success) {
        setMessage('Data export completed successfully');
        // Trigger download if URL is provided
        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank');
        }
      } else {
        setError(response.message || 'Data export failed');
      }
    } catch (err) {
      setError('Failed to export system data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">System Maintenance</Typography>}
      />
      <CardContent>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          {/* Maintenance Operations */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Maintenance Operations</Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Operation</InputLabel>
                  <Select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    label="Select Operation"
                  >
                    {maintenanceOperations.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Parameters (Optional)"
                  multiline
                  rows={3}
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  margin="normal"
                  placeholder="Enter additional parameters for the operation..."
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMaintenance}
                  disabled={!operation || loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Execute Maintenance'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Export */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Data Export</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Export system data for backup or analysis purposes.
                </Typography>
                
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDataExport}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Export System Data'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* System Status */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>System Status</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        Online
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        System Status
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        99.9%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Uptime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        Normal
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Load
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        Good
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Performance
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Maintenance Log */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Recent Maintenance Log</Typography>
                <Typography variant="body2" color="textSecondary">
                  No recent maintenance operations performed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SystemMaintenance; 