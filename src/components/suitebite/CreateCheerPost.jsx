import React, { useState, useEffect, useRef } from 'react';
import { suitebiteAPI } from '../../utils/suitebiteAPI';
import { HeartIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

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
  // Form state management
  const [content, setContent] = useState(''); // Cheer message content
  const [selectedRecipients, setSelectedRecipients] = useState([]); // Selected recipients array
  const [searchTerm, setSearchTerm] = useState(''); // User search term
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [showSearchResults, setShowSearchResults] = useState(false); // Show/hide search dropdown
  const [heartbitsPerPerson, setHeartbitsPerPerson] = useState(5); // Points per person
  const [loading, setLoading] = useState(false); // Form submission loading state
  const [monthlyLimit, setMonthlyLimit] = useState({ used: 0, limit: 0 }); // Monthly sending limits

  // Refs for managing search dropdown
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Handle search when search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      performUserSearch();
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Loads user's monthly sending limits from the API
   */
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

  /**
   * Performs user search based on search term
   * Supports searching by name or @ symbol
   */
  const performUserSearch = async () => {
    try {
      // Remove @ symbol if present for API search
      const cleanSearchTerm = searchTerm.replace('@', '').trim();
      const response = await suitebiteAPI.searchUsers(cleanSearchTerm);
      
      if (response.success) {
        // Filter out already selected recipients
        const filteredResults = response.users.filter(user => 
          !selectedRecipients.some(selected => selected.user_id === user.user_id)
        );
        setSearchResults(filteredResults);
        setShowSearchResults(filteredResults.length > 0);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  /**
   * Handles user search input change
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  /**
   * Adds a user to selected recipients and inserts @mention in content
   */
  const addRecipient = (user) => {
    if (!selectedRecipients.some(selected => selected.user_id === user.user_id)) {
      setSelectedRecipients([...selectedRecipients, user]);
      
      // Add @mention to content if there's existing content
      const mention = `@${user.first_name} ${user.last_name}`;
      if (content.trim()) {
        setContent(prev => prev + ` ${mention}`);
      } else {
        setContent(mention + ' ');
      }
    }
    setSearchTerm('');
    setShowSearchResults(false);
    searchInputRef.current?.focus();
  };

  /**
   * Removes a user from selected recipients
   */
  const removeRecipient = (userId) => {
    setSelectedRecipients(selectedRecipients.filter(user => user.user_id !== userId));
  };

  /**
   * Gets user initials for avatar display
   */
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  /**
   * Handles form submission to create cheer posts
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!content.trim() || selectedRecipients.length === 0) {
      return;
    }

    try {
      setLoading(true);
      
      if (selectedRecipients.length === 1) {
        // Single recipient - simple cheer post
        await suitebiteAPI.createCheerPost({
          peer_id: selectedRecipients[0].user_id,
          post_body: content.trim(),
          heartbits_given: heartbitsPerPerson,
          hashtags: '',
          additional_peers: []
        });
      } else {
        // Group cheer - create ONE post with main recipient and additional peers
        const [mainRecipient, ...additionalRecipients] = selectedRecipients;
        
        await suitebiteAPI.createCheerPost({
          peer_id: mainRecipient.user_id,
          post_body: content.trim(),
          heartbits_given: heartbitsPerPerson,
          hashtags: '',
          additional_peers: additionalRecipients.map(recipient => recipient.user_id)
        });
      }

      // Reset form and notify parent component
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

  // Calculate totals
  const totalHeartbits = selectedRecipients.length * heartbitsPerPerson;
  const remainingLimit = monthlyLimit.limit - monthlyLimit.used;

  return (
    <div className="create-cheer-post">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Search Section */}
        <div className="user-search-section">
          <label className="block text-sm font-semibold text-[#1a0202] mb-3">
            Send to: <span className="text-[#4a6e7e] font-normal">(Search with @username or name)</span>
          </label>
          
          {/* Search Input Row with Heartbits */}
          <div className="grid grid-cols-3 gap-4">
            {/* Search Input - 2/3 width */}
            <div className="col-span-2 relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a6e7e]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Type @username or search by name..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#eee3e3] rounded-xl focus:ring-2 focus:ring-[#0097b2] focus:border-[#0097b2] text-sm transition-colors duration-200"
                  onFocus={() => searchTerm && setShowSearchResults(true)}
                />
              </div>

              {/* Search Results Dropdown with Quick Add Buttons */}
              {showSearchResults && (
                <div 
                  ref={searchDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#eee3e3] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.slice(0, 8).map(user => (
                        <div
                          key={user.user_id}
                          className="flex items-center gap-3 p-3 hover:bg-[#eee3e3]/50 rounded-lg transition-colors duration-200"
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
                          {/* Quick Add Button */}
                          <button
                            type="button"
                            onClick={() => addRecipient(user)}
                            className="bg-gradient-to-r from-[#0097b2] to-[#007a8e] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-[#007a8e] hover:to-[#006775] transition-all duration-200 flex items-center gap-1"
                          >
                            <span>+</span>
                            <span>{user.first_name}</span>
                          </button>
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

            {/* Heartbits Input - 1/3 width */}
            <div className="col-span-1">
              <div className="relative">
                <input
                  type="number"
                  value={heartbitsPerPerson}
                  onChange={(e) => setHeartbitsPerPerson(Number(e.target.value) || 0)}
                  min="1"
                  placeholder="Heartbits per person"
                  className="w-full px-4 py-3 border-2 border-[#eee3e3] rounded-xl focus:ring-2 focus:ring-[#0097b2] focus:border-[#0097b2] text-sm font-medium transition-colors duration-200"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[#4a6e7e] pointer-events-none">
                  pts
                </span>
              </div>
            </div>
          </div>

          {/* Selected Recipients */}
          {selectedRecipients.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[#1a0202]">
                  Selected Recipients ({selectedRecipients.length}):
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#4a6e7e]">Total:</span>
                  <span className="font-bold text-[#0097b2] bg-[#0097b2]/10 px-3 py-1 rounded-lg">
                    {totalHeartbits} heartbits
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRecipients.map(user => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#0097b2]/10 to-[#0097b2]/20 px-3 py-2 rounded-xl border border-[#0097b2]/20"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#0097b2] to-[#007a8e] text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                    <span className="text-sm font-medium text-[#1a0202]">
                      {user.first_name} {user.last_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRecipient(user.user_id)}
                      className="text-[#4a6e7e] hover:text-red-500 transition-colors duration-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Content Section with @mention support */}
        <div className="content-section">
          <label className="block text-sm font-semibold text-[#1a0202] mb-3">
            Your message:
            <span className="text-[#4a6e7e] font-normal text-xs ml-2">
              (Use @mentions to reference people in your message)
            </span>
          </label>
          
          {/* Enhanced textarea with @mention styling hints */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what makes these people amazing... Use @mentions to highlight specific colleagues!"
              className="w-full px-4 py-3 border-2 border-[#eee3e3] rounded-xl focus:ring-2 focus:ring-[#0097b2] focus:border-[#0097b2] text-sm resize-none transition-colors duration-200 font-medium"
              rows="4"
              maxLength="500"
              required
              style={{
                lineHeight: '1.5',
                fontFamily: 'inherit'
              }}
            />
            
            {/* @mention indicator */}
            {content.includes('@') && (
              <div className="absolute top-2 right-2">
                <div className="bg-[#0097b2]/10 text-[#0097b2] px-2 py-1 rounded-md text-xs font-medium">
                  @mentions detected
                </div>
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
