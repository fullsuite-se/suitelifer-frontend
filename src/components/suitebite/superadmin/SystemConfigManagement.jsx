import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Button, TextField, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import { useSuitebiteStore } from '../../../store/stores/suitebiteStore';

const SystemConfigManagement = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { getSystemConfiguration, updateSystemConfiguration } = useSuitebiteStore();

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const loadSystemConfig = async () => {
    try {
      setLoading(true);
      const response = await getSystemConfiguration();
      if (response.success) {
        setConfig(response.config || {});
      }
    } catch (err) {
      setError('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await updateSystemConfiguration(config);
      if (response.success) {
        setMessage('System configuration updated successfully');
      } else {
        setError(response.message || 'Failed to update configuration');
      }
    } catch (err) {
      setError('Failed to update system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading && Object.keys(config).length === 0) {
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
        title={<Typography variant="h6">System Configuration Management</Typography>}
      />
      <CardContent>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Default Monthly Heartbits Limit"
              type="number"
              value={config.default_monthly_limit || ''}
              onChange={(e) => handleInputChange('default_monthly_limit', e.target.value)}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Heartbits Per Post"
              type="number"
              value={config.max_heartbits_per_post || ''}
              onChange={(e) => handleInputChange('max_heartbits_per_post', e.target.value)}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="System Maintenance Mode"
              select
              value={config.maintenance_mode || 'false'}
              onChange={(e) => handleInputChange('maintenance_mode', e.target.value)}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Products Per User"
              type="number"
              value={config.max_products_per_user || ''}
              onChange={(e) => handleInputChange('max_products_per_user', e.target.value)}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="System Announcement"
              multiline
              rows={3}
              value={config.system_announcement || ''}
              onChange={(e) => handleInputChange('system_announcement', e.target.value)}
              margin="normal"
            />
          </Grid>
        </Grid>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfigUpdate}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Configuration'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemConfigManagement; 