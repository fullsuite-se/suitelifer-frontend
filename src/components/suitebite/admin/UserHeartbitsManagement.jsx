import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
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
  MinusIcon
} from '@heroicons/react/24/outline';

const UserHeartbitsManagement = () => {
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
    loadSystemConfiguration();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const loadSystemConfiguration = async () => {
    try {
      const response = await suitebiteAPI.getSystemConfiguration();
      if (response.success && response.config) {
        const defaultLimit = response.config.default_monthly_limit ? 
          parseInt(response.config.default_monthly_limit.value) : 1000;
        setGlobalLimit(defaultLimit);
      }
    } catch (error) {
      console.error('Error loading system configuration:', error);
    }
  };

  const loadUsersWithHeartbits = async () => {
    try {
      setLoading(true);
      const response = await suitebiteAPI.getUsersWithHeartbits();
      
      if (response.success) {
        setUsers(response.users);
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
      if (updates.balance !== undefined) {
        const response = await suitebiteAPI.updateUserHeartbits(userId, updates.balance, reason);
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
      const currentMonth = new Date().toISOString().slice(0, 7);
      const updatePromises = users.map(user => 
        suitebiteAPI.setMonthlyLimit(user.user_id, parseInt(newLimit), currentMonth)
      );
      
      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failCount = results.length - successCount;
      
      if (failCount === 0) {
        // Also update the system configuration
        try {
          await suitebiteAPI.updateSystemConfiguration('default_monthly_limit', newLimit, 'Updated by admin via global limit setting');
        } catch (configError) {
          console.error('Error updating system configuration:', configError);
        }
        
        setGlobalLimit(newLimit);
        loadUsersWithHeartbits();
        showNotification('success', `Global monthly limit updated to ${newLimit} heartbits for all ${successCount} users!`);
      } else {
        showNotification('warning', `Partial success: ${successCount} users updated, ${failCount} failed. Please try again for failed users.`);
      }
    } catch (error) {
      console.error('Error updating global limit:', error);
      showNotification('error', 'Failed to update global limit. Please check your connection and try again.');
    }
  };

  const handleBulkGiveHeartbits = async (amount, reason) => {
    try {
      const updatePromises = selectedUsers.map(userId => 
        suitebiteAPI.updateUserHeartbits(userId, amount, reason)
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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

  return (
    <div className="user-heartbits-management bg-gray-50 min-h-screen p-6">
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

      {/* Enhanced Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        
        {/* Info Section */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CogIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Automatic Monthly Reset</h3>
              <p className="text-sm text-blue-700 mb-2">
                Every first day of the month at 00:01, the system automatically resets all users' monthly limits and gives them their {globalLimit} heartbits allowance.
              </p>
              <p className="text-xs text-blue-600">
                💡 You can manually trigger this process using the "Trigger Monthly Reset" button below for testing purposes.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Section */}
          <div className="flex-1">
            <label htmlFor="user-search" className="sr-only">Search users</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="user-search"
                name="user-search"
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
                aria-describedby="search-help"
              />
            </div>
            <div id="search-help" className="sr-only">
              Enter name or email to filter the user list
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                id="sort-by"
                name="sort-by"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
                aria-describedby="sort-help"
              >
                <option value="name">Name (A-Z)</option>
                <option value="points">Points</option>
              </select>
              <div id="sort-help" className="sr-only">
                Choose how to sort the user list
              </div>
            </div>
            
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm font-medium"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>



            {/* Reset All Button */}
            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm font-medium flex items-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>



        {/* Results Summary & Bulk Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {searchTerm && <span className="ml-2">• Filtered by "{searchTerm}"</span>}
            </span>
            {selectedUsers.length > 0 && (
              <span className="text-[#0097b2] font-medium">
                {selectedUsers.length} selected
              </span>
            )}
          </div>
          
          {/* Enhanced Bulk Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">User Selection:</span>
              <button 
                onClick={selectAllUsers}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <CheckIcon className="w-4 h-4" />
                {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedUsers.length > 0 && (
                <button 
                  onClick={() => setShowBulkUpdateModal(true)}
                  className="px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <HeartIcon className="w-4 h-4" />
                  Give Heartbits to Selected ({selectedUsers.length})
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Global Limit: {globalLimit} heartbits</span>
              <button
                onClick={() => setShowGlobalLimitModal(true)}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <CogIcon className="w-4 h-4" />
                Edit Limit
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm(`Trigger monthly reset and give all users their ${globalLimit} heartbits monthly allowance? This simulates the automatic first-day-of-month process.`)) {
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
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Trigger Monthly Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ArrowPathIcon className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097b2] mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <label htmlFor="select-all-users" className="sr-only">Select all users</label>
                    <input
                      id="select-all-users"
                      name="select-all-users"
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="w-4 h-4 text-[#0097b2] border-gray-300 rounded focus:ring-[#0097b2]"
                      aria-describedby="select-all-help"
                    />
                    <div id="select-all-help" className="sr-only">
                      Toggle selection for all visible users
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Heartbits</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No users found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? 'Try adjusting your search criteria.' 
                          : 'No users are currently registered in the system.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map(user => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <label htmlFor={`select-user-${user.user_id}`} className="sr-only">
                          Select {`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                        </label>
                        <input
                          id={`select-user-${user.user_id}`}
                          name={`select-user-${user.user_id}`}
                          type="checkbox"
                          checked={selectedUsers.includes(user.user_id)}
                          onChange={() => toggleUserSelection(user.user_id)}
                          className="w-4 h-4 text-[#0097b2] border-gray-300 rounded focus:ring-[#0097b2]"
                          aria-describedby={`select-user-help-${user.user_id}`}
                        />
                        <div id={`select-user-help-${user.user_id}`} className="sr-only">
                          Toggle selection for {`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={user.avatar || '/default-avatar.png'} 
                            alt={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover" 
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</div>
                            <div className="text-sm text-gray-500">{user.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.user_type === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.user_type === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.user_type || 'EMPLOYEE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <HeartIcon className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">{user.heartbits_balance || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-[#0097b2] hover:text-[#007a8e] text-sm font-medium transition-colors duration-200"
                        >
                          Give Heartbits
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Global Limit Modal */}
      {showGlobalLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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