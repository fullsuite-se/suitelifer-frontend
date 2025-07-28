import React, { useState } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, ChatBubbleLeftIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { formatTimeAgo, formatFullDateTime } from '../../utils/dateHelpers';

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
  // Like state
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

  // Defensive sender logic from sl_cheers
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // If admin grant, show Admin, else show sender from sl_cheers
  const isAdminGrant = post.is_admin_grant || (!post.cheerer_first_name && !post.cheerer_last_name);
  const senderName = isAdminGrant
    ? 'Admin'
    : [post.cheerer_first_name, post.cheerer_last_name].filter(Boolean).join(' ').trim() || 'Unknown';
  const senderInitials = isAdminGrant
    ? 'A'
    : getInitials(post.cheerer_first_name, post.cheerer_last_name) || 'U';

  // Like handler
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const response = await suitebiteAPI.toggleCheerLike({ cheer_post_id: post.cheer_post_id });
      if (response.success) {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        if (onInteraction) onInteraction('like', response.action);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Load comments
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

  // Toggle comments
  const handleToggleComments = async () => {
    if (!showComments && !commentsLoaded) await loadComments();
    setShowComments(!showComments);
  };

  // Add comment
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
        setCommentsLoaded(false);
        await loadComments();
        setCommentsCount(prev => prev + 1);
        setNewComment('');
        if (onInteraction) onInteraction('comment', 'added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  // Parse hashtags
  const parseHashtags = (hashtags) => {
    if (!hashtags) return [];
    if (Array.isArray(hashtags)) return hashtags.filter(tag => tag && tag.trim());
    if (typeof hashtags === 'string') {
      if (hashtags.trim() === '') return [];
      if (hashtags.includes(',')) return hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
      return hashtags.split(/\s+/).map(tag => tag.replace(/^#/, '').trim()).filter(tag => tag);
    }
    return [];
  };
  const parsedHashtags = parseHashtags(post.hashtags);

  // Card UI
  return (
    <div className="cheer-post-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      {/* Post Header - Shows sender, recipient(s), and heartbits earned */}
      <div className="post-header p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="user-avatar bg-[#0097b2] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
              {senderInitials}
            </div>
            
            {/* User Information */}
            <div className="user-info">
              <div className="flex items-center gap-2">
                {/* Sender name */}
                <h4 className="font-medium text-[#1a0202] text-sm">
                  {senderName}
                </h4>
                <span className="text-xs text-[#4a6e7e]">→</span>
                
                {/* Recipients - Handle both single and group cheers */}
                {Array.isArray(post.additional_recipients) && post.additional_recipients.length > 0 ? (
                  /* Group cheer with multiple recipients */
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Main recipient */}
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                        {getInitials(post.peer_first_name, post.peer_last_name)}
                      </div>
                      <span className="font-medium text-[#0097b2] text-sm">
                        {post.peer_first_name} {post.peer_last_name}
                      </span>
                    </div>
                    {/* Additional recipients */}
                    {post.additional_recipients.map((recipient, index) => (
                      <div key={recipient.peer_id || index} className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                          {getInitials(recipient.additional_first_name, recipient.additional_last_name)}
                        </div>
                        <span className="font-medium text-[#0097b2] text-sm">
                          {recipient.additional_first_name} {recipient.additional_last_name}
                        </span>
                      </div>
                    ))}
                    {/* Group indicator */}
                    <div className="bg-gradient-to-r from-[#0097b2]/10 to-[#0097b2]/20 text-[#0097b2] px-3 py-1 rounded-full text-xs font-medium border border-[#0097b2]/20">
                      <span className="flex items-center gap-1">
                        <span>👥</span>
                        <span>Group ({post.additional_recipients.length + 1})</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Single recipient */
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                      {getInitials(post.peer_first_name, post.peer_last_name)}
                    </div>
                    <span className="font-medium text-[#0097b2] text-sm">
                      {post.peer_first_name} {post.peer_last_name}
                    </span>
                  </div>
                )}
              </div>
              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-[#4a6e7e]">
                <ClockIcon className="h-3 w-3" />
                <span>{formatTimeAgo(post.posted_at)}</span>
              </div>
            </div>
          </div>
          {/* Formatted Date - Top right */}
          <div className="flex flex-col items-end ml-2 min-w-[160px]">
            <span className="text-xs text-gray-500 font-medium">
              {formatFullDateTime(post.createdAt || post.posted_at)}
            </span>
          </div>
          {/* Heartbits Earned Badge - Show total for group cheers */}
          <div className="heartbits-badge flex items-center gap-2">
            {post.additional_recipients && post.additional_recipients.length > 0 ? (
              /* Group cheer heartbits */
              <div className="bg-gradient-to-r from-[#bfd1a0] to-[#a8c084] text-[#1a0202] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#bfd1a0]">
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span>+{post.heartbits_given} each</span>
                </div>
                <div className="text-xs font-medium opacity-80">
                  Total: {post.heartbits_given * (post.additional_recipients.length + 1)} heartbits
                </div>
              </div>
            ) : (
              /* Single cheer heartbits */
              <div className="bg-gradient-to-r from-[#bfd1a0] to-[#a8c084] text-[#1a0202] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#bfd1a0]">
                <span className="flex items-center gap-1">
                  <span>❤️</span>
                  <span>+{post.heartbits_given} heartbits</span>
                </span>
              </div>
            )}
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
