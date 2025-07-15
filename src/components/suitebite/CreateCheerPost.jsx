import React, { useState, useEffect, useRef } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, UserIcon } from '@heroicons/react/24/outline';

/**
 * CreateCheerPost Component
 * 
 * Allows users to create and send cheer posts to their colleagues.
 * Enhanced features include:
 * - User search with @ symbol and name search
 * - Multiple recipient selection
 * - Custom heartbits points selection
 * - Message composition with character limit
 * - Monthly sending limits tracking
 * 
 * @param {Function} onCheerPostCreated - Callback when cheer post is successfully created
 */
const CreateCheerPost = ({ onCheerPostCreated }) => {
  const [content, setContent] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [heartbitsPerPerson, setHeartbitsPerPerson] = useState(5);
  const [loading, setLoading] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState({ used: 0, limit: 0 });
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (mentionQuery.trim().length > 0) {
      performUserSearch(mentionQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [mentionQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUserData = async () => {
    try {
      const limitsResponse = await suitebiteAPI.getMonthlyLimits();
      if (limitsResponse.success) {
        setMonthlyLimit(limitsResponse.limits);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const performUserSearch = async (query) => {
    try {
      const cleanSearchTerm = query.replace('@', '').trim();
      const response = await suitebiteAPI.searchUsers(cleanSearchTerm);
      if (response.success) {
        const filteredResults = response.users.filter(
          (user) => !selectedRecipients.some((selected) => selected.user_id === user.user_id)
        );
        setSearchResults(filteredResults);
        setShowSearchResults(filteredResults.length > 0);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    const cursor = e.target.selectionStart;
    const textUpToCursor = value.slice(0, cursor);
    const atIndex = textUpToCursor.lastIndexOf('@');
    if (atIndex !== -1 && (atIndex === 0 || /\s/.test(textUpToCursor[atIndex - 1]))) {
      const query = textUpToCursor.slice(atIndex + 1);
      if (query.length > 0) {
        setMentionQuery(query);
        setMentionStart(atIndex);
        setShowSearchResults(true);
        return;
      }
    }
    setShowSearchResults(false);
    setMentionQuery('');
    setMentionStart(null);
  };

  const handleMentionSelect = (user) => {
    if (mentionStart !== null) {
      const before = content.slice(0, mentionStart);
      const after = content.slice(
        searchInputRef.current.selectionStart
      );
      const mention = `@${user.first_name} ${user.last_name} `;
      setContent(before + mention + after);
      setSelectedRecipients((prev) =>
        prev.some((u) => u.user_id === user.user_id) ? prev : [...prev, user]
      );
      setShowSearchResults(false);
      setMentionQuery('');
      setMentionStart(null);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.selectionStart = searchInputRef.current.selectionEnd =
            before.length + mention.length;
          searchInputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || selectedRecipients.length === 0) {
      return;
    }
    try {
      setLoading(true);
      if (selectedRecipients.length === 1) {
        await suitebiteAPI.createCheerPost({
          peer_id: selectedRecipients[0].user_id,
          post_body: content.trim(),
          heartbits_given: heartbitsPerPerson,
          hashtags: '',
          additional_peers: []
        });
      } else {
        const [mainRecipient, ...additionalRecipients] = selectedRecipients;
        await suitebiteAPI.createCheerPost({
          peer_id: mainRecipient.user_id,
          post_body: content.trim(),
          heartbits_given: heartbitsPerPerson,
          hashtags: '',
          additional_peers: additionalRecipients.map((recipient) => recipient.user_id)
        });
      }
      setContent('');
      setSelectedRecipients([]);
      setHeartbitsPerPerson(5);
      onCheerPostCreated();
    } catch (error) {
      console.error('Error creating cheer post:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalHeartbits = selectedRecipients.length * heartbitsPerPerson;
  const remainingLimit = monthlyLimit.limit - monthlyLimit.used;

  return (
    <div className="create-cheer-post">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header with label and heartbits input */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Send a Cheer</h2>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={heartbitsPerPerson}
              onChange={(e) => setHeartbitsPerPerson(Number(e.target.value) || 0)}
              min="1"
              placeholder="Heartbits per person"
              className="w-24 px-2 py-1 border-2 border-[#eee3e3] rounded-xl focus:ring-2 focus:ring-[#0097b2] focus:border-[#0097b2] text-sm font-medium transition-colors duration-200"
            />
            <span className="text-xs text-[#4a6e7e]">pts</span>
          </div>
        </div>
        {/* Message Content Section with @mention support */}
        <div className="content-section">
          <label className="block text-sm font-semibold text-[#1a0202] mb-3">
            Your message:
            <span className="text-[#4a6e7e] font-normal text-xs ml-2">
              (Use @mentions to reference people in your message)
            </span>
          </label>
          <div className="relative">
            <textarea
              ref={searchInputRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Share what makes these people amazing... Use @mentions to highlight specific colleagues!"
              className="w-full px-4 py-3 border-2 border-[#eee3e3] rounded-xl focus:ring-2 focus:ring-[#0097b2] focus:border-[#0097b2] text-sm resize-none transition-colors duration-200 font-medium"
              rows="4"
              maxLength="500"
              required
              style={{ lineHeight: '1.5', fontFamily: 'inherit' }}
            />
            {/* User search dropdown for @mentions */}
            {showSearchResults && (
              <div
                ref={searchDropdownRef}
                className="absolute z-50 bg-white border-2 border-[#eee3e3] rounded-xl shadow-lg max-h-60 overflow-y-auto w-full"
                style={{ left: 0, right: 0, top: '100%' }}
              >
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.slice(0, 8).map((user) => (
                      <div
                        key={user.user_id}
                        className="flex items-center gap-3 p-3 hover:bg-[#eee3e3]/50 rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => handleMentionSelect(user)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-xl flex items-center justify-center font-semibold text-sm">
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#1a0202] truncate">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-[#4a6e7e] truncate">
                            @{user.email?.split('@')[0]} • {user.job_title || 'Team Member'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#4a6e7e]">
                    <UserIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#4a6e7e]">
              {content.length}/500 characters
            </span>
            <div className="flex items-center gap-2">
              {content.includes('@') && (
                <span className="text-xs text-[#0097b2] font-medium">
                  ✨ @mentions included
                </span>
              )}
              <span className="text-xs text-[#4a6e7e]">
                {selectedRecipients.length > 1 ? 'Group cheer' : 'Individual cheer'}
              </span>
            </div>
          </div>
        </div>
        {/* Send Cheer Button Section */}
        <button
          type="submit"
          disabled={!content.trim() || selectedRecipients.length === 0 || loading || remainingLimit <= 0}
          className="submit-btn w-full bg-gradient-to-r from-[#0097b2] to-[#007a8e] text-white py-4 px-6 rounded-xl font-bold text-base hover:from-[#007a8e] hover:to-[#006775] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-bold">Sending Cheers...</span>
            </>
          ) : (
            <>
              <HeartIcon className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg">
                Send {selectedRecipients.length > 1 ? `${selectedRecipients.length} Cheers` : 'Cheer'}
              </span>
              {totalHeartbits > 0 && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {totalHeartbits} pts
                </span>
              )}
            </>
          )}
        </button>
        {/* Monthly Limit Info */}
        {monthlyLimit.limit > 0 && (
          <div className="text-center mt-2">
            <p className="text-xs text-[#4a6e7e]">
              Monthly heartbits used: <b>{monthlyLimit.used}</b> / <b>{monthlyLimit.limit}</b> heartbits
            </p>
            <p className="text-xs text-[#4a6e7e]">
              Remaining: <b>{monthlyLimit.limit - monthlyLimit.used}</b> heartbits
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateCheerPost;
