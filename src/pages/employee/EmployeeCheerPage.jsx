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
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';

const CheerPage = () => {
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();
  
  // Form state
  const [cheerText, setCheerText] = useState('');
  const [cheerPoints, setCheerPoints] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent spam submissions
  
  // Feed interaction state
  const [activeTab, setActiveTab] = useState('weekly');
  const [commentingCheer, setCommentingCheer] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedCheers, setLikedCheers] = useState(new Set());
  const [cheerComments, setCheerComments] = useState(new Map()); // Store comments for each cheer
  const [loadingComments, setLoadingComments] = useState(false);
  
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch user points
  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ['points'],
    queryFn: pointsShopApi.getPoints,
    staleTime: 1 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Fetch cheer feed
  const { data: cheerFeed, isLoading: feedLoading } = useQuery({
    queryKey: ['cheer-feed'],
    queryFn: () => pointsShopApi.getCheerFeed(20),
    staleTime: 1 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // Fetch leaderboard
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard', activeTab],
    queryFn: () => pointsShopApi.getLeaderboard(activeTab),
    staleTime: 2 * 60 * 1000,
    enabled: !!user && Object.keys(user).length > 0,
  });

  // User search for @ mentions
  const { data: searchResults = [] } = useQuery({
    queryKey: ['user-search', searchQuery],
    queryFn: () => pointsShopApi.searchUsers(searchQuery),
    enabled: searchQuery.length >= 1 && (!!user && Object.keys(user).length > 0),
    staleTime: 30 * 1000,
  });

  // Send cheer mutation
  const cheerMutation = useMutation({
    mutationFn: ({ recipientId, amount, message }) =>
      pointsShopApi.sendCheer(recipientId, amount, message),
    onSuccess: () => {
      setIsSubmitting(false); // Reset submit lock
      toast.success('Cheer sent successfully! 🎉');
      setCheerText('');
      setSelectedUser(null);
      setCheerPoints(1);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Invalidate all related queries
      queryClient.invalidateQueries(['points']);
      queryClient.invalidateQueries(['cheer-feed']);
      queryClient.invalidateQueries(['received-cheers']);
      queryClient.invalidateQueries(['cheer-stats']);
      queryClient.invalidateQueries(['leaderboard']);
    },
    onError: (error) => {
      setIsSubmitting(false); // Reset submit lock
      const backendMsg = error?.response?.data?.message || error?.message || 'Failed to send cheer';
      toast.error(backendMsg);
      console.error('Cheer mutation error:', error);
    },
  });

  // Heart cheer mutation
  const likeMutation = useMutation({
    mutationFn: (cheerId) => pointsShopApi.toggleCheerLike(cheerId),
    onSuccess: (data, cheerId) => {
      // Update hearted state
      setLikedCheers(prev => {
        const newSet = new Set(prev);
        if (data.liked) {
          newSet.add(cheerId);
        } else {
          newSet.delete(cheerId);
        }
        return newSet;
      });
      
      // Refresh the cheer feed to get updated counts
      queryClient.invalidateQueries(['cheer-feed']);
    },
    onError: (error) => {
      console.error('Heart error:', error);
      toast.error('Failed to update heart');
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ cheerId, comment }) => pointsShopApi.addCheerComment(cheerId, comment),
    onSuccess: (data, variables) => {
      console.log('Comment added successfully:', data); // Debug log
      setCommentText('');
      // Add the new comment to local state immediately
      setCheerComments(prev => {
        const newComments = new Map(prev);
        const existing = newComments.get(variables.cheerId);
        // Ensure existing is always an array
        const existingArray = Array.isArray(existing) ? existing : [];
        
        // The new comment should match the API response format
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
        console.log('New comment object:', newComment); // Debug log
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

  // Initialize hearted cheers state when feed data loads
  useEffect(() => {
    if (cheerFeed && cheerFeed.cheers) {
      const likedCheerIds = new Set();
      cheerFeed.cheers.forEach(cheer => {
        if (cheer.userHearted || cheer.userLiked) {
          likedCheerIds.add(cheer.cheer_id);
        }
      });
      setLikedCheers(likedCheerIds);
    }
  }, [cheerFeed]);

  // Debug: log leaderboard data
  useEffect(() => {
    console.log('CheerPage - activeTab:', activeTab);
    console.log('CheerPage - leaderboardData:', leaderboardData);
  }, [activeTab, leaderboardData]);

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

  // Function to fetch comments for a specific cheer
  const fetchComments = async (cheerId) => {
    if (cheerComments.has(cheerId)) {
      return; // Already loaded
    }
    
    setLoadingComments(true);
    try {
      const comments = await pointsShopApi.getCheerComments(cheerId);
      console.log('Fetched comments:', comments); // Debug log
      
      setCheerComments(prev => {
        const newComments = new Map(prev);
        // Ensure comments is always an array
        const commentsArray = Array.isArray(comments) ? comments : [];
        newComments.set(cheerId, commentsArray);
        return newComments;
      });
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
      // Set empty array on error
      setCheerComments(prev => {
        const newComments = new Map(prev);
        newComments.set(cheerId, []);
        return newComments;
      });
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle comment button click
  const handleCommentClick = (cheerId) => {
    const isOpening = commentingCheer !== cheerId;
    setCommentingCheer(isOpening ? cheerId : null);
    
    if (isOpening) {
      fetchComments(cheerId);
    }
  };

  // Handle @ mention search in textarea
  const handleCheerTextChange = (e) => {
    const value = e.target.value;
    setCheerText(value);

    // Check for @ mentions
    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1];
      setSearchQuery(query);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
      setSearchQuery('');
    }
  };

  const handleUserSelect = (user) => {
    // Replace only the @mention part, preserving the rest of the message
    setCheerText((prev) => prev.replace(/@\w*$/, `@${user.name} `));
    setSelectedUser(user);
    setShowUserDropdown(false);
  };

  const handleCheerSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    if (!selectedUser || !selectedUser.user_id || !cheerText.trim()) {
      toast.error('Please select a user and write a message');
      return;
    }
    // Extra safety: check availableHeartbits at submit time
    if (cheerPoints > availableHeartbits) {
      toast.error('Not enough heartbits available. Please check your balance.');
      return;
    }
    setIsSubmitting(true); // Lock submit immediately
    const cheerData = {
      recipientId: selectedUser.user_id,
      amount: cheerPoints,
      message: cheerText.trim(),
    };
    // Debug: log cheer payload before sending
    console.log('Sending cheer payload:', cheerData, 'Selected user:', selectedUser);
    cheerMutation.mutate(cheerData);
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

const anyLoading = statsLoading || pointsLoading || feedLoading || receivedLoading || leaderboardLoading;

if (anyLoading) {

    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0097b2' }}></div>
      </div>
    );
  }

  const availableHeartbits = (pointsData?.data?.monthlyCheerLimit || 100) - (pointsData?.data?.monthlyCheerUsed || 0);
  const feed = Array.isArray(cheerFeed?.data?.cheers) ? cheerFeed.data.cheers : [];
  const leaderboard = leaderboardData?.leaderboard || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(255,255,255)' }}>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse" style={{ backgroundColor: '#bfd1a0' }}>
          <HeartIconSolid className="w-5 h-5" />
          <span className="font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>Cheer sent successfully! 🎉</span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">

          {/* Commented out for now */}
          {/* <h1 className="text-3xl font-bold flex items-center" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>
            <HeartIconSolid className="w-8 h-8 mr-3" style={{ color: '#0097b2' }} />
            Cheer a Peer
          </h1> */}
          
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Create Cheer & Heartbits */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Cheer Form */}
            <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #eee3e3' }}>
              <form onSubmit={handleCheerSubmit} className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <textarea
                    ref={textareaRef}
                    value={cheerText}
                    onChange={handleCheerTextChange}
                    placeholder="Mention a peer using '@' and spread some positivity! 😊"
                    className="w-full px-4 py-3 rounded-lg resize-none transition-colors"
                    style={{ 
                      border: '1px solid #eee3e3', 
                      backgroundColor: '#ffffff',
                      fontFamily: 'Avenir, sans-serif',
                      color: '#1a0202'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0097b2'}
                    onBlur={(e) => e.target.style.borderColor = '#eee3e3'}
                    rows={4}
                  />
                  
                  {/* User Dropdown for @ mentions */}
                  {showUserDropdown && Array.isArray(searchResults) && searchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ backgroundColor: '#ffffff', border: '1px solid #eee3e3' }}>
                      {searchResults.map((result) => (
                        <button
                          key={result.user_id}
                          type="button"
                          onClick={() => handleUserSelect(result)}
                          className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors"
                          style={{ 
                            borderBottom: '1px solid #eee3e3',
                            color: '#1a0202',
                            fontFamily: 'Avenir, sans-serif'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#eee3e3'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <img
                            src={result.avatar || '/images/default-avatar.png'}
                            alt={result.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>{result.name}</p>
                            <p className="text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>{result.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>Heartbits:</label>
                    <input
                      type="number"
                      min="1"
                      max={Math.min(100, availableHeartbits)}
                      value={cheerPoints}
                      onChange={(e) => setCheerPoints(Math.min(Math.max(1, parseInt(e.target.value) || 1), Math.min(100, availableHeartbits)))}
                      className="w-20 px-3 py-2 text-center rounded-lg font-semibold transition-colors"
                      style={{ 
                        border: '1px solid #eee3e3',
                        fontFamily: 'Avenir, sans-serif',
                        color: '#1a0202'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0097b2'}
                      onBlur={(e) => e.target.style.borderColor = '#eee3e3'}
                    />
                    <span className="text-xs" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>max {Math.min(100, availableHeartbits)}</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={
                      anyLoading ||
                      isSubmitting ||
                      !selectedUser || !selectedUser.user_id ||
                      !cheerText.trim() ||
                      cheerMutation.isLoading ||
                      cheerPoints > availableHeartbits
                    }
                    className="text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center space-x-2 shadow-lg"
                    style={{ 
                      backgroundColor: '#0097b2',
                      fontFamily: 'Avenir, sans-serif'
                    }}
                    onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#007a92')}
                    onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0097b2')}
                  >
                    {cheerMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

            {/* Heartbits Widget */}
            <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #eee3e3' }}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0097b2 0%, #4a6e7e 100%)' }}>
                  <HeartIconSolid className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#0097b2', fontFamily: 'Avenir, sans-serif', fontWeight: '800' }}>
                    {availableHeartbits} | {pointsData?.data?.monthlyReceivedHeartbits || 0}
                  </div>
                  <div className="text-lg font-medium" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>heartbits remaining | received this month</div>
                </div>
                
                <div className="pt-4 space-y-3" style={{ borderTop: '1px solid #eee3e3' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif', fontWeight: '700' }}>
                      {pointsData?.data?.monthlyCheerUsed || 0} used
                    </span>
                    <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ color: '#4a6e7e', backgroundColor: '#eee3e3', fontFamily: 'Avenir, sans-serif' }}>
                      out of {pointsData?.data?.monthlyCheerLimit || 100}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full rounded-full h-3" style={{ backgroundColor: '#eee3e3' }}>
                      <div 
                        className="h-3 rounded-full transition-all duration-700"
                        style={{ 
                          width: `${Math.min(((pointsData?.data?.monthlyCheerUsed || 0) / (pointsData?.data?.monthlyCheerLimit || 100)) * 100, 100)}%`,
                          background: 'linear-gradient(135deg, #0097b2 0%, #bfd1a0 100%)'
                        }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                        {Math.round(((pointsData?.data?.monthlyCheerUsed || 0) / (pointsData?.data?.monthlyCheerLimit || 100)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feed & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cheer Feed */}
            <div className="rounded-xl shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #eee3e3' }}>
              <div className="max-h-96 overflow-y-auto">
                {feedLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#0097b2' }}></div>
                  </div>
                ) : feed.length > 0 ? (
                  <div style={{ borderTop: '1px solid #eee3e3' }}>
                    {feed.map((cheer) => (
                      <div key={cheer.cheer_id} className="p-6" style={{ borderBottom: '1px solid #eee3e3' }}>
                        <div className="flex space-x-3">
                          <img
                            src={cheer.fromUser?.avatar || '/images/default-avatar.png'}
                            alt={cheer.fromUser?.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                {cheer.fromUser?.name}
                              </span>
                              <span style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>cheered</span>
                              <span className="font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                {cheer.toUser?.name}
                              </span>
                              <span className="font-medium px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#0097b2', fontFamily: 'Avenir, sans-serif' }}>
                                +{cheer.points} pts
                              </span>
                            </div>
                            
                            {cheer.message && (
                              <p className="mb-3" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>{cheer.message}</p>
                            )}
                            
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => likeMutation.mutate(cheer.cheer_id)}
                                className="flex items-center space-x-1 transition-colors"
                                style={{ 
                                  color: likedCheers.has(cheer.cheer_id) ? '#0097b2' : '#4a6e7e',
                                  fontFamily: 'Avenir, sans-serif'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#0097b2'}
                                onMouseLeave={(e) => e.target.style.color = likedCheers.has(cheer.cheer_id) ? '#0097b2' : '#4a6e7e'}
                              >
                                {likedCheers.has(cheer.cheer_id) ? (
                                  <HeartIconSolid className="w-4 h-4" />
                                ) : (
                                  <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="text-sm">{cheer.heartCount || cheer.likeCount || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => handleCommentClick(cheer.cheer_id)}
                                className="flex items-center space-x-1 transition-colors"
                                style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}
                                onMouseEnter={(e) => e.target.style.color = '#0097b2'}
                                onMouseLeave={(e) => e.target.style.color = '#4a6e7e'}
                              >
                                <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                                <span className="text-sm">{cheer.commentCount || 0}</span>
                              </button>
                              
                              <span className="text-xs" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>{formatTimeAgo(cheer.createdAt)}</span>
                            </div>
                            
                            {commentingCheer === cheer.cheer_id && (
                              <div className="mt-3">
                                {/* Comment Input */}
                                <div className="flex space-x-2 mb-3">
                                  <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 rounded-lg text-sm transition-colors"
                                    style={{ 
                                      border: '1px solid #eee3e3',
                                      fontFamily: 'Avenir, sans-serif',
                                      color: '#1a0202'
                                    }}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = '#0097b2';
                                      e.target.style.outline = 'none';
                                    }}
                                    onBlur={(e) => e.target.style.borderColor = '#eee3e3'}
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
                                    className="px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                                    style={{ 
                                      backgroundColor: '#0097b2',
                                      fontFamily: 'Avenir, sans-serif'
                                    }}
                                    onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#007a92')}
                                    onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0097b2')}
                                  >
                                    {commentMutation.isLoading ? 'Posting...' : 'Post'}
                                  </button>
                                </div>

                                {/* Comments Display */}
                                <div className="space-y-2">
                                  {loadingComments ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: '#0097b2' }}></div>
                                      <span className="ml-2 text-sm" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>Loading comments...</span>
                                    </div>
                                  ) : (
                                    (() => {
                                      const comments = cheerComments.get(cheer.cheer_id);
                                      console.log(`Comments for cheer ${cheer.cheer_id}:`, comments); // Debug log
                                      
                                      if (Array.isArray(comments) && comments.length > 0) {
                                        return comments.map((comment, index) => (
                                          <div key={comment._id || `comment-${cheer.cheer_id}-${index}`} className="rounded-lg p-3" style={{ backgroundColor: '#eee3e3' }}>
                                            <div className="flex items-start space-x-2">
                                              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0097b2' }}>
                                                <span className="text-xs font-medium text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                                  {comment.fromUser?.name ? comment.fromUser.name.charAt(0) : '?'}
                                                </span>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                  <span className="text-sm font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>
                                                    {comment.fromUser?.name || 'Anonymous'}
                                                  </span>
                                                  <span className="text-xs" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
                                                    {formatTimeAgo(comment.createdAt)}
                                                  </span>
                                                </div>
                                                <p className="text-sm mt-1" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>{comment.comment}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ));
                                      } else {
                                        return (
                                          <p className="text-sm text-center py-2" style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>
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
                    <HeartIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#4a6e7e' }} />
                    <p style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>No cheers yet. Be the first to spread some positivity!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #eee3e3' }}>
              <div className="flex justify-center space-x-2 mb-4">
                {['weekly', 'monthly', 'alltime'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setActiveTab(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors`}
                      style={{
                        backgroundColor: activeTab === period ? '#eee3e3' : 'transparent',
                        color: activeTab === period ? '#0097b2' : '#4a6e7e',
                        fontFamily: 'Avenir, sans-serif'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== period) {
                          e.target.style.color = '#1a0202';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== period) {
                          e.target.style.color = '#4a6e7e';
                        }
                      }}
                    >
                      {period === 'alltime' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
              </div>
              
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#0097b2' }}></div>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry._id || entry.userId || entry.user_id || index} className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#eee3e3' }}>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: index === 0 ? '#bfd1a0' : 
                                         index === 1 ? '#4a6e7e' :
                                         index === 2 ? '#ff6b35' :
                                         '#0097b2',
                          color: '#ffffff'
                        }}
                      >
                        {index + 1}
                      </div>
                      <img
                        src={entry.avatar || '/images/default-avatar.png'}
                        alt={entry.name || entry.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: '#1a0202', fontFamily: 'Avenir, sans-serif' }}>{entry.name || entry.userName}</p>
                      </div>
                      <span className="font-bold" style={{ color: '#0097b2', fontFamily: 'Avenir, sans-serif' }}>{entry.totalPoints || entry.total_earned} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#4a6e7e' }} />
                  <p style={{ color: '#4a6e7e', fontFamily: 'Avenir, sans-serif' }}>No leaderboard data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheerPage;
