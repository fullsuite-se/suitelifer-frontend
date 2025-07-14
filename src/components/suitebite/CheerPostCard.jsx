import React, { useState } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, ChatBubbleLeftIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { formatTimeAgo } from '../../utils/dateHelpers';

/**
 * CheerPostCard Component
 * 
 * Displays individual cheer posts in a card format.
 * Features include:
 * - Like/unlike functionality
 * - Comment viewing and adding
 * - User avatars and names
 * - Heartbits earned display
 * - Timestamp and engagement stats
 * - Hashtag display
 * 
 * @param {Object} post - Cheer post data object
 * @param {Function} onInteraction - Callback when user interacts (like/comment)
 */
const CheerPostCard = ({ post, onInteraction }) => {
  // Local state for like functionality
  const [liked, setLiked] = useState(post.is_liked || false); // Current like status
  const [likesCount, setLikesCount] = useState(post.likes_count || 0); // Total likes count
  const [isLiking, setIsLiking] = useState(false); // Like action loading state

  // Local state for comment functionality
  const [showComments, setShowComments] = useState(false); // Show/hide comments section
  const [comments, setComments] = useState([]); // Comments array
  const [commentsLoaded, setCommentsLoaded] = useState(false); // Whether comments have been loaded
  const [newComment, setNewComment] = useState(''); // New comment input
  const [isAddingComment, setIsAddingComment] = useState(false); // Adding comment loading state
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0); // Total comments count

  /**
   * Handles like/unlike functionality for the cheer post
   * Toggles like status and updates count via API
   */
  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple rapid clicks

    try {
      setIsLiking(true);
      const response = await suitebiteAPI.toggleCheerLike({
        cheer_post_id: post.cheer_post_id
      });
      
      if (response.success) {
        // Update local state based on API response
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        
        // Notify parent component of interaction
        if (onInteraction) {
          onInteraction('like', response.action);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * Loads comments for the cheer post
   */
  const loadComments = async () => {
    if (commentsLoaded) return;

    try {
      const response = await suitebiteAPI.getCheerPost(post.cheer_post_id);
      if (response.success && response.post.comments) {
        setComments(response.post.comments);
        setCommentsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  /**
   * Handles showing/hiding comments section
   */
  const handleToggleComments = async () => {
    if (!showComments && !commentsLoaded) {
      await loadComments();
    }
    setShowComments(!showComments);
  };

  /**
   * Handles adding a new comment
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isAddingComment) return;

    try {
      setIsAddingComment(true);
      const response = await suitebiteAPI.addCheerComment({
        cheer_post_id: post.cheer_post_id,
        cheer_comment: newComment.trim(),
        additional_heartbits: 0
      });

      if (response.success) {
        // Reload comments to get the new one
        setCommentsLoaded(false);
        await loadComments();
        
        // Update comments count
        setCommentsCount(prev => prev + 1);
        
        // Clear input
        setNewComment('');
        
        // Notify parent component of interaction
        if (onInteraction) {
          onInteraction('comment', 'added');
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  /**
   * Generates user initials from first and last name
   * Used as fallback when profile picture is not available
   */
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  /**
   * Parses hashtags into an array format
   * Handles string, array, or null/undefined input
   */
  const parseHashtags = (hashtags) => {
    if (!hashtags) return [];
    
    // If already an array, return as-is
    if (Array.isArray(hashtags)) {
      return hashtags.filter(tag => tag && tag.trim());
    }
    
    // If string, parse it
    if (typeof hashtags === 'string') {
      if (hashtags.trim() === '') return [];
      
      // Handle comma-separated hashtags
      if (hashtags.includes(',')) {
        return hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      // Handle space-separated hashtags (remove # symbols if present)
      return hashtags.split(/\s+/)
        .map(tag => tag.replace(/^#/, '').trim())
        .filter(tag => tag);
    }
    
    return [];
  };

  // Parse hashtags safely
  const parsedHashtags = parseHashtags(post.hashtags);

  return (
    <div className="cheer-post-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      {/* Post Header - Shows sender, recipient(s), and heartbits earned */}
      <div className="post-header p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="user-avatar bg-[#0097b2] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
              {getInitials(post.cheerer_first_name, post.cheerer_last_name)}
            </div>
            
            {/* User Information */}
            <div className="user-info">
              <div className="flex items-center gap-2">
                {/* Sender name */}
                <h4 className="font-medium text-[#1a0202] text-sm">
                  {post.cheerer_first_name} {post.cheerer_last_name}
                </h4>
                <span className="text-xs text-[#4a6e7e]">→</span>
                
                {/* Recipients - Handle both single and group cheers */}
                {post.additional_recipients && post.additional_recipients.length > 0 ? (
                  /* Group cheer with multiple recipients */
                  <div className="flex items-center gap-1 flex-wrap">
                    <h4 className="font-medium text-[#0097b2] text-sm">
                      {post.peer_first_name} {post.peer_last_name}
                    </h4>
                    {post.additional_recipients.map((recipient, index) => (
                      <span key={recipient.peer_id || index} className="flex items-center gap-1">
                        <span className="text-xs text-[#4a6e7e]">,</span>
                        <h4 className="font-medium text-[#0097b2] text-sm">
                          {recipient.additional_first_name} {recipient.additional_last_name}
                        </h4>
                      </span>
                    ))}
                    <span className="text-xs text-[#4a6e7e] bg-[#0097b2]/10 px-2 py-1 rounded-full ml-2">
                      Group Cheer ({post.additional_recipients.length + 1} people)
                    </span>
                  </div>
                ) : (
                  /* Single recipient */
                  <h4 className="font-medium text-[#0097b2] text-sm">
                    {post.peer_first_name} {post.peer_last_name}
                  </h4>
                )}
              </div>
              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-[#4a6e7e]">
                <ClockIcon className="h-3 w-3" />
                <span>{formatTimeAgo(post.posted_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Heartbits Earned Badge - Show total for group cheers */}
          <div className="heartbits-badge bg-[#bfd1a0] text-[#1a0202] px-2 py-1 rounded-full text-xs font-medium">
            ❤️ +{post.heartbits_given}{post.additional_recipients && post.additional_recipients.length > 0 && ` each (${post.heartbits_given * (post.additional_recipients.length + 1)} total)`}
          </div>
        </div>
      </div>

      {/* Post Content - The actual cheer message */}
      <div className="post-content px-4 pb-3">
        {/* Message with styled background */}
        <div className="message-content bg-[#eee3e3] rounded-lg p-3 border-l-4 border-[#0097b2]">
          <p className="text-[#1a0202] text-sm leading-relaxed">
            {post.post_body}
          </p>
        </div>
        
        {/* Hashtags Display - Fixed to handle non-array hashtags */}
        {parsedHashtags.length > 0 && (
          <div className="hashtags mt-2 flex flex-wrap gap-1">
            {parsedHashtags.map((tag, index) => (
              <span 
                key={index}
                className="hashtag bg-[#bfd1a0] text-[#1a0202] px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions - Like button and engagement stats */}
      <div className="post-actions px-4 py-3 border-t border-[#eee3e3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`like-btn flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-200 text-xs ${
                liked 
                  ? 'bg-[#0097b2] text-white hover:bg-[#007a8e]' 
                  : 'text-[#4a6e7e] hover:bg-[#eee3e3]'
              }`}
            >
              <HeartIcon className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </span>
            </button>
            
            {/* Comments Button */}
            <button 
              onClick={handleToggleComments}
              className="comment-btn flex items-center gap-1 px-3 py-1 rounded-md text-[#4a6e7e] hover:bg-[#eee3e3] transition-colors duration-200 text-xs"
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span className="font-medium">
                {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
              </span>
            </button>
          </div>
          
          {/* Post ID for reference */}
          <div className="post-meta text-xs text-[#4a6e7e]">
            <span>#{post.cheer_post_id}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section px-4 pb-4 border-t border-[#eee3e3] bg-gray-50">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="comments-list mt-3 space-y-3">
              {comments.map((comment) => (
                <div key={comment.comment_id} className="comment bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <div className="comment-avatar bg-[#0097b2] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs">
                      {getInitials(comment.commenter_first_name, comment.commenter_last_name)}
                    </div>
                    <div className="comment-content flex-1">
                      <div className="comment-header flex items-center gap-2 mb-1">
                        <span className="commenter-name font-medium text-[#1a0202] text-sm">
                          {comment.commenter_first_name} {comment.commenter_last_name}
                        </span>
                        <span className="comment-time text-xs text-[#4a6e7e]">
                          {formatTimeAgo(comment.commented_at)}
                        </span>
                        {comment.additional_heartbits > 0 && (
                          <span className="comment-heartbits bg-[#bfd1a0] text-[#1a0202] px-1 py-0.5 rounded text-xs">
                            +{comment.additional_heartbits} ❤️
                          </span>
                        )}
                      </div>
                      <p className="comment-text text-[#1a0202] text-sm">
                        {comment.cheer_comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="add-comment-form mt-3">
            <div className="flex items-start gap-2">
              <div className="current-user-avatar bg-[#0097b2] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs">
                U
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097b2] focus:border-transparent text-sm resize-none"
                    rows="2"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isAddingComment}
                    className="comment-submit-btn bg-[#0097b2] text-white p-2 rounded-lg hover:bg-[#007a8e] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingComment ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheerPostCard;
