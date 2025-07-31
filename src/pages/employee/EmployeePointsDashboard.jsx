import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pointsSystemApi } from '../../api/pointsSystemApi';
import { useStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import {
  StarIcon,
  GiftIcon,
  ChartBarIcon,
  PlusIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
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
  const [moderationNotification, setModerationNotification] = useState(null);

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

  // Check for moderation notifications in transaction history
  const checkForModerationNotifications = useCallback((transactions) => {
    if (!transactions || !Array.isArray(transactions)) {
      return;
    }
    
    const moderationTransactions = transactions.filter(t => {
      const isModeration = t.type === 'moderation';
      const hasModerationMessage = t.type === 'notification' && t.message?.includes('moderated');
      return isModeration || hasModerationMessage;
    });
    
    if (moderationTransactions.length > 0) {
      const latestModeration = moderationTransactions[0]; // Most recent first
      
      // Get the transaction ID from the correct field
      const transactionId = latestModeration.transactionId || latestModeration.transaction_id;
      
      // Check if this notification has been dismissed in the database
      let metadata = latestModeration.metadata;
      if (typeof metadata === 'string') {
        try {
          metadata = JSON.parse(metadata);
        } catch (e) {
          metadata = {};
        }
      }
      
      const isDismissed = metadata?.dismissed === true;
      
      if (isDismissed) {
        return; // Skip if already dismissed
      }
      
      const action = metadata?.action || 'moderated';
      const actionText = action === 'hidden' ? 'hidden' : action === 'deleted' ? 'deleted' : action === 'unhidden' ? 'restored' : 'moderated';
      
      setModerationNotification({
        type: 'moderation',
        message: latestModeration.message || `Your cheer post has been ${actionText} by our moderation team.`,
        reason: metadata?.reason || 'No reason provided',
        date: latestModeration.created_at,
        action: action,
        transactionId: transactionId
      });
    }
  }, []);

  // Fetch user's points data
  const { data: pointsData, isLoading: pointsLoading, error: pointsError } = useQuery({
    queryKey: ['points'],
    queryFn: pointsSystemApi.getPoints,
    staleTime: 10 * 1000, // 10 seconds (reduced from 1 minute)
    enabled: !!user?.id, // Only fetch when user is loaded
  });

  // Listen for storage events to refresh points data when orders are cancelled
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'points-updated' && e.newValue === 'true') {
        // Invalidate points cache when orders are cancelled
        queryClient.invalidateQueries(['points']);
        queryClient.invalidateQueries(['points-history']);
        // Clear the flag
        localStorage.removeItem('points-updated');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient]);

  // Fetch points history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['points-history'],
    queryFn: () => pointsSystemApi.getPointsHistory(50), // Increased limit to show up to 50 transactions
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!user?.id, // Only fetch when user is loaded
  });



  // Check for moderation notifications when history data changes
  useEffect(() => {
    if (historyData?.data) {
      checkForModerationNotifications(historyData.data);
    }
  }, [historyData, checkForModerationNotifications]);

  // Fetch users for cheer functionality with search
  const { data: usersData } = useQuery({
    queryKey: ['users-search', ''],
    queryFn: () => pointsSystemApi.searchUsers(''),
    enabled: false, // Only fetch when needed
    staleTime: 30 * 1000, // 30 seconds
  });

  // Send cheer mutation
  const cheerMutation = useMutation({
    mutationFn: ({ recipientId, amount, message }) =>
      pointsSystemApi.sendCheer(recipientId, amount, message),
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097b2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
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
    <div className="min-h-screen bg-white py-8">
      {/* Moderation Notification Banner */}
      {moderationNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
          <div className={`relative overflow-hidden rounded-lg shadow-md transform transition-all duration-200 ease-out animate-in slide-in-from-top-1 ${
            moderationNotification.action === 'hidden' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-3 border-amber-400' :
            moderationNotification.action === 'deleted' ? 'bg-gradient-to-r from-red-50 to-rose-50 border-l-3 border-red-500' :
            'bg-gradient-to-r from-green-50 to-teal-50 border-l-3 border-green-500'
          }`}>
            <div className="relative p-2">
              <div className="flex items-start gap-2">
                {/* Content area */}
                <div className="flex-1 min-w-0">
                  {/* Header with X button in upper right */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Icon beside title */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        moderationNotification.action === 'hidden' ? 'bg-amber-100 text-amber-600' :
                        moderationNotification.action === 'deleted' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {moderationNotification.action === 'hidden' ? (
                          <ExclamationTriangleIcon className="h-4 w-4 animate-pulse" />
                        ) : moderationNotification.action === 'deleted' ? (
                          <ExclamationTriangleIcon className="h-4 w-4 animate-pulse" />
                        ) : (
                          <ExclamationTriangleIcon className="h-4 w-4 animate-pulse" />
                        )}
                      </div>
                      <h3 className={`text-sm font-bold truncate ${
                        moderationNotification.action === 'hidden' ? 'text-amber-800' :
                        moderationNotification.action === 'deleted' ? 'text-red-800' :
                        'text-green-800'
                      }`}>
                        {moderationNotification.action === 'hidden' ? 'Hidden Post' : 
                         moderationNotification.action === 'deleted' ? 'Deleted Post' : 
                         moderationNotification.action === 'unhidden' ? 'Restored Post' : 
                         'Moderated Post'}
                      </h3>
                    </div>
                    
                    {/* Close button in upper right */}
                    <button
                      type="button"
                      onClick={() => setModerationNotification(null)}
                      className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                        moderationNotification.action === 'hidden' ? 'text-amber-500 hover:bg-amber-100' :
                        moderationNotification.action === 'deleted' ? 'text-red-500 hover:bg-red-100' :
                        'text-green-500 hover:bg-green-100'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Message and reason with Got it button in bottom right */}
                  <div className="ml-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          moderationNotification.action === 'hidden' ? 'text-amber-700' :
                          moderationNotification.action === 'deleted' ? 'text-red-700' :
                          'text-green-700'
                        }`}>
                          {moderationNotification.message}
                        </p>
                        
                        {/* Reason */}
                        {moderationNotification.reason && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-1 h-1 rounded-full ${
                              moderationNotification.action === 'hidden' ? 'bg-amber-500' :
                              moderationNotification.action === 'deleted' ? 'bg-red-500' :
                              'bg-green-500'
                            }`}></div>
                            <p className={`text-sm ${
                              moderationNotification.action === 'hidden' ? 'text-amber-600' :
                              moderationNotification.action === 'deleted' ? 'text-red-600' :
                              'text-green-600'
                            }`}>
                              {moderationNotification.reason}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action button in bottom right */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (moderationNotification?.transactionId) {
                            try {
                              await pointsSystemApi.dismissModerationNotification(moderationNotification.transactionId);
                              setModerationNotification(null);
                              queryClient.invalidateQueries(['points-history']);
                            } catch (error) {
                              setModerationNotification(null);
                            }
                          } else {
                            setModerationNotification(null);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex-shrink-0 self-end ${
                          moderationNotification.action === 'hidden' ? 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500' :
                          moderationNotification.action === 'deleted' ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' :
                          'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Header content can be added here if needed in the future */}
        </div>

      {/* Points Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Balance */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
             style={{ 
               background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
               borderRadius: '18px'
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#1e40af', fontFamily: 'Avenir, sans-serif' }}>Current Balance</p>
              <p className="text-3xl font-bold" style={{ color: '#1e40af', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.currentBalance || 0}</p>
              <p className="text-xs opacity-80" style={{ color: '#1e40af', fontFamily: 'Avenir, sans-serif' }}>Points</p>
            </div>
            {/* Star icon for balance */}
            <StarIconSolid className="w-12 h-12" style={{ color: '#1e40af' }} />
          </div>
        </div>

        {/* Heartbits Remaining */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
             style={{ 
               background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
               borderRadius: '18px'
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#059669', fontFamily: 'Avenir, sans-serif' }}>Heartbits Remaining</p>
              <p className="text-3xl font-bold" style={{ color: '#059669', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>
                {(pointsData?.data?.monthlyCheerLimit || 100) - (pointsData?.data?.monthlyCheerUsed || 0)}
              </p>
              <p className="text-xs opacity-80" style={{ color: '#059669', fontFamily: 'Avenir, sans-serif' }}>This Month</p>
            </div>
            <HeartIconSolid className="w-12 h-12" style={{ color: '#059669' }} />
          </div>
        </div>

        {/* Total Earned */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
             style={{ 
               background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', 
               borderRadius: '18px'
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#92400e', fontFamily: 'Avenir, sans-serif' }}>Total Earned</p>
              <p className="text-3xl font-bold" style={{ color: '#92400e', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.totalEarned || 0}</p>
              <p className="text-xs opacity-80" style={{ color: '#92400e', fontFamily: 'Avenir, sans-serif' }}>All Time</p>
            </div>
            <TrophyIcon className="w-12 h-12" style={{ color: '#92400e' }} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
             style={{ 
               background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)', 
               borderRadius: '18px'
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#dc2626', fontFamily: 'Avenir, sans-serif' }}>Total Spent</p>
              <p className="text-3xl font-bold" style={{ color: '#dc2626', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>{pointsData?.data?.totalSpent || 0}</p>
              <p className="text-xs opacity-80" style={{ color: '#dc2626', fontFamily: 'Avenir, sans-serif' }}>Points</p>
            </div>
            <GiftIcon className="w-12 h-12" style={{ color: '#dc2626' }} />
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
            historyData.data
              .filter(transaction => {
                if (transaction.type === 'moderation') return false;
                if (transaction.type === 'given') return transaction.fromUserId === user.id;
                if (transaction.type === 'received') return transaction.toUserId === user.id;
                return true; // keep all other types
              })
              .map((transaction, index) => {
              // Check if this is an admin grant transaction
              const isAdminGrant = transaction.type === 'admin_grant' || transaction.type === 'admin_added';

              
              const senderLabel = isAdminGrant ? 'Admin' : (transaction.related_user || 'Unknown');
              
              // Handle transaction descriptions
              let displayDescription = transaction.description;
              
              // For received transactions, show "Heartbits" instead of "points"
              if (transaction.type === 'received' && transaction.description && transaction.description.includes('points')) {
                displayDescription = transaction.description.replace('points', 'Heartbits');
              }
              
              // For received transactions, show the actual sender name instead of "Admin"
              if (transaction.type === 'received' && transaction.description && transaction.description.includes('from Admin')) {
                displayDescription = displayDescription.replace('from Admin', `from ${transaction.related_user || 'Unknown'}`);
              }
              
              // For given transactions, ensure proper description
              if (transaction.type === 'given' && !displayDescription) {
                displayDescription = `Cheered ${transaction.amount} heartbits`;
              }
              
              // For received transactions, ensure proper description
              if (transaction.type === 'received' && !displayDescription) {
                displayDescription = `Received ${transaction.amount} heartbits`;
              }
              
              // For admin grants, ensure proper description
              if (isAdminGrant && !displayDescription) {
                displayDescription = `Received ${transaction.amount} points from Admin`;
              }
              
              return (
                <div 
                  key={index} 
                  className="relative p-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)', 
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '18px',
                    borderBottomLeftRadius: '18px',
                    borderBottomRightRadius: '18px',
                    overflow: 'hidden', 
                    border: '1.5px solid #e0e7ef' 
                  }}
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
                          {displayDescription || transaction.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
                          {formatDateSafely(transaction.createdAt || transaction.created_at)}
                        </p>
                        {/* Show message for admin grants, and for received/given cheers if message exists */}
                        {(isAdminGrant || ((['received','given'].includes(transaction.type)) && transaction.message)) && (
                          <div className="mt-1 px-2 py-1 inline-block" style={{ 
                            backgroundColor: '#eff6ff', 
                            border: '1px solid #3b82f6',
                            borderTopLeftRadius: '0px',
                            borderTopRightRadius: '6px',
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px'
                          }}>
                            <p className="text-sm" style={{ color: '#1e40af', fontFamily: 'Avenir, sans-serif' }}>
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
                          {transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct' ? '-' : '+'}
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
