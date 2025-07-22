import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pointsShopApi } from '../../api/pointsShopApi';
import { useStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  TrophyIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import { formatFullDateTime } from '../../utils/dateHelpers';
// Remove import { motion, AnimatePresence } from 'framer-motion';
// Remove confettiAnimating state and all setConfettiAnimating logic
// Remove confettiColor function

const CheerPage = () => {
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();
  
  // Form state
  const [cheerText, setCheerText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [cheerPoints, setCheerPoints] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feed interaction state
  const [activeTab, setActiveTab] = useState('weekly');
  const [commentingCheer, setCommentingCheer] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedCheers, setLikedCheers] = useState(new Set());
  const [cheerComments, setCheerComments] = useState(new Map());
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMoreLeaderboard, setShowMoreLeaderboard] = useState(false);
  const COMMENTS_PAGE_SIZE = 20;
  
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Add state for confetti animation
  // Remove Framer Motion imports
  // Remove likeCheerAnimating, likeCommentAnimating, likedCommentIds, handleCheerLike, handleCommentLike
  // Restore main cheer card like button:
  // Restore comment like button:

  // Helper for triggering animation
  // Remove Framer Motion imports
  // Remove likeCheerAnimating, likeCommentAnimating, likedCommentIds, handleCheerLike, handleCommentLike
  // Restore main cheer card like button:
  // Restore comment like button:


  // Add state for date filter
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch cheer statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({

  // Fetch cheer statistics (removed unused variable)
  //const { isLoading: statsLoading } = useQuery({

    queryKey: ['cheer-stats'],
    queryFn: pointsShopApi.getCheerStats,
    staleTime: 2 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Fetch user points
  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ['points'],
    queryFn: pointsShopApi.getPoints,
    staleTime: 1 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Update cheer feed query to use selectedDate
  const { data: cheerFeed, isLoading: feedLoading, refetch: refetchCheerFeed } = useQuery({
    queryKey: ['cheer-feed', selectedDate],
    queryFn: () => {
      if (selectedDate) {
        // Get start and end of selected day in ISO format
        const from = new Date(selectedDate);
        from.setHours(0, 0, 0, 0);
        const to = new Date(selectedDate);
        to.setHours(23, 59, 59, 999);
        return pointsShopApi.getCheerFeed(20, from.toISOString(), to.toISOString());
      } else {
        return pointsShopApi.getCheerFeed(20);
      }
    },
    staleTime: 1 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Fetch leaderboard
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard', activeTab, user?.id],
    queryFn: () => pointsShopApi.getLeaderboard(activeTab, user?.id),
    staleTime: 2 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Process leaderboard data
  const leaderboard = leaderboardData?.data || [];
  const currentUserLeaderboard = leaderboardData?.currentUser || null;

  // Debug logs
  useEffect(() => {
    console.log('Debug Leaderboard:', {
      currentUserLeaderboard,
      leaderboard,
      userId: user?.id,
      activeTab
    });
  }, [currentUserLeaderboard, leaderboard, user?.id, activeTab]);

  // User search for @ mentions
  const { data: searchResults = [] } = useQuery({
    queryKey: ['user-search', searchQuery],
    queryFn: () => pointsShopApi.searchUsers(searchQuery),
    enabled: searchQuery.length >= 1 && (!!user && Object.keys(user).length > 0),
    staleTime: 30 * 1000,
  });

  // Bulk cheer mutation for multiple recipients
  const bulkCheerMutation = useMutation({
    mutationFn: ({ recipientId, amount, message }) =>
      pointsShopApi.sendCheer(recipientId, amount, message),
  });

  // Heart cheer mutation
  const likeMutation = useMutation({
    mutationFn: (cheerId) => pointsShopApi.toggleCheerLike(cheerId),
    onSuccess: (data, cheerId) => {
      console.log('likeMutation.onSuccess', { data, cheerId });
      setLikedCheers(prev => {
        const newSet = new Set(prev);
        if (data.liked || data.success) {
          newSet.add(cheerId);
          // setConfettiAnimating(prev => ({ ...prev, [cheerId]: true })); // Removed
          // setTimeout(() => { // Removed
          //   setConfettiAnimating(prev => ({ ...prev, [cheerId]: false })); // Removed
          // }, 800); // Removed
          console.log('Confetti triggered for', cheerId);
        } else {
          newSet.delete(cheerId);
        }
        return newSet;
      });
      
      queryClient.invalidateQueries(['cheer-feed']);
    },
    onError: (error) => {
      console.error('likeMutation.onError', error);
      toast.error('Failed to update heart');
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ cheerId, comment }) => pointsShopApi.addCheerComment(cheerId, comment),
    onSuccess: (data, variables) => {
      console.log('Comment added successfully:', data);
      setCommentText('');
      setCheerComments(prev => {
        const newComments = new Map(prev);
        const existing = newComments.get(variables.cheerId);
        const existingArray = Array.isArray(existing) ? existing : [];
        
        const newComment = {
          _id: data.id || data._id,
          comment: data.comment,
          fromUser: {
            _id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            avatar: user.profile_pic
          },
          createdAt: data.created_at || data.createdAt
        };
        console.log('New comment object:', newComment);
        newComments.set(variables.cheerId, [newComment, ...existingArray]);
        return newComments;
      });
      queryClient.invalidateQueries(['cheer-feed']);
      toast.success('Comment added!');
    },
    onError: (error) => {
      console.error('Comment error:', error);
      toast.error('Failed to add comment');
    },
  });

  // Add state for editing comments
  const [editingComment, setEditingComment] = useState(null); // {cheerId, commentId}
  const [editCommentText, setEditCommentText] = useState('');

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: ({ cheerId, commentId, comment }) => pointsShopApi.updateCheerComment(cheerId, commentId, comment),
    onSuccess: (_, variables) => {
      setCheerComments(prev => {
        const newMap = new Map(prev);
        const data = newMap.get(variables.cheerId);
        if (data && Array.isArray(data.comments)) {
          data.comments = data.comments.map(c =>
            c._id === variables.commentId ? { ...c, comment: variables.comment } : c
          );
        }
        return newMap;
      });
      setEditingComment(null);
      setEditCommentText('');
      toast.success('Comment updated!');
    },
    onError: () => toast.error('Failed to update comment'),
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: ({ cheerId, commentId }) => pointsShopApi.deleteCheerComment(cheerId, commentId),
    onSuccess: (_, variables) => {
      setCheerComments(prev => {
        const newMap = new Map(prev);
        const data = newMap.get(variables.cheerId);
        if (data && Array.isArray(data.comments)) {
          data.comments = data.comments.filter(c => c._id !== variables.commentId);
        }
        return newMap;
      });
      toast.success('Comment deleted!');
    },
    onError: () => toast.error('Failed to delete comment'),
  });

  // Add state for delete confirmation
  const [confirmingDelete, setConfirmingDelete] = useState(null); // {cheerId, commentId}

  // Initialize hearted cheers state when feed data loads
  useEffect(() => {
    if (cheerFeed && Array.isArray(cheerFeed.data?.cheers)) {
      const likedCheerIds = new Set();
      cheerFeed.data.cheers.forEach(cheer => {
        if (cheer.userHearted || cheer.userLiked) {
          likedCheerIds.add(cheer.cheer_id);
        }
      });
      setLikedCheers(likedCheerIds);
    }
  }, [cheerFeed]);

  // Debug: log searchQuery and searchResults
  useEffect(() => {
    console.log('CheerPage - searchQuery:', searchQuery);
    console.log('CheerPage - searchResults:', searchResults);
  }, [searchQuery, searchResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to fetch comments for a specific cheer (with pagination)
  const fetchComments = async (cheerId, append = false) => {
    setLoadingComments(true);
    try {
      const prev = cheerComments.get(cheerId) || { comments: [], offset: 0, hasMore: true };
      const offset = append ? prev.offset : 0;
      const comments = await pointsShopApi.getCheerComments(cheerId, { limit: COMMENTS_PAGE_SIZE, offset });
      const newComments = Array.isArray(comments) ? comments : [];
      setCheerComments(prevMap => {
        const prevData = prevMap.get(cheerId) || { comments: [], offset: 0, hasMore: true };
        const merged = append
          ? [...prevData.comments, ...newComments]
          : newComments;
        return new Map(prevMap).set(cheerId, {
          comments: merged,
          offset: offset + newComments.length,
          hasMore: newComments.length === COMMENTS_PAGE_SIZE
        });
      });
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
      setCheerComments(prevMap => new Map(prevMap).set(cheerId, { comments: [], offset: 0, hasMore: false }));
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle comment button click
  const handleCommentClick = (cheerId) => {
    const isOpening = commentingCheer !== cheerId;
    setCommentingCheer(isOpening ? cheerId : null);
    if (isOpening) {
      fetchComments(cheerId, false);
    }
  };

  // Handle @ mention search in textarea
  const handleCheerTextChange = (e) => {
    const value = e.target.value;
    setCheerText(value);

    if (value.trim().length > 0) {
      setSearchQuery(value);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
      setSearchQuery('');
    }
  };

  const handleUserSelect = (user) => {
    setCheerText('');
    setSelectedUsers(prev => [...prev, user]);
    setShowUserDropdown(false);
  };

  const handleCheerSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    const totalHeartbitsNeeded = cheerPoints * selectedUsers.length;
    if (totalHeartbitsNeeded > availableHeartbits) {
      toast.error(`Not enough heartbits available. You need ${totalHeartbitsNeeded} heartbits to send ${cheerPoints} to ${selectedUsers.length} recipients, but you only have ${availableHeartbits} remaining.`);
      return;
    }
    setIsSubmitting(true);

    console.log('=== CHEER SUBMISSION DEBUG ===');
    console.log('Message text:', messageText);
    console.log('Selected users:', selectedUsers);
    console.log('Cheer points per user:', cheerPoints);
    console.log('Total heartbits needed:', totalHeartbitsNeeded);
    console.log('Available heartbits:', availableHeartbits);

    const sendCheersSequentially = async () => {
      let successCount = 0;
      let errorCount = 0;
      for (const user of selectedUsers) {
        try {
          const cheerData = {
            recipientId: user.user_id,
            amount: cheerPoints,
            message: messageText.trim(),
          };
          console.log('Cheer data:', cheerData);
          await bulkCheerMutation.mutateAsync(cheerData);
          successCount++;
          console.log(`✅ Cheer sent to ${user.name}`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to send cheer to ${user.name}:`, error);
        }
      }
      
      if (errorCount === 0) {
        console.log('All cheers sent successfully!');
        toast.success(`Cheers sent successfully to ${successCount} recipients! 🎉`);
        setSelectedUsers([]);
        setCheerText('');
        setMessageText('');
        setCheerPoints(1);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        queryClient.invalidateQueries(['points']);
        queryClient.invalidateQueries(['cheer-feed']);
        queryClient.invalidateQueries(['leaderboard']);
      } else if (successCount > 0) {
        toast.warning(`Sent ${successCount} cheers, but ${errorCount} failed.`);
      } else {
        toast.error('Failed to send any cheers. Please try again.');
      }
    };
    
    sendCheersSequentially()
      .catch(error => {
        console.error('Cheer submission failed:', error);
        const backendMsg = error?.response?.data?.message || error?.message || 'Failed to send cheers';
        toast.error(backendMsg);
      })
      .finally(() => {
        setIsSubmitting(false);
        console.log('=== END CHEER SUBMISSION DEBUG ===');
      });
  };

  const formatTimeAgo = (date) => {
    try {
      if (!date) return 'Unknown time';
      
      const now = new Date();
      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      const diffMs = now - dateObj;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (error) {
      console.error('Time formatting error:', error, 'for date:', date);
      return 'Invalid date';
    }
  };

  // Debug user authentication
  console.log('CheerPage - Current user:', user);

  // Show authentication debug info if user object is empty or undefined
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <HeartIconSolid className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please ensure you are logged in to access the Cheer a Peer feature.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const anyLoading = statsLoading || pointsLoading || feedLoading || leaderboardLoading;

  if (anyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-4 mx-auto mb-4" 
                 style={{ borderTopColor: '#0097b2' }}></div>
            <SparklesIcon className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                         style={{ color: '#0097b2' }} />
          </div>
          <p className="text-lg font-medium" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
            Loading your cheer dashboard...
          </p>
        </div>
      </div>
    );
  }

  const availableHeartbits = (pointsData?.data?.monthlyCheerLimit || 100) - (pointsData?.data?.monthlyCheerUsed || 0);
  const stats = statsData?.data || {};

  const feedRaw = Array.isArray(cheerFeed?.data?.cheers) ? cheerFeed.data.cheers : [];
  let feed = feedRaw;

  if (selectedDate) {
    feed = feedRaw.filter(post => {
      const postDate = new Date(post.createdAt || post.posted_at);
      // Compare only the date part in local time
      const yyyy = postDate.getFullYear();
      const mm = String(postDate.getMonth() + 1).padStart(2, '0');
      const dd = String(postDate.getDate()).padStart(2, '0');
      const postDateStr = `${yyyy}-${mm}-${dd}`;
      return postDateStr === selectedDate;
    });
  }


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Enhanced Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 animate-bounce" 
             style={{ 
               background: 'linear-gradient(135deg, #bfd1a0 0%, #0097b2 100%)',
               backdropFilter: 'blur(10px)'
             }}>
          <div className="flex items-center space-x-2">
            <HeartIconSolid className="w-6 h-6 animate-pulse" />
            <SparklesIcon className="w-5 h-5 animate-spin" />
          </div>
          <span className="font-semibold text-lg" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Cheer sent successfully! 🎉
          </span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create Cheer & Heartbits */}
          <div className="lg:col-span-1 space-y-8">
            {/* Create Cheer Form - Enhanced */}
            <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(135deg, #e0f7fa 70%, #b3e0f2 100%)', 
                   border: '2px solid #b3e0f2',
                   boxShadow: '0 10px 25px rgba(0, 151, 178, 0.10)'
                 }}>
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                     style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)' }}>
                  <HeartIconSolid className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold truncate" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                  Send Heartbits
                </h2>
              </div>

              <form onSubmit={handleCheerSubmit} className="space-y-5">
                {/* Enhanced Selected Users Display */}
                {selectedUsers.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" 
                           style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                      Selected Recipients ({selectedUsers.length}):
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {selectedUsers.map((user, index) => (
                        <div
                          key={user.user_id}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
                          style={{ 
                            backgroundColor: '#f0f9ff', 
                            border: '1px solid #0097b2',
                            boxShadow: '0 2px 4px rgba(0, 151, 178, 0.1)',
                            minWidth: 'fit-content'
                          }}
                        >
                          <img
                            src={user.avatar || '/images/default-avatar.png'}
                            alt={user.name}
                            className="w-6 h-6 rounded-full ring-1 ring-white flex-shrink-0"
                          />
                          <span className="text-xs font-semibold truncate max-w-20" 
                                style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                            {user.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedUsers(prev => prev.filter((_, i) => i !== index))}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200 flex-shrink-0"
                            style={{ backgroundColor: '#ef4444', fontSize: '10px' }}
                            aria-label={`Remove ${user.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Search Input */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold mb-2" 
                         style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                    Search Peers
                  </label>
                  <input
                    type="text"
                    value={cheerText}
                    onChange={handleCheerTextChange}
                    placeholder="Type a name to search..."
                    className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:ring-4"
                    style={{ 
                      border: '2px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontFamily: 'Avenir, sans-serif',
                      color: '#1a0202'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0097b2';
                      e.target.style.boxShadow = '0 0 0 4px rgba(0, 151, 178, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {/* Enhanced User Dropdown */}
                  {showUserDropdown && Array.isArray(searchResults) && searchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 rounded-xl shadow-2xl max-h-64 overflow-y-auto" 
                         style={{ 
                           backgroundColor: '#ffffff', 
                           border: '2px solid #e2e8f0',
                           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                         }}>
                      {searchResults
                        .filter(result => !selectedUsers.some(selected => selected.user_id === result.user_id))
                        .map((result) => (
                        <button
                          key={result.user_id}
                          type="button"
                          onClick={() => handleUserSelect(result)}
                          className="w-full px-5 py-4 text-left flex items-center space-x-4 transition-all duration-200 hover:scale-[1.02]"
                          style={{ 
                            borderBottom: '1px solid #f1f5f9',
                            color: '#1a0202',
                            fontFamily: 'Avenir, sans-serif'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f9ff'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <img
                            src={result.avatar || '/images/default-avatar.png'}
                            alt={result.name}
                            className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-base" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                              {result.name}
                            </p>
                            <p className="text-sm" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                              {result.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Message Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2" 
                         style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                    Your Message (Optional)
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Share why they deserve this cheer... 😊"
                    className="w-full px-3 py-2 rounded-lg resize-none transition-all duration-200 focus:ring-4"
                    style={{ 
                      border: '2px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontFamily: 'Avenir, sans-serif',
                      color: '#1a0202'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0097b2';
                      e.target.style.boxShadow = '0 0 0 4px rgba(0, 151, 178, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                    rows={3}
                  />
                </div>

                {/* Enhanced Controls - Fixed Layout */}
                <div className="flex flex-row items-center gap-x-3 pt-3">
                  <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
                    <label className="text-sm font-semibold" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                      Heartbits:
                    </label>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="1"
                        max={Math.min(100, availableHeartbits)}
                        value={cheerPoints}
                        onChange={(e) => setCheerPoints(Math.min(Math.max(1, parseInt(e.target.value) || 1), Math.min(100, availableHeartbits)))}
                        className="w-16 px-2 py-2 text-center rounded-lg font-bold transition-all duration-200 focus:ring-4 text-sm h-10"
                        style={{ 
                          border: '2px solid #e2e8f0',
                          fontFamily: 'Avenir, sans-serif',
                          color: '#1a0202',
                          backgroundColor: '#f8fafc'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0097b2';
                          e.target.style.boxShadow = '0 0 0 4px rgba(0, 151, 178, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <span className="text-[0.7rem] font-bold mt-1 text-center"
                            style={{
                              color: '#1a0202',
                              background: 'none',
                              fontFamily: 'Avenir, sans-serif',
                              letterSpacing: '1px',
                              fontWeight: 700,
                              boxShadow: 'none',
                              padding: 0
                            }}>
                        <span style={{fontWeight: 900}}>MAX</span> <span style={{fontWeight: 900}}>{Math.min(100, availableHeartbits)}</span>
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={
                      anyLoading ||
                      isSubmitting ||
                      selectedUsers.length === 0 ||
                      bulkCheerMutation.isLoading ||
                      cheerPoints > availableHeartbits
                    }
                    className="text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 w-auto text-xs h-10 ml-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)',
                      fontFamily: 'Avenir, sans-serif',
                      height: '40px',
                      fontSize: '0.85rem',
                      padding: '0 12px'
                    }}
                  >
                    {bulkCheerMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-4 h-4" />
                        <span>Send Heartbits</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Enhanced Heartbits Widget */}
            <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl max-h-200 overflow-y-auto" 
                 style={{ 
                   background: 'linear-gradient(135deg, #e0f7fa 70%, #b3e0f2 100%)', 
                   border: '2px solid #b3e0f2',
                   boxShadow: '0 10px 25px rgba(0, 151, 178, 0.10)'
                 }}>
              <div className="flex items-center justify-center mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" 
                     style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)', marginLeft: '9px' }}>
                  <HeartIconSolid className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="text-center">
                  <div className="flex justify-center items-center" style={{ minHeight: 70 }}>
                    <div className="flex flex-col items-center" style={{ minWidth: 70 }}>
                      <div className="text-4xl font-black mb-1" 
                           style={{ 
                             color: '#0097b2', 
                             fontFamily: 'Avenir, sans-serif',
                             textShadow: '0 2px 4px rgba(0, 151, 178, 0.2)'
                           }}>
                        {availableHeartbits}
                      </div>
                      <div className="text-base font-semibold" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                        Remaining
                      </div>
                    </div>
                    
                    <div style={{ 
                      width: 5, 
                      height: 55, 
                      background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)', 
                      margin: '0 30px', 
                      borderRadius: 2 
                    }} />
                    
                    <div className="flex flex-col items-center" style={{ minWidth: 70 }}>
                      <div className="text-4xl font-black mb-1" 
                           style={{ 
                             color: '#bfd1a0', 
                             fontFamily: 'Avenir, sans-serif',
                             textShadow: '0 2px 4px rgba(191, 209, 160, 0.2)'
                           }}>
                        {pointsData?.data?.monthlyReceivedHeartbits || 0}
                      </div>
                      <div className="text-base font-semibold" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                        Received
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3" style={{ borderTop: '2px solid #f1f5f9' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" 
                          style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                      {pointsData?.data?.monthlyCheerUsed || 0} used
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" 
                          style={{ 
                            color: '#64748b', 
                            backgroundColor: '#f1f5f9',
                            fontFamily: 'Avenir, sans-serif' 
                          }}>
                      out of {pointsData?.data?.monthlyCheerLimit || 100}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full rounded-full h-3 shadow-inner" style={{ backgroundColor: '#f1f5f9' }}>
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 shadow-lg"
                        style={{ 
                          width: `${Math.min(((pointsData?.data?.monthlyCheerUsed || 0) / (pointsData?.data?.monthlyCheerLimit || 100)) * 100, 100)}%`,
                          background: 'linear-gradient(135deg, #0097b2 0%, #bfd1a0 100%)'
                        }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white mix-blend-difference" 
                            style={{ fontFamily: 'Avenir, sans-serif' }}>
                        {Math.round(((pointsData?.data?.monthlyCheerUsed || 0) / (pointsData?.data?.monthlyCheerLimit || 100)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feed & Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Cheer Feed with Header */}
            <div className="rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl" 
                 style={{ 
                   background: 'linear-gradient(135deg, #e0f7fa 70%, #b3e0f2 100%)', 
                   border: '2px solid #b3e0f2',
                   boxShadow: '0 10px 25px rgba(0, 151, 178, 0.10)'
                 }}>
              {/* Feed Header */}
              <div className="px-6 py-3 border-b-2" style={{ borderColor: '#b3e0f2' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                       style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)' }}>
                    <FireIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold truncate" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                      Recent Cheers
                    </h2>
                  </div>
                </div>
              </div>

              {/* Date Picker for filtering cheers by date */}
              <div className="flex items-center justify-end mb-2">
                <label htmlFor="cheer-date-picker" className="mr-2 text-sm text-gray-700 font-medium">Filter by date:</label>
                <input
                  id="cheer-date-picker"
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    setSelectedDate(e.target.value);
                    // Optionally, refetch immediately
                    // refetchCheerFeed();
                  }}
                />
                {selectedDate && (
                  <button
                    className="ml-2 text-xs text-blue-600 underline"
                    onClick={() => setSelectedDate('')}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-90 overflow-y-auto">
                {feedLoading ? (
                  <div className="p-8 text-center">
                    <div className="relative mb-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-4 mx-auto" 
                           style={{ borderTopColor: '#0097b2' }}></div>
                      <SparklesIcon className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                                   style={{ color: '#0097b2' }} />
                    </div>
                    <p className="text-base font-medium" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                      Loading recent cheers...
                    </p>
                  </div>
                ) : feed.length > 0 ? (
                  <div>
                    {feed.map((cheer, index) => (
                      <div key={cheer.cheer_id} 
                           className={`relative p-6 transition-all duration-200 hover:bg-gray-50 ${index !== feed.length - 1 ? 'border-b border-gray-100' : ''}`}
                           style={{ 
                             borderTopLeftRadius: 0,
                             borderBottomLeftRadius: '18px',
                             borderTopRightRadius: '18px',
                             borderBottomRightRadius: '18px',
                             background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)',
                             boxShadow: '0 4px 16px 0 rgba(52, 211, 153, 0.10), 0 1.5px 4px 0 rgba(96, 165, 250, 0.10)',
                             border: '1.5px solid #e0e7ef',
                             overflow: 'hidden'
                           }}>
                        {/* Formatted Date - Top right */}
                        <div className="absolute top-4 right-6 text-xs text-gray-500 font-medium z-10">
                          {formatFullDateTime(cheer.createdAt || cheer.posted_at)}
                        </div>
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
                        <div className="flex space-x-3" style={{ marginLeft: '10px' }}>
                          <img
                            src={cheer.fromUser?.avatar || '/images/default-avatar.png'}
                            alt={cheer.fromUser?.name}
                            className="w-10 h-10 rounded-full ring-2 ring-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2 flex-wrap">
                              <span className="font-bold text-base" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                {cheer.fromUser?.name}
                              </span>
                              <span className="text-gray-500 text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                cheered
                              </span>
                              <span className="font-bold text-base" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                {cheer.toUser?.name}
                              </span>
                              <span className="font-bold px-2 py-1 rounded-full text-sm text-white shadow-lg flex items-center" style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)', fontFamily: 'Avenir, sans-serif' }}>
                                +{cheer.points}
                                <HeartIconSolid className="w-4 h-4" style={{ color: '#ef4444', display: 'inline', marginLeft: '2px', marginRight: '0px' }} />bits
                              </span>
                            </div>
                            
                            {cheer.message && (
                              <p className="mb-3 text-base leading-relaxed" style={{ color: '#374151', fontFamily: 'Avenir, sans-serif', fontWeight: 500 }}>
                                {cheer.message}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4">
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                  onClick={() => likeMutation.mutate(cheer.cheer_id)}
                                  className="flex items-center space-x-1 transition-all duration-200 hover:scale-110 active:scale-95"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    zIndex: 2,
                                    color: likedCheers.has(cheer.cheer_id) ? '#ef4444' : '#64748b',
                                    fontFamily: 'Avenir, sans-serif',
                                  }}
                                >
                                  {likedCheers.has(cheer.cheer_id) ? (
                                    <HeartIconSolid className="w-5 h-5" />
                                  ) : (
                                    <HeartIcon className="w-6 h-6" />
                                  )}
                                </button>
                                
                              </div>
                              <span className="text-xs font-semibold" style={{ marginLeft: 4 }}>{cheer.heartCount || cheer.likeCount || 0}</span>
                              
                              <button
                                onClick={() => handleCommentClick(cheer.cheer_id)}
                                className="flex items-center space-x-1 transition-all duration-200 hover:scale-110 active:scale-95"
                                style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}
                              >
                                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" style={{ color: '#22c55e' }} />
                                <span className="text-xs font-semibold">{cheer.commentCount || 0}</span>
                              </button>
                              
                              <span className="text-xs" 
                                    style={{ color: '#94a3b8', fontFamily: 'Avenir, sans-serif' }}>
                                {formatTimeAgo(cheer.createdAt)}
                              </span>
                            </div>
                            
                            {commentingCheer === cheer.cheer_id && (
                              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: '#faf8ef' }}>
                                <div className="flex space-x-2 mb-3">
                                  <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:ring-4"
                                    style={{ 
                                      border: '2px solid #e2e8f0',
                                      fontFamily: 'Avenir, sans-serif',
                                      color: '#1a0202'
                                    }}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = '#0097b2';
                                      e.target.style.boxShadow = '0 0 0 4px rgba(0, 151, 178, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderColor = '#e2e8f0';
                                      e.target.style.boxShadow = 'none';
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && commentText.trim()) {
                                        commentMutation.mutate({
                                          cheerId: cheer.cheer_id,
                                          comment: commentText.trim()
                                        });
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      if (commentText.trim()) {
                                        commentMutation.mutate({
                                          cheerId: cheer.cheer_id,
                                          comment: commentText.trim()
                                        });
                                      }
                                    }}
                                    disabled={!commentText.trim() || commentMutation.isLoading}
                                    className="px-4 py-2 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95"
                                    style={{ 
                                      background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)',
                                      fontFamily: 'Avenir, sans-serif'
                                    }}
                                  >
                                    {commentMutation.isLoading ? 'Posting...' : 'Post'}
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {loadingComments ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-2" 
                                           style={{ borderTopColor: '#0097b2' }}></div>
                                      <span className="ml-2 text-xs font-medium" 
                                            style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                                        Loading comments...
                                      </span>
                                    </div>
                                  ) : (
                                    (() => {
                                      const commentData = cheerComments.get(cheer.cheer_id) || { comments: [] };
                                      const comments = commentData.comments;
                                      if (Array.isArray(comments) && comments.length > 0) {
                                        return <>
                                          {comments.map((comment, index) => {
                                            const commentKey = comment._id || comment.id || `comment-${cheer.cheer_id}-${index}`;
                                            return (
                                              <div key={commentKey}
                                                className="relative rounded-xl px-2 pt-1 pb-px transition-all duration-200 hover:scale-[1.02]"
                                                style={{
                                                  background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)',
                                                  boxShadow: '0 4px 16px 0 rgba(52, 211, 153, 0.10), 0 1.5px 4px 0 rgba(96, 165, 250, 0.10)',
                                                  border: '1.5px solid #e0e7ef',
                                                  borderRadius: '18px',
                                                  position: 'relative',
                                                  zIndex: 1,
                                                }}
                                              >
                                                <div className="flex items-start space-x-2">
                                                  {comment.fromUser?.avatar ? (
                                                    <img
                                                      src={comment.fromUser.avatar}
                                                      alt={comment.fromUser.name || 'User'}
                                                      className="w-10 h-10 rounded-full ring-1 ring-gray-200 flex-shrink-0"
                                                    />
                                                  ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                                                         style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)' }}>
                                                      <span className="text-xs font-bold text-white" 
                                                            style={{ fontFamily: 'Avenir, sans-serif', fontSize: '8px' }}>
                                                        {comment.fromUser?.name ? comment.fromUser.name.charAt(0) : '?'}
                                                      </span>
                                                    </div>
                                                  )}
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-1 mb-1">
                                                      <span className="font-semibold text-sm" 
                                                            style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                                        {comment.fromUser?.name || 'Anonymous'}
                                                      </span>
                                                      <span className="text-xs" 
                                                            style={{ color: '#94a3b8', fontFamily: 'Avenir, sans-serif' }}>
                                                        {formatTimeAgo(comment.createdAt)}
                                                      </span>
                                                    </div>
                                                    {editingComment && editingComment.cheerId === cheer.cheer_id && editingComment.commentId === comment._id ? (
                                                      <div className="flex items-center space-x-2">
                                                        <input
                                                          type="text"
                                                          value={editCommentText}
                                                          onChange={e => setEditCommentText(e.target.value)}
                                                          className="flex-1 px-2 py-1 rounded border"
                                                          style={{ fontFamily: 'Avenir, sans-serif', color: '#1a0202' }}
                                                          disabled={editCommentMutation.isLoading}
                                                        />
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-green-500 text-white font-bold"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          disabled={editCommentMutation.isLoading || !editCommentText.trim()}
                                                          onClick={() => editCommentMutation.mutate({ cheerId: cheer.cheer_id, commentId: comment._id, comment: editCommentText.trim() })}
                                                        >
                                                          Save
                                                        </button>
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-700 font-bold"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          disabled={editCommentMutation.isLoading}
                                                          onClick={() => { setEditingComment(null); setEditCommentText(''); }}
                                                        >
                                                          Cancel
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <p className="text-base" style={{ color: '#374151', fontFamily: 'Avenir, sans-serif' }}>{comment.comment}</p>
                                                    )}
                                                  </div>
                                                </div>
                                                {comment.fromUser?._id === user.id && !editingComment && (
                                                  <div className="flex space-x-1 mt-1">
                                                    {confirmingDelete && confirmingDelete.cheerId === cheer.cheer_id && confirmingDelete.commentId === comment._id ? (
                                                      <div className="flex items-center space-x-2">
                                                        <span className="text-xs font-semibold" style={{ color: '#ef4444', fontFamily: 'Avenir, sans-serif' }}>Are you sure?</span>
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          onClick={() => {
                                                            deleteCommentMutation.mutate({ cheerId: cheer.cheer_id, commentId: comment._id });
                                                            setConfirmingDelete(null);
                                                          }}
                                                          disabled={editCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                        >
                                                          Yes
                                                        </button>
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-700 font-bold"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          onClick={() => setConfirmingDelete(null)}
                                                          disabled={editCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                        >
                                                          No
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-yellow-400 text-white font-bold hover:bg-yellow-500"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          onClick={() => { setEditingComment({ cheerId: cheer.cheer_id, commentId: comment._id }); setEditCommentText(comment.comment); }}
                                                          disabled={editCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                        >
                                                          Edit
                                                        </button>
                                                        <button
                                                          className="text-xs px-2 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600"
                                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          onClick={() => setConfirmingDelete({ cheerId: cheer.cheer_id, commentId: comment._id })}
                                                          disabled={editCommentMutation.isLoading || deleteCommentMutation.isLoading}
                                                        >
                                                          Delete
                                                        </button>
                                                      </>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                          {commentData.hasMore && (
                                            <button
                                              className="w-full py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:bg-white"
                                              style={{ color: '#0097b2', fontFamily: 'Avenir, sans-serif' }}
                                              onClick={() => fetchComments(cheer.cheer_id, true)}
                                              disabled={loadingComments}
                                            >
                                              {loadingComments ? 'Loading...' : 'Load more comments'}
                                            </button>
                                          )}
                                        </>;
                                      } else {
                                        return (
                                          <p className="text-xs text-center py-4 font-medium" 
                                             style={{ color: '#94a3b8', fontFamily: 'Avenir, sans-serif' }}>
                                            No comments yet. Be the first to comment!
                                          </p>
                                        );
                                      }
                                    })()
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="mb-4">
                      <HeartIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#94a3b8' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                      No cheers yet
                    </h3>
                    <p className="text-base" style={{ color: '#94a3b8', fontFamily: 'Avenir, sans-serif' }}>
                      Be the first to spread some positivity! 🌟
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Leaderboard with Header */}
            <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl" 
                 style={{ 
                   background: 'linear-gradient(135deg, #e0f7fa 70%, #b3e0f2 100%)', 
                   border: '2px solid #b3e0f2',
                   boxShadow: '0 10px 25px rgba(0, 151, 178, 0.10)'
                 }}>
              {/* Leaderboard Header with Buttons */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                       style={{ background: 'linear-gradient(135deg, #bfd1a0 0%, #0097b2 100%)' }}>
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold truncate" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                      Leaderboard
                    </h2>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {['weekly', 'monthly', 'alltime'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setActiveTab(period)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95`}
                      style={{
                        backgroundColor: activeTab === period ? '#0097b2' : '#f1f5f9',
                        color: activeTab === period ? '#ffffff' : '#64748b',
                        fontFamily: 'Avenir, sans-serif',
                        boxShadow: activeTab === period ? '0 2px 8px rgba(0, 151, 178, 0.3)' : 'none'
                      }}
                    >
                      {period === 'alltime' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current User Position - Always Show */}
              {user && currentUserLeaderboard && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Your Current Position</div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]" 
                       style={{ 
                         backgroundColor: '#fafafa',
                         border: '1px solid #e0e7ef',
                         boxShadow: '0 4px 16px 0 rgba(52, 211, 153, 0.10), 0 1.5px 4px 0 rgba(96, 165, 250, 0.10)'
                       }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0"
                         style={{
                           background: currentUserLeaderboard.rank === 1
                             ? 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 25%, #FFD700 50%, #B8860B 75%, #FFD700 100%)'
                             : currentUserLeaderboard.rank === 2
                             ? 'linear-gradient(135deg, #C0C0C0 0%, #F8F8FF 25%, #C0C0C0 50%, #808080 75%, #C0C0C0 100%)'
                             : currentUserLeaderboard.rank === 3
                             ? 'linear-gradient(135deg, #CD7F32 0%, #DEB887 25%, #CD7F32 50%, #8B4513 75%, #CD7F32 100%)'
                             : '#f1f5f9',
                           color: currentUserLeaderboard.rank <= 3 ? '#ffffff' : '#0097b2',
                           textShadow: currentUserLeaderboard.rank <= 3 ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
                         }}>
                      {currentUserLeaderboard.rank}
                    </div>
                    <img
                      src={currentUserLeaderboard.info?.avatar || '/images/default-avatar.png'}
                      alt={currentUserLeaderboard.info?.name}
                      className="w-10 h-10 rounded-xl ring-1 ring-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base truncate">
                        {currentUserLeaderboard.info?.name || user.first_name + ' ' + user.last_name}
                      </p>
                    </div>
                    <span className="font-bold text-base">
                      {currentUserLeaderboard.info?.totalPoints || currentUserLeaderboard.totalPoints || 0} received
                    </span>
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" 
                   style={{ 
                     height: '2px',
                     background: 'linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)'
                   }}></div>

              {/* Main Leaderboard */}
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-4 mx-auto" 
                         style={{ borderTopColor: '#0097b2' }}></div>
                    <TrophyIcon className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                               style={{ color: '#0097b2' }} />
                  </div>
                  <p className="text-base font-medium" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                    Loading leaderboard...
                  </p>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto overflow-x-hidden">
                  {/* Show complete leaderboard without filtering */}
                  {leaderboard
                    .slice(0, showMoreLeaderboard ? 6 : 3)
                    .map((entry) => (
                      <div
                        key={entry._id || entry.userId || entry.user_id}
                        className="flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          backgroundColor: '#faf8ef',
                          border: '1px solid #f0e68c',
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-lg flex-shrink-0"
                          style={{
                            background: entry.rank === 1
                              ? 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 25%, #FFD700 50%, #B8860B 75%, #FFD700 100%)'
                              : entry.rank === 2
                              ? 'linear-gradient(135deg, #C0C0C0 0%, #F8F8FF 25%, #C0C0C0 50%, #808080 75%, #C0C0C0 100%)'
                              : entry.rank === 3
                              ? 'linear-gradient(135deg, #CD7F32 0%, #DEB887 25%, #CD7F32 50%, #8B4513 75%, #CD7F32 100%)'
                              : 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                            color: '#ffffff',
                            textShadow: entry.rank <= 3 ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(0, 0, 0, 0.3)',
                            boxShadow: entry.rank <= 3 ? '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none'
                          }}
                        >
                          {entry.rank}
                        </div>
                        <img
                          src={entry.avatar || '/images/default-avatar.png'}
                          alt={entry.name || entry.userName}
                          className="w-10 h-10 rounded-xl ring-2 ring-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-base truncate" 
                            style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                            {entry.name || entry.userName}
                          </p>
                        </div>
                        <span className="font-black text-lg px-3 py-1 rounded-lg flex-shrink-0" 
                          style={{ 
                            color: '#1a0202',
                            backgroundColor: 'transparent',
                            fontFamily: 'Avenir, sans-serif' 
                          }}>
                          {entry.totalPoints || entry.total_earned} received
                        </span>
                      </div>
                    ))}
                    
                    {/* Show More/Less Button */}
                    {leaderboard.length > 3 && (
                      <div className="flex justify-center pt-3">
                        <button
                          onClick={() => setShowMoreLeaderboard(!showMoreLeaderboard)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{
                            backgroundColor: '#f9f6e8',
                            color: '#0097b2',
                            fontFamily: 'Avenir, sans-serif',
                            border: '1px solid #f0e68c'
                          }}
                        >
                          {showMoreLeaderboard ? 'Show Less' : `Show Next ${Math.min(3, leaderboard.length - 3)}`}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrophyIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#94a3b8' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#64748b', fontFamily: 'Avenir, sans-serif' }}>
                      No leaderboard data available
                    </h3>
                    <p className="text-base" style={{ color: '#94a3b8', fontFamily: 'Avenir, sans-serif' }}>
                      Start sending cheers to see rankings! 🏆
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default CheerPage;