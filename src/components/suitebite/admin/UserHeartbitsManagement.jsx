import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { pointsSystemApi } from '../../../api/pointsSystemApi';
import { formatDate } from '../../../utils/dateHelpers';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon, 
  CheckIcon,
  TrashIcon,
  ArrowPathIcon,
  CogIcon,
  UserGroupIcon,
  HeartIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../../../store/authStore';

const UserHeartbitsManagement = () => {
  const currentUser = useStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [globalLimit, setGlobalLimit] = useState(1000);
  const [showGlobalLimitModal, setShowGlobalLimitModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  


  useEffect(() => {
    loadUsersWithHeartbits();
    loadGlobalLimit();
  }, []);

  const loadGlobalLimit = async () => {
    try {
      const response = await suitebiteAPI.getSystemConfiguration();
      if (response.success && response.config) {
        const globalLimit = response.config.global_monthly_limit?.value || 1000;
        setGlobalLimit(globalLimit);
      } else {
        // Fallback to default if no config found
        setGlobalLimit(1000);
      }
    } catch (error) {
      console.error('Error loading global limit:', error);
      // Fallback to default
      setGlobalLimit(1000);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const loadUsersWithHeartbits = async () => {
    try {
      setLoading(true);
      const response = await pointsSystemApi.getAllUserPoints();
      
      if (response.success) {
        // Transform the data to match the expected format
        const transformedUsers = response.data.map(user => ({
          user_id: user.user_id,
          first_name: user.userName ? user.userName.split(' ')[0] : '',
          last_name: user.userName ? user.userName.split().slice(1).join(' ') : '',
          user_email: user.email,
          avatar: user.avatar, // Now available from backend
          heartbits_balance: user.available_points || 0,
          total_heartbits_earned: user.total_earned || 0,
          total_heartbits_spent: user.total_spent || 0,
          monthly_cheer_limit: user.monthly_cheer_limit || 100,
          monthly_cheer_used: user.monthly_cheer_used || 0,
          last_monthly_reset: user.last_monthly_reset,
          user_type: user.user_type ? user.user_type.toLowerCase() : 'employee', // Use actual role from DB, fallback to 'employee'
        }));
        setUsers(transformedUsers);
      } else {
        showNotification('error', 'Failed to load users data. Please try again.');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification('error', 'Failed to load users data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserHeartbits = async (userId, updates, reason = '') => {
    try {
      // Format reason to match peer cheer style: 'Received X points from cheer'
      const amount = updates.balance || 0;
      const adminReason = `Received ${amount} points from cheer`;
      if (updates.balance !== undefined) {
        const response = await pointsSystemApi.addPointsToUser(userId, updates.balance, reason);
        if (!response.success) {
          throw new Error('Failed to update balance');
        }
      }
      loadUsersWithHeartbits();
      setSelectedUser(null);
      showNotification('success', `Successfully gave ${updates.balance} heartbits to user!`);
    } catch (error) {
      console.error('Error updating heartbits:', error);
      showNotification('error', 'Failed to give heartbits. Please check your connection and try again.');
    }
  };

  const handleSetGlobalLimit = async (newLimit) => {
    try {
      // Save global limit to system configuration
      const response = await suitebiteAPI.updateSystemConfiguration(
        'global_monthly_limit',
        newLimit,
        'Global monthly heartbits limit for all users'
      );
      
      if (response.success) {
        setGlobalLimit(newLimit);
        showNotification('success', `Global monthly limit updated to ${newLimit} heartbits successfully!`);
      } else {
        throw new Error(response.message || 'Failed to update global limit');
      }
    } catch (error) {
      console.error('Error updating global limit:', error);
      showNotification('error', 'Failed to update global limit. Please try again.');
    }
  };

  const handleBulkGiveHeartbits = async (amount, reason) => {
    try {
      const updatePromises = selectedUsers.map(userId => 
        pointsSystemApi.addPointsToUser(userId, amount, reason)
      );
      
      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failCount = results.length - successCount;
      
      loadUsersWithHeartbits();
      setSelectedUsers([]);
      
      if (failCount === 0) {
        showNotification('success', `Successfully gave ${amount} heartbits to ${successCount} selected users!`);
      } else {
        showNotification('warning', `Partial success: ${successCount} users updated, ${failCount} failed.`);
      }
    } catch (error) {
      console.error('Error with bulk heartbits update:', error);
      showNotification('error', 'Failed to give heartbits to selected users. Please try again.');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.user_id)
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
    setSelectedUsers([]);
    showNotification('info', 'All filters and selections reset');
  };

  // Simplified filtering logic
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchLower);
    const emailMatch = (user.user_email || '').toLowerCase().includes(searchLower);
    return nameMatch || emailMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'points':
        aValue = a.heartbits_balance || 0;
        bValue = b.heartbits_balance || 0;
        break;
      default:
        aValue = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
        bValue = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // User Edit Modal Component
  const UserEditModal = ({ user, onClose }) => {
    const [heartbitsToGive, setHeartbitsToGive] = useState(0);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (reason.trim() && heartbitsToGive > 0) {
        setIsLoading(true);
        await handleUpdateUserHeartbits(user.user_id, { balance: heartbitsToGive }, reason);
        setIsLoading(false);
      }
    };

    const hasChanges = heartbitsToGive > 0 && reason.trim();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0097b2] to-[#007a8e] text-white px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Give Heartbits</h3>
                  <p className="text-white text-opacity-90 text-sm">{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Stats */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CogIcon className="w-4 h-4" />
                Current Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0097b2] flex items-center justify-center gap-1">
                    <HeartIcon className="w-5 h-5" />
                    {user.heartbits_balance || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Current Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">Activity</div>
                    <div className="text-xs">Given: {user.total_heartbits_given || 0}</div>
                    <div className="text-xs">Received: {user.total_heartbits_received || 0}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Heartbits to Give */}
              <div>
                <label htmlFor="heartbits-to-give" className="block text-sm font-semibold text-gray-700 mb-2">
                  Heartbits to Give
                </label>
                <div className="relative">
                  <HeartIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
                  <input
                    id="heartbits-to-give"
                    name="heartbits-to-give"
                    type="number"
                    value={heartbitsToGive}
                    onChange={(e) => setHeartbitsToGive(parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-lg font-semibold"
                    placeholder="0"
                    aria-describedby="give-help"
                  />
                </div>
                <div id="give-help" className="mt-1 text-xs text-gray-500">
                  Amount of heartbits to give to this user
                </div>
              </div>
              
              {/* Reason Input */}
              <div>
                <label htmlFor="edit-reason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Giving Heartbits
                </label>
                <textarea
                  id="edit-reason"
                  name="edit-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Explain why you're giving heartbits..."
                  aria-describedby="reason-help"
                />
                <div id="reason-help" className="mt-1 text-xs text-gray-500">
                  This will be logged for audit purposes
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!hasChanges || isLoading}
                  className="flex-1 px-4 py-3 bg-[#0097b2] text-white rounded-lg font-semibold hover:bg-[#007a8e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin w-4 h-4" />
                      Giving Heartbits...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-4 h-4" />
                      Give Heartbits
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Helper to map user_type to display label
  const getRoleLabel = (type) => {
    if (!type) return 'Employee';
    switch (type.toLowerCase()) {
      case 'super_admin':
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Employee';
    }
  };

  return (
    <div className="user-heartbits-management rounded-lg shadow-sm pb-6 px-6 pt-2">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : notification.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : notification.type === 'warning'
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Concise Search and Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 mt-0 mb-0">
        <div className="flex flex-wrap items-center gap-1">
          {/* Search Section */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
            />
          </div>
          {/* Sort Controls */}
          <label className="text-sm font-medium text-gray-700 ml-2">Sort:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
            style={{ minWidth: '80px' }}
          >
            <option value="name">Name</option>
            <option value="points">Points</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm font-medium flex items-center"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          <button
            onClick={resetFilters}
            className="px-2 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm font-medium"
          >
            Reset
          </button>
          <button 
            onClick={selectAllUsers}
            className="px-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-600">Global Limit: {globalLimit}</span>
          <button
            onClick={() => setShowGlobalLimitModal(true)}
            className="px-2 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium flex items-center gap-2"
          >
            <CogIcon className="w-4 h-4" />
            Edit Limit
          </button>
          <button
            onClick={async () => {
              if (window.confirm(`Trigger monthly reset and give all users their ${globalLimit} heartbits monthly allowance?`)) {
                try {
                  setLoading(true);
                  const response = await suitebiteAPI.triggerMonthlyReset();
                  if (response.success) {
                    showNotification('success', `Monthly reset completed! ${response.results.users_processed} users received ${response.results.total_allowance_given} total heartbits.`);
                    loadUsersWithHeartbits();
                  } else {
                    showNotification('error', 'Failed to trigger monthly reset. Please try again.');
                  }
                } catch (error) {
                  console.error('Error triggering monthly reset:', error);
                  showNotification('error', 'Failed to trigger monthly reset. Please check your connection and try again.');
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="px-2 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Monthly Reset
          </button>
        </div>
      </div>

      {/* Results Summary & Bulk Actions */}
      <div className="mt-1 pt-1 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          {selectedUsers.length > 0 && (
            <span className="text-[#0097b2] font-medium">
              {selectedUsers.length} selected
            </span>
          )}
        </div>
        
        {/* Compact Bulk Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          
          {selectedUsers.length > 0 && (
            <div className="flex-1 flex justify-end">
              <button 
                onClick={() => setShowBulkUpdateModal(true)}
                className="px-6 py-3 bg-[#0097b2] text-white rounded-xl shadow-lg hover:bg-[#007a8e] text-base font-bold transition-all duration-200 flex items-center gap-3"
                style={{ minWidth: '220px' }}
              >
                <HeartIcon className="w-6 h-6" />
                Give to Selected ({selectedUsers.length})
              </button>
            </div>
          )}
          
        </div>
      </div>

      {/* Users Table - only this is scrollable */}
      <div className="bg-white rounded-lg border border-gray-150 overflow-hidden">
        <div className="users-table-container grid grid-cols-3 gap-6 p-6" style={{ maxHeight: '58vh', overflowY: 'auto', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 40%, #f093fb 80%, #f5576c 100%)', borderRadius: '1rem' }}>
          {sortedUsers.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No users found</p>
              <p className="text-sm">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'No users are currently registered in the system.'}
              </p>
            </div>
          ) : (
            sortedUsers.map(user => {
              const isSelected = selectedUsers.includes(user.user_id);
              return (
                <div
                key={user.user_id}
                className={`relative bg-white rounded-xl shadow-md flex flex-col items-center p-5 transition-all duration-200 border border-gray-100 cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                style={{ minHeight: '120px' }}
                onClick={() => toggleUserSelection(user.user_id)}
                >
                  {/* Checkbox circle */}
                  <div className="absolute top-4 right-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-purple-400 bg-white ${isSelected ? 'bg-gradient-to-br from-purple-500 to-pink-400 border-purple-500' : ''}`}
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'background 0.2s' }}
                    >
                      {isSelected && (
                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      )}
                    </span>
                  </div>
                  {/* Avatar */}
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                    className="w-12 h-12 rounded-full object-cover mb-3"
                  />
                  {/* Name & Role */}
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-base">{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</div>
                    <div className="text-sm text-gray-500">{getRoleLabel(user.user_type)}</div>
                  </div>
                  {/* Heartbits */}
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <HeartIcon className="h-4 w-4 text-pink-400" />
                    <span className="font-medium text-[#0097b2]">{user.heartbits_balance || 0}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Summary Box */}
        <div className="w-full text-center py-4 text-lg font-medium text-gray-700">
          {selectedUsers.length > 0 ? (
            <>You have selected <span className="text-purple-600">{selectedUsers.length}</span> to be given heartbits</>
          ) : (
            <>Select users to send Heartbits</>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Global Limit Modal */}
      {showGlobalLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Global Monthly Limit</h3>
            <div className="mb-4">
              <label htmlFor="global-limit-input" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Limit (heartbits)
              </label>
              <input
                id="global-limit-input"
                type="number"
                value={globalLimit}
                onChange={(e) => setGlobalLimit(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGlobalLimitModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSetGlobalLimit(globalLimit);
                  setShowGlobalLimitModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e]"
              >
                Set Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Give Heartbits to Selected Users</h3>
            <div className="mb-4">
              <label htmlFor="bulk-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Give
              </label>
              <input
                id="bulk-amount"
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bulk-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                id="bulk-reason"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
                placeholder="Explain why you're giving heartbits..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amount = parseInt(document.getElementById('bulk-amount').value);
                  const reason = document.getElementById('bulk-reason').value;
                  if (amount && reason) {
                    handleBulkGiveHeartbits(amount, reason);
                    setShowBulkUpdateModal(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e]"
              >
                Give Heartbits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHeartbitsManagement;