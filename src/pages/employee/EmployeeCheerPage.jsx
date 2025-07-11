import React, { useState, useRef } from 'react';
import {
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  TrophyIcon,
  CalendarDaysIcon,
  FireIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';

// Mock data for UI only
const mockUser = {
  id: 1,
  first_name: 'Jane',
  last_name: 'Doe',
  profile_pic: '',
};
const mockPointsData = {
  monthlyCheerLimit: 100,
  monthlyCheerUsed: 20,
  monthlyReceivedHeartbits: 15,
};
const mockFeed = [
  {
    cheer_id: 1,
    fromUser: { name: 'Jane Doe', avatar: '', },
    toUser: { name: 'John Smith', avatar: '', },
    points: 5,
    message: 'Great teamwork!',
    heartCount: 3,
    commentCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    cheer_id: 2,
    fromUser: { name: 'Alice Lee', avatar: '', },
    toUser: { name: 'Jane Doe', avatar: '', },
    points: 2,
    message: 'Thanks for your help!',
    heartCount: 1,
    commentCount: 0,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];
const mockLeaderboard = [
  { userId: 1, name: 'Jane Doe', avatar: '', totalPoints: 50 },
  { userId: 2, name: 'John Smith', avatar: '', totalPoints: 40 },
  { userId: 3, name: 'Alice Lee', avatar: '', totalPoints: 35 },
];

const CheerPageUIOnly = () => {
  // Form state
  const [cheerText, setCheerText] = useState('');
  const [cheerPoints, setCheerPoints] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');
  const [commentingCheer, setCommentingCheer] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedCheers, setLikedCheers] = useState(new Set());
  const [cheerComments, setCheerComments] = useState(new Map());
  const [loadingComments, setLoadingComments] = useState(false);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock user search
  const mockSearchResults = [
    { user_id: 2, name: 'John Smith', email: 'john@example.com', avatar: '' },
    { user_id: 3, name: 'Alice Lee', email: 'alice@example.com', avatar: '' },
  ];

  // UI-only handlers
  const handleCheerSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !cheerText.trim()) {
      alert('Please select a user and write a message');
      return;
    }
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
    setCheerText('');
    setSelectedUser(null);
    setCheerPoints(1);
  };
  const handleCheerTextChange = (e) => {
    const value = e.target.value;
    setCheerText(value);
    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      setSearchQuery(mentionMatch[1]);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
      setSearchQuery('');
    }
  };
  const handleUserSelect = (user) => {
    setCheerText(cheerText.replace(/@\w*$/, `@${user.name} `));
    setSelectedUser(user);
    setShowUserDropdown(false);
  };
  const handleLike = (cheerId) => {
    setLikedCheers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cheerId)) newSet.delete(cheerId);
      else newSet.add(cheerId);
      return newSet;
    });
  };
  const handleCommentClick = (cheerId) => {
    setCommentingCheer(commentingCheer === cheerId ? null : cheerId);
  };
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setCheerComments((prev) => {
      const newMap = new Map(prev);
      const comments = newMap.get(commentingCheer) || [];
      newMap.set(commentingCheer, [
        {
          _id: Date.now(),
          comment: commentText,
          fromUser: { name: `${mockUser.first_name} ${mockUser.last_name}` },
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ]);
      return newMap;
    });
    setCommentText('');
  };
  const formatTimeAgo = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const availableHeartbits = (mockPointsData.monthlyCheerLimit || 100) - (mockPointsData.monthlyCheerUsed || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <HeartIconSolid className="w-5 h-5" />
          <span className="font-medium">Cheer sent successfully! 🎉</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center">
            <HeartIconSolid className="w-8 h-8 mr-3 text-orange-500" />
            Cheer a Peer
          </h1>
          <p className="text-lg text-blue-600">Spread positivity and recognize your colleagues</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-orange-500" />
                Create a Cheer Post
              </h3>
              <form onSubmit={handleCheerSubmit} className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <textarea
                    ref={textareaRef}
                    value={cheerText}
                    onChange={handleCheerTextChange}
                    placeholder="Mention a peer using '@' and spread some positivity! 😊"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
                    rows={4}
                  />
                  {showUserDropdown && mockSearchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {mockSearchResults.map((result) => (
                        <button
                          key={result.user_id}
                          type="button"
                          onClick={() => handleUserSelect(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                        >
                          <img
                            src={result.avatar || '/images/default-avatar.png'}
                            alt={result.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{result.name}</p>
                            <p className="text-sm text-gray-500">{result.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Heartbits:</label>
                    <input
                      type="number"
                      min="1"
                      max={Math.min(100, availableHeartbits)}
                      value={cheerPoints}
                      onChange={(e) => setCheerPoints(Math.min(Math.max(1, parseInt(e.target.value) || 1), Math.min(100, availableHeartbits)))}
                      className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-semibold"
                    />
                    <span className="text-xs text-gray-500">max {Math.min(100, availableHeartbits)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedUser || !cheerText.trim() || cheerPoints > availableHeartbits}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center space-x-2 shadow-lg"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Send Heartbits</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-sm border border-orange-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-orange-900">Heartbits</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <HeartIconSolid className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {availableHeartbits} | {mockPointsData.monthlyReceivedHeartbits}
                  </div>
                  <div className="text-lg text-gray-700 font-medium">heartbits remaining | received this month</div>
                </div>
                <div className="border-t border-orange-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      {mockPointsData.monthlyCheerUsed} used
                    </span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full font-medium">
                      out of {mockPointsData.monthlyCheerLimit}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-pink-500 h-3 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(((mockPointsData.monthlyCheerUsed) / (mockPointsData.monthlyCheerLimit)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">
                        {Math.round(((mockPointsData.monthlyCheerUsed) / (mockPointsData.monthlyCheerLimit)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-blue-900 flex items-center">
                  <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Cheers
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {mockFeed.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {mockFeed.map((cheer) => (
                      <div key={cheer.cheer_id} className="p-6">
                        <div className="flex space-x-3">
                          <img
                            src={cheer.fromUser?.avatar || '/images/default-avatar.png'}
                            alt={cheer.fromUser?.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {cheer.fromUser?.name}
                              </span>
                              <span className="text-gray-500">cheered</span>
                              <span className="font-medium text-gray-900">
                                {cheer.toUser?.name}
                              </span>
                              <span className="text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full text-xs">
                                +{cheer.points} pts
                              </span>
                            </div>
                            {cheer.message && (
                              <p className="text-gray-700 mb-3">{cheer.message}</p>
                            )}
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleLike(cheer.cheer_id)}
                                className={`flex items-center space-x-1 transition-colors ${
                                  likedCheers.has(cheer.cheer_id) 
                                    ? 'text-pink-500' 
                                    : 'text-gray-500 hover:text-pink-500'
                                }`}
                              >
                                {likedCheers.has(cheer.cheer_id) ? (
                                  <HeartIconSolid className="w-4 h-4" />
                                ) : (
                                  <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="text-sm">{cheer.heartCount}</span>
                              </button>
                              <button
                                onClick={() => handleCommentClick(cheer.cheer_id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                              >
                                <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                                <span className="text-sm">{cheer.commentCount}</span>
                              </button>
                              <span className="text-xs text-gray-400">{formatTimeAgo(cheer.createdAt)}</span>
                            </div>
                            {commentingCheer === cheer.cheer_id && (
                              <div className="mt-3">
                                <div className="flex space-x-2 mb-3">
                                  <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && commentText.trim()) handleAddComment();
                                    }}
                                  />
                                  <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    Post
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  {(cheerComments.get(cheer.cheer_id) || []).map((comment, index) => (
                                    <div key={comment._id || `comment-${cheer.cheer_id}-${index}`} className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-xs font-medium text-blue-600">
                                            {comment.fromUser?.name ? comment.fromUser.name.charAt(0) : '?'}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-900">
                                              {comment.fromUser?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {formatTimeAgo(comment.createdAt)}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!cheerComments.get(cheer.cheer_id) || cheerComments.get(cheer.cheer_id).length === 0) && (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                      No comments yet. Be the first to comment!
                                    </p>
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
                    <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No cheers yet. Be the first to spread some positivity!</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-900 flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Leaderboard
                </h3>
                <div className="flex space-x-2">
                  {['weekly', 'monthly', 'all-time'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setActiveTab(period)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === period
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              {mockLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {mockLeaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.userId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <img
                        src={entry.avatar || '/images/default-avatar.png'}
                        alt={entry.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.name}</p>
                      </div>
                      <span className="font-bold text-purple-600">{entry.totalPoints} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No leaderboard data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheerPageUIOnly;
