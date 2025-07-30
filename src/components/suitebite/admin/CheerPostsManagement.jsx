import React, { useState, useEffect } from 'react';
import { suitebiteAPI } from '../../../utils/suitebiteAPI';
import { formatDate, formatTimeAgo } from '../../../utils/dateHelpers';

const CheerPostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, reported, flagged, hidden
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, heartbits, author
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadCheerPosts();
  }, [filter]);

  const loadCheerPosts = async () => {
    try {
      setLoading(true);
      const response = await suitebiteAPI.getCheerPostsAdmin(filter);
      
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error loading cheer posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeratePost = async (postId, action) => {
    try {
      // Find the post to get its date
      const post = posts.find(p => p.cheer_post_id === postId);
      if (!post) {
        console.error('Post not found');
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
        loadCheerPosts();
      }
    } catch (error) {
      console.error('Error moderating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Find the post to get its date
      const post = posts.find(p => p.cheer_post_id === postId);
      if (!post) {
        console.error('Post not found');
        return;
      }

      // Generate default message with post date
      const postDate = new Date(post.posted_at).toLocaleDateString();
      const defaultReason = `Your cheer post (${postDate}) is deleted due to violation of community guidelines.`;

      const response = await suitebiteAPI.moderateCheerPost(postId, 'delete', defaultReason);
      
      if (response.success) {
        loadCheerPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(post => 
    (post.post_body || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.cheerer_first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.cheerer_last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.peer_first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.peer_last_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
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

  const getStatusBadge = (post) => {
    if (post.is_hidden) return { text: 'Hidden', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Active', class: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="cheer-posts-management bg-gray-50 min-h-screen p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.length}</span>
          <span className="text-sm text-gray-500 font-medium">Total Posts</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.filter(p => !p.is_hidden).length}</span>
          <span className="text-sm text-gray-500 font-medium">Active Posts</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.filter(p => p.is_hidden).length}</span>
          <span className="text-sm text-gray-500 font-medium">Hidden Posts</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.heartbits_given || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Total Heartbits</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.likes_count || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Total Likes</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.comments_count || 0), 0)}</span>
          <span className="text-sm text-gray-500 font-medium">Total Comments</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Section */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search posts, authors, recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
              >
                <option value="all">All Posts</option>
                <option value="active">Active Posts</option>
                <option value="hidden">Hidden Posts</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm"
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
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
            <PostCard key={post.cheer_post_id} post={post} onModerate={handleModeratePost} onDelete={handleDeletePost} />
          ))}
          
          {sortedPosts.length === 0 && (
            <div className="empty-state text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500">No cheer posts match your current filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// PostCard component extracted for better organization
const PostCard = ({ post, onModerate, onDelete }) => {
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
    <div className="post-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="post-main p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Author Info */}
          <div className="author-section flex items-center gap-4 min-w-0 flex-1">
            <div className="author-avatar bg-[#0097b2] text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-sm">
              {((post.cheerer_first_name || '').charAt(0) + (post.cheerer_last_name || '').charAt(0)).toUpperCase()}
            </div>
            <div className="author-info min-w-0 flex-1">
              <div className="author-details">
                <div className="text-sm font-medium text-gray-900">{post.cheerer_first_name} {post.cheerer_last_name}</div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(post).class}`}>
                  {getStatusBadge(post).text}
                </span>
              </div>
              
              {/* Post Content */}
              <div className="post-details mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">To:</span>
                  <span className="text-sm font-semibold text-gray-900">{(post.peer_first_name && post.peer_last_name) ? `${post.peer_first_name} ${post.peer_last_name}` : 'Team'}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatTimeAgo(post.posted_at)}</span>
                </div>
                
                <div className="text-gray-900 mb-3">{post.post_body}</div>
                
                {post.image_url && (
                  <img src={post.image_url} alt="Post attachment" className="rounded-lg max-w-sm mb-3" />
                )}

                {/* Engagement Stats */}
                <div className="engagement-stats flex items-center gap-4 mb-4">
                  <div className="stat-item flex items-center gap-1">
                    <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{post.likes_count || 0} likes</span>
                  </div>
                  <div className="stat-item flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{post.comments_count || 0} comments</span>
                  </div>

                  {/* View Details Button */}
                  {(post.likes_count > 0 || post.comments_count > 0) && (
                    <button
                      onClick={handleToggleDetails}
                      className="view-details-btn text-xs text-[#0097b2] hover:text-[#007a8e] font-medium transition-colors duration-200"
                    >
                      {loadingDetails ? 'Loading...' : showDetails ? 'Hide Details' : 'View Details'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Post Stats & Actions */}
          <div className="post-stats text-right">
            <div className="stats-container mb-4">
              <div className="flex items-center justify-end gap-1 mb-2">
                <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-lg font-bold text-gray-900">{post.heartbits_given}</span>
              </div>
              <span className="text-xs text-gray-500">{formatDate(post.posted_at)}</span>
              <span className="text-xs text-gray-400">ID: {post.cheer_post_id}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="action-buttons flex flex-col gap-2">
              {post.is_hidden ? (
                <button 
                  className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold transition-colors duration-200" 
                  title="Unhide Post" 
                  onClick={() => onModerate(post.cheer_post_id, 'unhide')}
                >
                  Unhide
                </button>
              ) : (
                <button 
                  className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold transition-colors duration-200" 
                  title="Hide Post" 
                  onClick={() => onModerate(post.cheer_post_id, 'hide')}
                >
                  Hide
                </button>
              )}
              <button 
                className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition-colors duration-200" 
                title="Delete Post" 
                onClick={() => onDelete(post.cheer_post_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Engagement Section */}
      {showDetails && postDetails && (
        <div className="engagement-details border-t border-gray-200 bg-gray-50 p-6">
          {/* Comments Section */}
          {postDetails.comments && postDetails.comments.length > 0 && (
            <div className="comments-section mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({postDetails.comments.length})
              </h4>
              <div className="comments-list space-y-3">
                {postDetails.comments.map((comment, index) => (
                  <div key={comment.comment_id || comment.cheer_comment_id || `comment-${index}`} className="comment-item bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="commenter-avatar bg-[#0097b2] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs">
                        {((comment.commenter_first_name || '').charAt(0) + (comment.commenter_last_name || '').charAt(0)).toUpperCase()}
                      </div>
                      <div className="comment-content flex-1">
                        <div className="comment-header flex items-center gap-2 mb-1">
                          <span className="commenter-name font-medium text-gray-900 text-sm">
                            {comment.commenter_first_name} {comment.commenter_last_name}
                          </span>
                          <span className="comment-time text-xs text-gray-500">
                            {formatTimeAgo(comment.commented_at)}
                          </span>
                          {comment.additional_heartbits > 0 && (
                            <span className="comment-heartbits bg-[#bfd1a0] text-[#1a0202] px-2 py-1 rounded text-xs">
                              +{comment.additional_heartbits} ❤️
                            </span>
                          )}
                        </div>
                        <p className="comment-text text-gray-800 text-sm">
                          {comment.cheer_comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                {postDetails.likes && postDetails.likes.length > 0 ? (
                  <div className="likes-list space-y-2">
                    {postDetails.likes.map((like, index) => (
                      <div key={like.cheer_like_id || like.liker_id || `like-${index}`} className="like-item flex items-center gap-3">
                        <div className="liker-avatar bg-[#0097b2] text-white rounded-full w-7 h-7 flex items-center justify-center font-semibold text-xs">
                          {((like.liker_first_name || '').charAt(0) + (like.liker_last_name || '').charAt(0)).toUpperCase()}
                        </div>
                        <div className="like-content flex-1">
                          <div className="flex items-center justify-between">
                            <span className="liker-name font-medium text-gray-900 text-sm">
                              {like.liker_first_name} {like.liker_last_name}
                            </span>
                            <span className="like-time text-xs text-gray-500">
                              {formatTimeAgo(like.liked_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {post.likes_count} {post.likes_count === 1 ? 'person has' : 'people have'} liked this post.
                  </p>
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
