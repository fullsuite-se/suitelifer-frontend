import React, { useState } from 'react';
import {
  StarIcon,
  GiftIcon,
  ChartBarIcon,
  HeartIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';

// Mock data for UI only
const mockUser = { id: 1, first_name: 'Jane', last_name: 'Doe' };
const mockPointsData = {
  currentBalance: 80,
  monthlyCheerLimit: 100,
  monthlyCheerUsed: 20,
  totalEarned: 200,
  totalSpent: 120,
};
const mockHistoryData = [
  {
    type: 'purchase',
    amount: 10,
    description: 'Bought a mug',
    createdAt: new Date().toISOString(),
    related_user: null,
  },
  {
    type: 'given',
    amount: 5,
    description: 'Cheered John',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    related_user: 'John Smith',
  },
  {
    type: 'received',
    amount: 8,
    description: 'Received from Alice',
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    related_user: 'Alice Lee',
  },
];
const mockUsers = [
  { id: 2, first_name: 'John', last_name: 'Smith' },
  { id: 3, first_name: 'Alice', last_name: 'Lee' },
];

const PointsDashboardUIOnly = () => {
  const [cheerModalOpen, setCheerModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [cheerAmount, setCheerAmount] = useState(10);
  const [cheerMessage, setCheerMessage] = useState('');

  // Safe date formatting function
  const formatDateSafely = (dateValue) => {
    try {
      if (!dateValue) return 'No date';
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <GiftIcon className="w-5 h-5 text-red-500" />;
      case 'given':
        return <HeartIcon className="w-5 h-5 text-pink-500" />;
      case 'received':
        return <HeartIcon className="w-5 h-5 text-green-500" />;
      case 'admin_grant':
      case 'admin_added':
        return <PlusIcon className="w-5 h-5 text-blue-500" />;
      case 'admin_deduct':
        return <PlusIcon className="w-5 h-5 text-red-500" />;
      default:
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase':
      case 'given':
      case 'admin_deduct':
        return 'text-red-600';
      case 'received':
      case 'admin_grant':
      case 'admin_added':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSendCheer = (e) => {
    e.preventDefault();
    if (!selectedUser || cheerAmount < 1) {
      alert('Please select a user and enter a valid amount');
      return;
    }
    alert('Cheer sent successfully!');
    setCheerModalOpen(false);
    setSelectedUser('');
    setCheerMessage('');
    setCheerAmount(10);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <StarIcon className="w-8 h-8 text-yellow-500" />
            Points Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your points, rewards, and heartbits</p>
        </div>
        <button
          onClick={() => setCheerModalOpen(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <HeartIcon className="w-5 h-5" />
          Send Heartbits
        </button>
      </div>
      {/* Points Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Current Balance</p>
              <p className="text-3xl font-bold">{mockPointsData.currentBalance}</p>
              <p className="text-yellow-100 text-xs">Points</p>
            </div>
            <StarIconSolid className="w-12 h-12 text-yellow-200" />
          </div>
        </div>
        {/* Heartbits Remaining */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Heartbits Remaining</p>
              <p className="text-3xl font-bold">
                {mockPointsData.monthlyCheerLimit - mockPointsData.monthlyCheerUsed}
              </p>
              <p className="text-pink-100 text-xs">This Month</p>
            </div>
            <HeartIconSolid className="w-12 h-12 text-pink-200" />
          </div>
        </div>
        {/* Total Earned */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-bold">{mockPointsData.totalEarned}</p>
              <p className="text-green-100 text-xs">All Time</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>
        {/* Total Spent */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold">{mockPointsData.totalSpent}</p>
              <p className="text-blue-100 text-xs">Points</p>
            </div>
            <GiftIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-gray-500" />
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockHistoryData.length > 0 ? (
            mockHistoryData.map((transaction, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateSafely(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'purchase' || transaction.type === 'given' || transaction.type === 'admin_deduct' ? '-' : '+'}
                      {transaction.amount} pts
                    </p>
                    {transaction.related_user && (
                      <p className="text-sm text-gray-500">
                        {transaction.type === 'given' ? 'to' : 'from'} {transaction.related_user}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
      {/* Send Heartbits Modal */}
      {cheerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HeartIcon className="w-6 h-6 text-pink-500" />
              Send Heartbits
            </h3>
            <form onSubmit={handleSendCheer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a user...</option>
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Points)
                </label>
                <input
                  type="number"
                  min="1"
                  max={mockPointsData.currentBalance}
                  value={cheerAmount}
                  onChange={(e) => setCheerAmount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={cheerMessage}
                  onChange={(e) => setCheerMessage(e.target.value)}
                  placeholder="Add a nice message..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCheerModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Send Heartbits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsDashboardUIOnly;
