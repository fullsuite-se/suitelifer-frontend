import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pointsShopApi } from '../../api/pointsShopApi';
import { useStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import {
  StarIcon,
  GiftIcon,
  ChartBarIcon,
  PlusIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';

const PointsDashboard = () => {
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();
  const [cheerModalOpen, setCheerModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [cheerAmount, setCheerAmount] = useState(10);
  const [cheerMessage, setCheerMessage] = useState('');

  // Safe date formatting function
  const formatDateSafely = (dateValue) => {
    try {
      if (!dateValue) return 'No date';
      
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for value:', dateValue);
      return 'Invalid date';
    }
  };

  // Get user avatar utility function
  const getUserAvatar = (transaction) => {
    if (transaction.related_user_avatar) {
      return transaction.related_user_avatar;
    }
    return '/images/default-avatar.png'; // Default avatar fallback
  };

  // Fetch user's points data
  const { data: pointsData, isLoading: pointsLoading, error: pointsError } = useQuery({
    queryKey: ['points'],
    queryFn: pointsShopApi.getPoints,
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!user?.id, // Only fetch when user is loaded
  });

  // Debug logging
  console.log('PointsDashboard Debug:', {
    user: user?.id ? 'Loaded' : 'Not loaded',
    pointsData,
    pointsLoading,
    pointsError: pointsError?.message
  });

  // Fetch points history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['points-history'],
    queryFn: () => {
      console.log('Fetching points history...');
      return pointsShopApi.getPointsHistory(10);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!user?.id, // Only fetch when user is loaded
    onSuccess: (data) => {
      console.log('Points history received:', data);
    },
  });

  // Fetch users for cheer functionality with search
  const { data: usersData } = useQuery({
    queryKey: ['users-search', ''],
    queryFn: () => pointsShopApi.searchUsers(''),
    enabled: false, // Only fetch when needed
    staleTime: 30 * 1000, // 30 seconds
  });

  // Send cheer mutation
  const cheerMutation = useMutation({
    mutationFn: ({ recipientId, amount, message }) =>
      pointsShopApi.sendCheer(recipientId, amount, message),
    onSuccess: () => {
      toast.success('Cheer sent successfully! 🎉');
      setCheerModalOpen(false);
      setSelectedUser('');
      setCheerMessage('');
      setCheerAmount(10);
      // Refresh points data
      queryClient.invalidateQueries(['points']);
      queryClient.invalidateQueries(['points-history']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send cheer');
    },
  });

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>Loading user data...</div>
      </div>
    );
  }

  const handleSendCheer = (e) => {
    e.preventDefault();
    if (!selectedUser || cheerAmount < 1) {
      toast.error('Please select a user and enter a valid amount');
      return;
    }

    cheerMutation.mutate({
      recipientId: selectedUser,
      amount: cheerAmount,
      message: cheerMessage,
    });
  };

  if (pointsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0097b2' }}></div>
      </div>
    );
  }

  if (pointsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg font-semibold mb-2" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif', fontWeight: '700' }}>Error Loading Points</div>
        <div className="text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>{pointsError.message}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-white px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#0097b2', fontFamily: 'Avenir, sans-serif' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#007a92'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0097b2'}
        >
          Retry
        </button>
      </div>
    );
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <GiftIcon className="w-5 h-5" style={{ color: '#1a0202' }} />;
      case 'given':
        return <HeartIconSolid className="w-5 h-5" style={{ color: '#0097b2' }} />;
      case 'received':
        return <HeartIconSolid className="w-5 h-5" style={{ color: '#bfd1a0' }} />;
      case 'admin_grant':
      case 'admin_added':
        return <PlusIcon className="w-5 h-5" style={{ color: '#0097b2' }} />;
      case 'admin_deduct':
        return <PlusIcon className="w-5 h-5" style={{ color: '#1a0202' }} />;
      default:
        return <StarIcon className="w-5 h-5" style={{ color: '#0097b2' }} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(255,255,255)' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Header content can be added here if needed in the future */}
        </div>

      {/* Points Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="rounded-xl p-6 text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', borderRadius: '18px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-90" style={{ fontFamily: 'Avenir, sans-serif' }}>Current Balance</p>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.currentBalance || 0}</p>
              <p className="text-white text-xs opacity-80" style={{ fontFamily: 'Avenir, sans-serif' }}>Points</p>
            </div>
            {/* Star icon for balance, white fill */}
            <StarIconSolid className="w-12 h-12" style={{ color: '#ffffff' }} />
          </div>
        </div>

        {/* Heartbits Remaining */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff', borderRadius: '18px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-90" style={{ fontFamily: 'Avenir, sans-serif' }}>Heartbits Remaining</p>
              <p className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>
                {(pointsData?.data?.monthlyCheerLimit || 100) - (pointsData?.data?.monthlyCheerUsed || 0)}
              </p>
              <p className="text-white text-xs opacity-80" style={{ fontFamily: 'Avenir, sans-serif' }}>This Month</p>
            </div>
            <HeartIconSolid className="w-12 h-12" style={{ color: '#ffffff' }} />
          </div>
        </div>

        {/* Total Earned */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', color: '#ffffff', borderRadius: '18px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-90" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Earned</p>
              <p className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.totalEarned || 0}</p>
              <p className="text-white text-xs opacity-80" style={{ fontFamily: 'Avenir, sans-serif' }}>All Time</p>
            </div>
            <TrophyIcon className="w-12 h-12" style={{ color: '#ffffff' }} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-xl p-6 text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', borderRadius: '18px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-90" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Spent</p>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.totalSpent || 0}</p>
              <p className="text-white text-xs opacity-80" style={{ fontFamily: 'Avenir, sans-serif' }}>Points</p>
            </div>
            <GiftIcon className="w-12 h-12" style={{ color: '#ffffff' }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #e0f7fa 70%, #b3e0f2 100%)', border: '2px solid #b3e0f2' }}>
        <div style={{ borderColor: '#b3e0f2', maxHeight: '600px', overflowY: 'auto' }} className="divide-y">{/* divide-gray-200 replaced with inline style */}
          {historyLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#0097b2' }}></div>
            </div>
          ) : Array.isArray(historyData?.data) && historyData.data.length > 0 ? (
            historyData.data.map((transaction, index) => {
              // Patch: Always show sender as 'Admin' for admin grants
              const isAdminGrant = transaction.type === 'admin_grant' || transaction.is_admin_grant;
              const senderLabel = isAdminGrant ? 'Admin' : (transaction.related_user || 'Unknown');
              return (
                <div 
                  key={index} 
                  className="relative p-4"
                  style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)', borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #e0e7ef' }}
                >
                  {/* Shiny green accent bar */}
                  <div
                    style={{
                      width: '8px',
                      height: '80%',
                      position: 'absolute',
                      left: '2px',
                      top: '10%',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderTopRightRadius: '10px',
                      borderBottomRightRadius: '10px',
                      background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)',
                    }}
                  />
                  <div className="flex items-center justify-between" style={{ marginLeft: '10px' }}>
                    <div className="flex items-center gap-3">
                      {isAdminGrant ? (
                        <HeartIconSolid className="w-8 h-8" style={{ color: '#ef4444' }} />
                      ) : transaction.related_user ? (
                        <img
                          src={getUserAvatar(transaction)}
                          alt={transaction.related_user}
                          className="w-14 h-14 rounded-full object-cover"
                          style={{ border: '2px solid #0097b2' }}
                        />
                      ) : (
                        <span style={{fontSize:'2rem',color:'#0097b2',fontWeight:900}}>+</span>
                      )}
                      <div>
                        <p className="font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                          {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
                          {formatDateSafely(transaction.createdAt || transaction.created_at)}
                        </p>
                        {/* Show message for admin grants, and for received/given cheers if message exists */}
                        {(isAdminGrant || ((['received','given'].includes(transaction.type)) && transaction.message)) && (
                          <div className="mt-1 p-2 rounded-lg" style={{ backgroundColor: '#e6f7ff', border: '1px solid #0097b2' }}>
                            <p className="text-sm" style={{ color: '#0097b2', fontFamily: 'Avenir, sans-serif' }}>
                              &ldquo;{transaction.message || ''}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdminGrant && (
                      <div className="text-right">
                        <p
                          className="font-semibold"
                          style={{
                            color:
                              transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct'
                                ? '#ef4444'
                                : '#22c55e',
                            fontFamily: 'Avenir, sans-serif',
                          }}
                        >
                          {transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct' ? '-' : ''}
                          {transaction.amount}
                          {transaction.type === 'received' || transaction.type === 'given' ? ' bits' : ' pts'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#dc2626', fontFamily: 'Avenir, sans-serif', fontWeight: 'bold' }}>
                          from Admin
                        </p>
                      </div>
                    )}
                    {!isAdminGrant && (
                      <div className="text-right">
                        <p
                          className="font-semibold"
                          style={{
                            color:
                              transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct'
                                ? '#ef4444'
                                : '#22c55e',
                            fontFamily: 'Avenir, sans-serif',
                          }}
                        >
                          {transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct' ? '-' : '+'}
                          {transaction.amount}
                          {transaction.type === 'received' || transaction.type === 'given' ? ' bits' : ' pts'}
                        </p>
                        {transaction.related_user && (
                          <p className="text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
                            {transaction.type === 'given' ? 'to' : 'from'} {senderLabel}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center" style={{ color: '#4a6e7e' }}>
              <ChartBarIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#eee3e3' }} />
              <p style={{ fontFamily: 'Avenir, sans-serif' }}>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Heartbits Modal */}
      {cheerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HeartIconSolid className="w-6 h-6" style={{ color: '#0097b2' }} />
              Send Heartbits
            </h3>
            <form onSubmit={handleSendCheer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-4 focus:ring-[#0097b2] focus:border-transparent"
                  required
                >
                  <option value="">Choose a user...</option>
                  {Array.isArray(usersData) && usersData.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Points)
                </label>
                <input
                  type="number"
                  min="1"
                  max={pointsData?.data?.currentBalance || 0}
                  value={cheerAmount}
                  onChange={(e) => setCheerAmount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-4 focus:ring-[#0097b2] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={cheerMessage}
                  onChange={(e) => setCheerMessage(e.target.value)}
                  placeholder="Add a nice message..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-4 focus:ring-[#0097b2] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCheerModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cheerMutation.isPending}
                  className="flex-1 text-white px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)',
                    fontFamily: 'Avenir, sans-serif',
                    minWidth: '140px',
                    opacity: cheerMutation.isPending ? 0.5 : 1
                  }}
                >
                  {cheerMutation.isPending ? 'Sending...' : 'Send Heartbits'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PointsDashboard;
