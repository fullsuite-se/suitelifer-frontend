import React from 'react';
import { Cog6ToothIcon, BoltIcon } from '@heroicons/react/24/outline';
import api from '../../utils/axios';

const defaultSettings = {
  pointsDistribution: {
    dailyLoginBonus: 1,
    taskCompletion: 5,
    birthdayBounty: 10,
    suiteSpotOneYearAward: 100
  },
  automation: {
    autoApprovalLimit: 0,
    notificationFrequency: 'immediate',
    backupSchedule: 'daily',
    reportGeneration: 'EOD',
    pointExpiryMonths: 12
  }
};

const AdminPointsSystem = () => {
  const [settings, setSettings] = React.useState(defaultSettings);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    api.get('/api/system-settings')
      .then(res => {
        if (res.data?.data) setSettings(res.data.data);
      })
      .catch(() => setError('Failed to load system settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/api/system-settings', settings);
      setSuccess('Settings saved successfully!');
    } catch (e) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-0 flex justify-center">
      <div className="w-full bg-white rounded-none shadow-none p-0 m-0 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Suite Settings</h1>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 transition-all duration-150"
            onClick={handleSave}
            disabled={saving || loading}
          >
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4 text-center font-medium">{error}</div>}
        {success && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-3 mb-4 text-center font-medium">{success}</div>}
        {loading ? (
          <div className="text-gray-500 text-lg text-center py-10">Loading system settings...</div>
        ) : (
          <div className="space-y-10">
            {/* Points Distribution */}
            <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200 flex items-center space-x-2">
                <BoltIcon className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold text-gray-900">Points Distribution</span>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Daily Login Bonus</label>
                  <input
                    type="number"
                    min={1}
                    value={settings.pointsDistribution.dailyLoginBonus}
                    onChange={e => handleChange('pointsDistribution', 'dailyLoginBonus', Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Points for daily login (must be 1 or more)</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Task Completion</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.pointsDistribution.taskCompletion}
                    onChange={e => handleChange('pointsDistribution', 'taskCompletion', Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Points for completing a task</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Birthday Bounty</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.pointsDistribution.birthdayBounty}
                    onChange={e => handleChange('pointsDistribution', 'birthdayBounty', Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Points awarded on user's birthday</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">SuiteSpot One-Year Award</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.pointsDistribution.suiteSpotOneYearAward}
                    onChange={e => handleChange('pointsDistribution', 'suiteSpotOneYearAward', Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Points for 1-year employment anniversary</p>
                </div>
              </div>
            </div>

            {/* Automation */}
            <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200 flex items-center space-x-2">
                <Cog6ToothIcon className="w-6 h-6 text-green-500" />
                <span className="text-xl font-semibold text-gray-900">Automation</span>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Auto Approval Limit</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.automation.autoApprovalLimit}
                    onChange={e => handleChange('automation', 'autoApprovalLimit', Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Points limit for auto-approval</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Notification Frequency</label>
                  <select
                    value={settings.automation.notificationFrequency}
                    onChange={e => handleChange('automation', 'notificationFrequency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">How often notifications are sent</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Backup Schedule</label>
                  <select
                    value={settings.automation.backupSchedule}
                    onChange={e => handleChange('automation', 'backupSchedule', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Frequency of system data backups</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Report Generation</label>
                  <select
                    value={settings.automation.reportGeneration}
                    onChange={e => handleChange('automation', 'reportGeneration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="EOD">End of Day (EOD)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Automated report generation schedule</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Point Expiry (Months)</label>
                  <input
                    type="number"
                    min={1}
                    value={settings.automation.pointExpiryMonths}
                    onChange={e => handleChange('automation', 'pointExpiryMonths', Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Unused monthly heartbits expire at the start of each month. Heartbits you give to others are permanent for the receiver.
                  </p>
                </div>
              </div>
              <div className="h-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPointsSystem;
