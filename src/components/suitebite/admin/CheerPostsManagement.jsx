import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { formatDate, formatTimeAgo } from '../../../utils/dateHelpers';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const CheerPostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moderating, setModerating] = useState(new Set()); // Track which posts are being moderated
  const [filter, setFilter] = useState('all'); // all, reported, flagged, hidden
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, heartbits, author
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  // Custom confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmPostId, setConfirmPostId] = useState(null);
  const [confirmPostData, setConfirmPostData] = useState(null);

  // Memoize loadCheerPosts to prevent unnecessary re-renders
  const loadCheerPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      }
      
      // Load with a higher limit to get more posts
      const response = await suitebiteAPI.getCheerPostsAdmin(filter, page, 50);
      
      if (response.success) {
        if (append) {
          setPosts(prev => [...prev, ...(response.posts || [])]);
        } else {
          setPosts(response.posts || []);
        }
        
        // Check if there are more posts
        setHasMorePosts((response.posts || []).length === 50);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to load posts');
        toast.error(response.message || 'Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading cheer posts:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Initial load and filter change effect
  useEffect(() => {
    setCurrentPage(1);
    setHasMorePosts(true);
    loadCheerPosts(1, false);
  }, [filter, loadCheerPosts]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-refresh if not currently loading and no search term is active
      if (!loading && !searchTerm.trim()) {
        loadCheerPosts(1, false);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, searchTerm, loadCheerPosts]);

  const handleModeratePost = async (postId, action) => {
    try {
      // Add to moderating set to show loading state
      setModerating(prev => new Set(prev).add(postId));
      
      // Find the post to get its date
      const post = posts.find(p => p.cheer_post_id === postId);
      if (!post) {
        toast.error('Post not found');
        return;
      }

      // Generate default message with post date
      const postDate = new Date(post.posted_at).toLocaleDateString();
      let defaultReason = '';
      
      switch (action) {
        case 'hide':
          defaultReason = `Your cheer post (${postDate}) is hidden due to inappropriate content.`;
          break;
        case 'unhide':
          defaultReason = `Your cheer post (${postDate}) has been restored.`;
          break;
        case 'delete':
          defaultReason = `Your cheer post (${postDate}) is deleted due to violation of community guidelines.`;
          break;
        default:
          defaultReason = `Your cheer post (${postDate}) has been moderated.`;
      }

      const response = await suitebiteAPI.moderateCheerPost(postId, action, defaultReason);
      
      if (response.success) {
        toast.success(`Post ${action === 'hide' ? 'hidden' : action === 'unhide' ? 'unhidden' : 'deleted'} successfully`);
        // Auto-refresh data after successful moderation
        await loadCheerPosts(1, false);
      } else {
        toast.error(response.message || `Failed to ${action} post`);
      }
    } catch (error) {
      console.error('Error moderating post:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${action} post`;
      toast.error(errorMessage);
    } finally {
      // Remove from moderating set
      setModerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Add to moderating set to show loading state
      setModerating(prev => new Set(prev).add(postId));
      
      // Find the post to get its date
      const post = posts.find(p => p.cheer_post_id === postId);
      if (!post) {
        toast.error('Post not found');
        return;
      }

      // Generate default message with post date
      const postDate = new Date(post.posted_at).toLocaleDateString();
      const defaultReason = `Your cheer post (${postDate}) is deleted due to violation of community guidelines.`;

      // Use moderateCheerPost with 'delete' action to ensure notification is created
      const response = await suitebiteAPI.moderateCheerPost(postId, 'delete', defaultReason);
      
      if (response.success) {
        toast.success('Post deleted successfully');
        // Auto-refresh data after successful deletion
        await loadCheerPosts(1, false);
      } else {
        toast.error(response.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete post';
      toast.error(errorMessage);
    } finally {
      // Remove from moderating set
      setModerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Custom confirmation modal handlers
  const showConfirmation = (action, postId, postData) => {
    setConfirmAction(action);
    setConfirmPostId(postId);
    setConfirmPostData(postData);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmPostId || !confirmAction) return;

    try {
      if (confirmAction === 'delete') {
        await handleDeletePost(confirmPostId);
      } else if (confirmAction === 'hide' || confirmAction === 'unhide') {
        await handleModeratePost(confirmPostId, confirmAction);
      }
    } catch (error) {
      console.error('Error in confirmation action:', error);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmPostId(null);
      setConfirmPostData(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmPostId(null);
    setConfirmPostData(null);
  };

  // Debounced search to improve performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPosts = posts.filter(post => {
    // First apply search filter
    const searchLower = debouncedSearchTerm.toLowerCase();
    const matchesSearch = !debouncedSearchTerm || (
      // Search in post content (both post_body and cheer_message for compatibility)
      (post.post_body || '').toLowerCase().includes(searchLower) ||
      (post.cheer_message || '').toLowerCase().includes(searchLower) ||
      // Search in author names
      (post.cheerer_first_name || '').toLowerCase().includes(searchLower) ||
      (post.cheerer_last_name || '').toLowerCase().includes(searchLower) ||
      // Search in recipient names
      (post.peer_first_name || '').toLowerCase().includes(searchLower) ||
      (post.peer_last_name || '').toLowerCase().includes(searchLower) ||
      // Search in post ID
      (post.cheer_post_id || '').toLowerCase().includes(searchLower) ||
      // Search in author email
      (post.cheerer_email || '').toLowerCase().includes(searchLower) ||
      // Search in recipient email
      (post.peer_email || '').toLowerCase().includes(searchLower)
    );

    // Then apply status filter
    let matchesFilter = true;
    if (filter === 'active') {
      matchesFilter = !post.is_hidden && !post.is_flagged && !post.is_reported;
    } else if (filter === 'hidden') {
      matchesFilter = post.is_hidden;
    } else if (filter === 'flagged') {
      matchesFilter = post.is_flagged;
    } else if (filter === 'reported') {
      matchesFilter = post.is_reported;
    }
    // 'all' filter matches everything

    return matchesSearch && matchesFilter;
  });

  // Memoized sorting for better performance
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'heartbits':
          aValue = a.heartbits_given || 0;
          bValue = b.heartbits_given || 0;
          break;
        case 'author':
          aValue = ((a.cheerer_first_name || '') + ' ' + (a.cheerer_last_name || '')).toLowerCase();
          bValue = ((b.cheerer_first_name || '') + ' ' + (b.cheerer_last_name || '')).toLowerCase();
          break;
        case 'likes':
          aValue = a.likes_count || 0;
          bValue = b.likes_count || 0;
          break;
        case 'comments':
          aValue = a.comments_count || 0;
          bValue = b.comments_count || 0;
          break;
        default:
          aValue = new Date(a.posted_at);
          bValue = new Date(b.posted_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredPosts, sortBy, sortOrder]);

  const getStatusBadge = (post) => {
    if (post.is_hidden) return { text: 'Hidden', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Active', class: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="cheer-posts-management bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cheer Posts Management</h1>
            <p className="text-gray-600">Monitor and moderate community cheer posts</p>
          </div>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.length}</span>
          <span className="text-sm text-gray-500 font-medium">Posts</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.filter(p => !p.is_hidden).length}</span>
          <span className="text-sm text-gray-500 font-medium">Active</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.filter(p => p.is_hidden).length}</span>
          <span className="text-sm text-gray-500 font-medium">Hidden</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.heartbits_given || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Heartbits</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.likes_count || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Likes</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.comments_count || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Comments</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search Section */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by post content, author name, recipient, or post ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FunnelIcon className="w-4 h-4" />
                Filter
              </label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
              >
                <option value="all">All Posts</option>
                <option value="active">Active Posts</option>
                <option value="hidden">Hidden Posts</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
              >
                <option value="date">Date</option>
                <option value="heartbits">Heartbits</option>
                <option value="author">Author</option>
                <option value="likes">Likes</option>
                <option value="comments">Comments</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'desc' ? (
                <ArrowDownIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ArrowUpIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>



      {/* Error Display */}
      {error && (
        <div className="error-state bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading posts</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadCheerPosts(1, false);
              }}
              className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="loading-state flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0097b2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading cheer posts...</p>
          </div>
        </div>
      ) : (
        <div className="posts-container space-y-4">
          {sortedPosts.map((post) => (
            <PostCard 
              key={post.cheer_post_id} 
              post={post} 
              onModerate={handleModeratePost} 
              onDelete={handleDeletePost}
              moderating={moderating}
              showConfirmation={showConfirmation}
            />
          ))}
          
          {sortedPosts.length === 0 && !loading && (
            <div className="empty-state text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {posts.length === 0 ? 'No posts found' : 'No posts match your filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {posts.length === 0 
                  ? 'There are no cheer posts in the system yet.' 
                  : 'Try adjusting your search terms or filters to find more posts.'
                }
              </p>
              {posts.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="text-sm text-[#0097b2] hover:text-[#007a8e] font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Load More Button */}
          {hasMorePosts && sortedPosts.length > 0 && !loading && (
            <div className="text-center py-6">
              <button
                onClick={() => loadCheerPosts(currentPage + 1, true)}
                className="px-6 py-3 bg-[#0097b2] text-white rounded-lg hover:bg-[#007a8e] transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                Load More Posts
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b border-gray-200 rounded-t-xl ${
              confirmAction === 'delete' ? 'bg-red-50 border-red-200' :
              confirmAction === 'hide' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmAction === 'delete' ? 'bg-red-100' :
                  confirmAction === 'hide' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  {confirmAction === 'delete' ? (
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  ) : confirmAction === 'hide' ? (
                    <EyeSlashIcon className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {confirmAction === 'delete' ? 'Delete Post' :
                     confirmAction === 'hide' ? 'Hide Post' : 'Unhide Post'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {confirmAction === 'delete' ? 'This action cannot be undone' :
                     confirmAction === 'hide' ? 'Post will be hidden from users' : 'Post will be visible again'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {confirmPostData && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Author:</span> {confirmPostData.cheerer_first_name} {confirmPostData.cheerer_last_name}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Recipient:</span> {confirmPostData.peer_first_name} {confirmPostData.peer_last_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Message:</span> "{confirmPostData.post_body?.substring(0, 100)}{confirmPostData.post_body?.length > 100 ? '...' : ''}"
                  </p>
                </div>
              )}
              
              <p className="text-gray-700">
                {confirmAction === 'delete' ? 
                  'Are you sure you want to permanently delete this cheer post? This action will remove the post and all associated data including likes and comments.' :
                 confirmAction === 'hide' ? 
                  'Are you sure you want to hide this cheer post? Hidden posts will not be visible to users but can be restored later.' :
                  'Are you sure you want to unhide this cheer post? The post will become visible to users again.'
                }
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 rounded-b-xl bg-gray-50 flex gap-3">
              <button
                onClick={handleCancelAction}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 ${
                  confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  confirmAction === 'hide' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {confirmAction === 'delete' ? 'Delete Post' :
                 confirmAction === 'hide' ? 'Hide Post' : 'Unhide Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PostCard component extracted for better organization
const PostCard = ({ post, onModerate, onDelete, moderating, showConfirmation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const getStatusBadge = (post) => {
    if (post.is_hidden) return { text: 'Hidden', class: 'bg-gray-100 text-gray-800' };
    if (post.is_flagged) return { text: 'Flagged', class: 'bg-yellow-100 text-yellow-800' };
    if (post.is_reported) return { text: 'Reported', class: 'bg-red-100 text-red-800' };
    return { text: 'Active', class: 'bg-green-100 text-green-800' };
  };

  const loadPostDetails = async () => {
    if (postDetails || loadingDetails) return;

    try {
      setLoadingDetails(true);
      const response = await suitebiteAPI.getCheerPost(post.cheer_post_id);
      if (response.success) {
        setPostDetails(response.post);
      }
    } catch (error) {
      console.error('Error loading post details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleDetails = async () => {
    if (!showDetails && !postDetails) {
      await loadPostDetails();
    }
    setShowDetails(!showDetails);
  };

  return (
    <div className="post-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="post-main p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Author Info */}
          <div className="author-section flex items-center gap-4 min-w-0 flex-1">
            <div className="author-avatar rounded-full w-12 h-12 flex items-center justify-center font-semibold text-sm shadow-md overflow-hidden">
              {post.cheerer_profile_pic ? (
                <img 
                  src={post.cheerer_profile_pic} 
                  alt={`${post.cheerer_first_name} ${post.cheerer_last_name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`bg-gradient-to-br from-[#0097b2] to-[#4a6e7e] text-white w-full h-full flex items-center justify-center ${post.cheerer_profile_pic ? 'hidden' : ''}`}>
                {((post.cheerer_first_name || '').charAt(0) + (post.cheerer_last_name || '').charAt(0)).toUpperCase()}
              </div>
            </div>
            <div className="author-info min-w-0 flex-1">
              <div className="author-details flex items-center gap-3 mb-2">
                <div className="text-sm font-semibold text-gray-900">{post.cheerer_first_name} {post.cheerer_last_name}</div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(post).class}`}>
                  {post.is_hidden ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                  {getStatusBadge(post).text}
                </span>
              </div>
              
              {/* Post Content */}
              <div className="post-details mt-3">
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">To:</span>
                  <span className="text-sm font-semibold text-gray-900">{(post.peer_first_name && post.peer_last_name) ? `${post.peer_first_name} ${post.peer_last_name}` : 'Team'}</span>
                  <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimeAgo(post.posted_at)}
                  </span>
                </div>
                
                <div className="text-gray-900 mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-[#0097b2]">
                  {post.post_body}
                </div>
                
                {post.image_url && (
                  <div className="mb-3">
                    <img src={post.image_url} alt="Post attachment" className="rounded-lg max-w-sm shadow-sm" />
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="engagement-stats flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="stat-item flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                    <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{post.likes_count || 0} likes</span>
                  </div>
                  <div className="stat-item flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{post.comments_count || 0} comments</span>
                  </div>

                  {/* View Details Button */}
                  {(post.likes_count > 0 || post.comments_count > 0) && (
                    <button
                      onClick={handleToggleDetails}
                      className="view-details-btn text-xs text-[#0097b2] hover:text-[#007a8e] font-medium transition-colors duration-200 px-3 py-1 bg-white rounded-full shadow-sm hover:shadow-md"
                    >
                      {loadingDetails ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-[#0097b2] border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : showDetails ? 'Hide Details' : 'View Details'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Post Stats & Actions */}
          <div className="post-stats text-right">
            <div className="stats-container mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-end gap-2 mb-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-xl font-bold text-gray-900">{post.heartbits_given}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{formatDate(post.posted_at)}</div>
              <div className="text-xs text-gray-400 font-mono bg-gray-200 px-2 py-1 rounded">ID: {post.cheer_post_id}</div>
            </div>
            
            {/* Action Buttons */}
            <div className="action-buttons flex flex-col gap-2">
              {post.is_hidden ? (
                <button 
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md" 
                  title="Unhide Post" 
                  onClick={() => onModerate(post.cheer_post_id, 'unhide')}
                  disabled={moderating.has(post.cheer_post_id)}
                >
                  {moderating.has(post.cheer_post_id) ? (
                    <>
                      <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Unhiding...</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="w-4 h-4" />
                      <span>Unhide</span>
                    </>
                  )}
                </button>
              ) : (
                <button 
                  className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md" 
                  title="Hide Post" 
                  onClick={() => showConfirmation('hide', post.cheer_post_id, post)}
                  disabled={moderating.has(post.cheer_post_id)}
                >
                  {moderating.has(post.cheer_post_id) ? (
                    <>
                      <div className="w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Hiding...</span>
                    </>
                  ) : (
                    <>
                      <EyeSlashIcon className="w-4 h-4" />
                      <span>Hide</span>
                    </>
                  )}
                </button>
              )}
              <button 
                className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md" 
                title="Delete Post" 
                onClick={() => showConfirmation('delete', post.cheer_post_id, post)}
                disabled={moderating.has(post.cheer_post_id)}
              >
                {moderating.has(post.cheer_post_id) ? (
                  <>
                    <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Engagement Section */}
      {showDetails && (
        <div className="engagement-details border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
          {/* Comments Section */}
          {postDetails && postDetails.comments && postDetails.comments.length > 0 ? (
            <div className="comments-section mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({postDetails.comments.length})
              </h4>
              <div className="comments-list space-y-3">
                {postDetails.comments.map((comment, index) => (
                  <div key={comment.comment_id || comment.cheer_comment_id || `comment-${index}`} className="comment-item bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-3">
                      <div className="commenter-avatar rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs shadow-sm overflow-hidden">
                        {comment.commenter_profile_pic ? (
                          <img 
                            src={comment.commenter_profile_pic} 
                            alt={`${comment.commenter_first_name} ${comment.commenter_last_name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`bg-gradient-to-br from-[#0097b2] to-[#4a6e7e] text-white w-full h-full flex items-center justify-center ${comment.commenter_profile_pic ? 'hidden' : ''}`}>
                          {((comment.commenter_first_name || '').charAt(0) + (comment.commenter_last_name || '').charAt(0)).toUpperCase()}
                        </div>
                      </div>
                      <div className="comment-content flex-1">
                        <div className="comment-header flex items-center gap-2 mb-2">
                          <span className="commenter-name font-semibold text-gray-900 text-sm">
                            {comment.commenter_first_name || 'Unknown'} {comment.commenter_last_name || 'User'}
                          </span>
                          <span className="comment-time text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTimeAgo(comment.created_at || comment.commented_at)}
                          </span>
                          {comment.additional_heartbits > 0 && (
                            <span className="comment-heartbits bg-gradient-to-r from-[#bfd1a0] to-[#a8c090] text-[#1a0202] px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                              +{comment.additional_heartbits} ❤️
                            </span>
                          )}
                        </div>
                        <p className="comment-text text-gray-800 text-sm leading-relaxed">
                          {comment.comment || comment.message || comment.cheer_comment || 'No comment text available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : postDetails ? (
            <div className="comments-section mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments (0)
              </h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm">No comments on this post yet.</p>
              </div>
            </div>
          ) : (
            <div className="comments-section mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments
              </h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">Loading comments...</p>
                </div>
              </div>
            </div>
          )}

          {/* Likes Section with user details */}
          {post.likes_count > 0 && (
            <div className="likes-section">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Likes ({post.likes_count})
              </h4>
              <div className="likes-info bg-white rounded-lg p-3 border border-gray-200">
                {postDetails && postDetails.likes && postDetails.likes.length > 0 ? (
                  <div className="likes-list space-y-2">
                    {postDetails.likes.map((like, index) => (
                      <div key={like.cheer_like_id || like.liker_id || `like-${index}`} className="like-item flex items-center gap-3">
                        <div className="liker-avatar rounded-full w-7 h-7 flex items-center justify-center font-semibold text-xs overflow-hidden">
                          {like.liker_profile_pic ? (
                            <img 
                              src={like.liker_profile_pic} 
                              alt={`${like.liker_first_name} ${like.liker_last_name}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`bg-gradient-to-br from-[#0097b2] to-[#4a6e7e] text-white w-full h-full flex items-center justify-center ${like.liker_profile_pic ? 'hidden' : ''}`}>
                            {((like.liker_first_name || '').charAt(0) + (like.liker_last_name || '').charAt(0)).toUpperCase()}
                          </div>
                        </div>
                        <div className="like-content flex-1">
                          <div className="flex items-center justify-between">
                            <span className="liker-name font-medium text-gray-900 text-sm">
                              {like.liker_first_name || 'Unknown'} {like.liker_last_name || 'User'}
                            </span>
                            <span className="like-time text-xs text-gray-500">
                              {formatTimeAgo(like.created_at || like.liked_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : postDetails ? (
                  <p className="text-sm text-gray-600">
                    {post.likes_count} {post.likes_count === 1 ? 'person has' : 'people have'} liked this post.
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600">Loading likes...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheerPostsManagement;
