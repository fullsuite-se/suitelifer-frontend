import { HeartIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const UserHeartbitsWidget = ({ heartbits, monthlyLimits, onRefresh }) => {
  const usedPercentage = monthlyLimits ? (monthlyLimits.heartbits_sent / monthlyLimits.heartbits_limit) * 100 : 0;
  const remainingHeartbits = monthlyLimits ? monthlyLimits.heartbits_limit - monthlyLimits.heartbits_sent : 0;

  return (
    <div className="user-heartbits-widget bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      {/* Header */}
      <div className="widget-header flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a0202]">💖 Your Heartbits</h3>
        <button
          onClick={onRefresh}
          className="refresh-btn p-2 text-[#4a6e7e] hover:text-[#0097b2] hover:bg-[#eee3e3] rounded-lg transition-colors duration-200"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Current Balance */}
      <div className="current-balance mb-4">
        <div className="balance-display bg-[#0097b2] text-white rounded-lg p-3">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-6 w-6" />
            <div>
              <div className="text-2xl font-bold">{heartbits}</div>
              <div className="text-sm opacity-90">Available Heartbits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Limits */}
      {monthlyLimits && (
        <div className="monthly-limits space-y-3">
          <div className="limit-header">
            <h4 className="text-sm font-medium text-[#1a0202] mb-2">Monthly Sending Limit</h4>
          </div>
          
          <div className="limit-progress">
            <div className="progress-bar bg-[#eee3e3] rounded-full h-3 overflow-hidden">
              <div 
                className="progress-fill bg-[#0097b2] h-full transition-all duration-300"
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="limit-stats flex justify-between items-center mt-2">
              <span className="text-xs text-[#4a6e7e]">
                {monthlyLimits.heartbits_sent} / {monthlyLimits.heartbits_limit} used
              </span>
              <span className="text-xs text-[#4a6e7e]">
                {remainingHeartbits} remaining
              </span>
            </div>
          </div>
          
          {/* Limit Status */}
          <div className="limit-status">
            {usedPercentage >= 100 ? (
              <div className="limit-warning bg-red-50 text-red-800 p-2 rounded-lg text-xs">
                ⚠️ Monthly limit reached! You&apos;ve used all your heartbits for this month.
              </div>
            ) : usedPercentage >= 80 ? (
              <div className="limit-warning bg-yellow-50 text-yellow-800 p-2 rounded-lg text-xs">
                ⚠️ Almost at your monthly limit! You&apos;ve used {Math.round(usedPercentage)}% of your heartbits.
              </div>
            ) : (
              <div className="limit-info bg-green-50 text-green-800 p-2 rounded-lg text-xs">
                ✅ You have {remainingHeartbits} heartbits remaining this month.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions mt-4 pt-4 border-t border-gray-200">
        <div className="action-buttons grid grid-cols-2 gap-2">
          <button className="action-btn bg-[#eee3e3] text-[#1a0202] py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#bfd1a0] transition-colors duration-200">
            💝 Send Cheer
          </button>
          <button className="action-btn bg-[#eee3e3] text-[#1a0202] py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#bfd1a0] transition-colors duration-200">
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHeartbitsWidget;
