import { TrophyIcon } from '@heroicons/react/24/outline';

const LeaderboardCard = ({ user, rank, type, isPodium }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getTypeLabel = (type) => {
    return type === 'received' ? 'Received' : 'Given';
  };

  const getTypeValue = (type, user) => {
    if (type === 'received') {
      return user.total_heartbits_received || 0;
    }
    return user.total_heartbits_given || 0;
  };

  const getTypeIcon = (type) => {
    return type === 'received' ? '❤️' : '💝';
  };

  return (
    <div className={`leaderboard-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 ${isPodium ? 'ring-2 ring-[#0097b2]' : ''}`}>
      {/* Rank Badge */}
      <div className="rank-badge absolute top-2 left-2 z-10">
        <div className={`rank-display w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
          rank === 2 ? 'bg-gray-300 text-gray-700' :
          rank === 3 ? 'bg-orange-400 text-orange-900' :
          'bg-[#0097b2] text-white'
        }`}>
          {getRankDisplay(rank)}
        </div>
      </div>

      {/* User Info */}
      <div className="user-info p-4 pt-6">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="user-avatar relative">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0097b2]"
              />
            ) : (
              <div className="w-12 h-12 bg-[#0097b2] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                {getInitials(user.first_name, user.last_name)}
              </div>
            )}
            
            {/* Podium Indicator */}
            {isPodium && (
              <div className="podium-indicator absolute -top-1 -right-1">
                <TrophyIcon className="h-5 w-5 text-yellow-500" />
              </div>
            )}
          </div>
          
          {/* User Details */}
          <div className="user-details flex-1">
            <div className="user-name font-semibold text-[#1a0202] text-sm">
              {/* Patch: If user is admin grant, show 'Admin' */}
              {user.is_admin_grant ? 'Admin' : `${user.first_name} ${user.last_name}`}
            </div>
            <div className="user-stats text-xs text-[#4a6e7e]">
              {getTypeIcon(type)} {getTypeLabel(type)}: {getTypeValue(type, user)} heartbits
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary bg-[#eee3e3] p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="stat-item">
            <span className="stat-label text-[#4a6e7e]">Given:</span>
            <span className="stat-value font-semibold text-[#1a0202]">
              {user.total_heartbits_given || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label text-[#4a6e7e]">Received:</span>
            <span className="stat-value font-semibold text-[#1a0202]">
              {user.total_heartbits_received || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
