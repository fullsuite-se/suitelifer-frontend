import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress, Chip, Typography } from '@mui/material';
import { useSuitebiteStore } from '../../../store/stores/suitebiteStore';

const AdminUserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { getAllAdminUsers, promoteToAdmin, demoteFromAdmin, suspendUser, unsuspendUser } = useSuitebiteStore();

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminUsers();
      if (response.success) {
        setAdmins(response.admins || []);
      }
    } catch (err) {
      setError('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      let response;
      switch (action) {
        case 'promote':
          response = await promoteToAdmin(userId);
          break;
        case 'demote':
          response = await demoteFromAdmin(userId);
          break;
        case 'suspend':
          response = await suspendUser(userId);
          break;
        case 'unsuspend':
          response = await unsuspendUser(userId);
          break;
        default:
          return;
      }
      
      if (response.success) {
        setMessage(`User ${action}ed successfully`);
        loadAdminUsers(); // Reload the list
      } else {
        setError(response.message || `Failed to ${action} user`);
      }
    } catch (err) {
      setError(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleChip = (userType) => {
    switch (userType) {
      case 'super_admin':
        return <Chip label="Super Admin" color="error" size="small" />;
      case 'admin':
        return <Chip label="Admin" color="warning" size="small" />;
      case 'employee':
        return <Chip label="Employee" color="primary" size="small" />;
      default:
        return <Chip label="User" color="default" size="small" />;
    }
  };

  const getStatusChip = (isSuspended) => {
    return isSuspended ? 
      <Chip label="Suspended" color="error" size="small" /> : 
      <Chip label="Active" color="success" size="small" />;
  };

  if (loading && admins.length === 0) {
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
        title={<Typography variant="h6">Admin User Management</Typography>}
      />
      <CardContent>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.user_id}>
                  <TableCell>{`${admin.first_name} ${admin.last_name}`}</TableCell>
                  <TableCell>{admin.user_email}</TableCell>
                  <TableCell>{getRoleChip(admin.user_type)}</TableCell>
                  <TableCell>{getStatusChip(admin.is_suspended)}</TableCell>
                  <TableCell>
                    {admin.user_type === 'employee' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleAction('promote', admin.user_id)}
                        disabled={loading}
                        sx={{ mr: 1 }}
                      >
                        Promote to Admin
                      </Button>
                    )}
                    
                    {admin.user_type === 'admin' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => handleAction('demote', admin.user_id)}
                        disabled={loading}
                        sx={{ mr: 1 }}
                      >
                        Demote to Employee
                      </Button>
                    )}
                    
                    {!admin.is_suspended ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleAction('suspend', admin.user_id)}
                        disabled={loading}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleAction('unsuspend', admin.user_id)}
                        disabled={loading}
                      >
                        Unsuspend
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement; 