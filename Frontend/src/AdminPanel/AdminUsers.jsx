import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import axios from 'axios'

// Status badge component
function StatusBadge({ status }) {
  const statusMap = {
    Active: { color: "green", text: "Active" },
    Pending: { color: "yellow", text: "Pending" },
    Inactive: { color: "gray", text: "Inactive" },
    Banned: { color: "red", text: "Banned" }
  }

  const statusInfo = statusMap[status] || { color: "gray", text: status }

  const colorMap = {
    green: "border-green-500/30 text-green-400 bg-green-500/10",
    yellow: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    red: "border-red-500/30 text-red-400 bg-red-500/10",
    gray: "border-gray-500/30 text-gray-400 bg-gray-500/10"
  }

  return (
    <span className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${colorMap[statusInfo.color]}`}>
      {statusInfo.text}
    </span>
  )
}

// Memoized EditModal component
const EditModal = memo(({
  showEditModal,
  editForm,
  onClose,
  onSave,
  onFieldChange,
  onPreferenceChange,
  onNotificationChange
}) => {
  if (!showEditModal) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] md:max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-white/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary text-xl md:text-2xl">edit</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Edit User Profile</h3>
                <p className="text-xs sm:text-sm text-slate-400">Update user information and preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-slate-400 text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Grid Container - Wider on PC */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

              {/* Left Column - Basic Info & Profile */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Basic Information Card */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="material-symbols-outlined text-primary text-sm md:text-base">person</span>
                    <h4 className="text-sm md:text-base font-bold text-white">Basic Information</h4>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => onFieldChange('name', e.target.value)}
                        className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => onFieldChange('email', e.target.value)}
                        className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number *</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => onFieldChange('phone', e.target.value)}
                        className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Details Card */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="material-symbols-outlined text-primary text-sm md:text-base">account_circle</span>
                    <h4 className="text-sm md:text-base font-bold text-white">Profile Details</h4>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => onFieldChange('location', e.target.value)}
                        className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                        placeholder="New York, USA"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Age</label>
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) => onFieldChange('age', e.target.value)}
                          className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                          placeholder="25"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Weight</label>
                        <input
                          type="number"
                          value={editForm.weight}
                          onChange={(e) => onFieldChange('weight', e.target.value)}
                          className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                          placeholder="70"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Height</label>
                        <input
                          type="number"
                          value={editForm.height}
                          onChange={(e) => onFieldChange('height', e.target.value)}
                          className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 text-sm md:text-base"
                          placeholder="175"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preferences & Admin Controls */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Preferences Card */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="material-symbols-outlined text-primary text-sm md:text-base">settings</span>
                    <h4 className="text-sm md:text-base font-bold text-white">Preferences</h4>
                  </div>
                  <div className="space-y-4 lg:space-y-5">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Language</label>
                      <div className="relative">
                        <select
                          value={editForm.preferences?.language || "English"}
                          onChange={(e) => onPreferenceChange('language', e.target.value)}
                          className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none text-sm md:text-base"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div>
                      <h5 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 lg:mb-4">Notifications</h5>
                      <div className="space-y-3 bg-charcoal/50 rounded-xl p-3 lg:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <span className="material-symbols-outlined text-primary text-sm md:text-base">notifications</span>
                            </div>
                            <div>
                              <p className="text-sm md:text-base font-medium text-white">Daily Reminders</p>
                              <p className="text-xs md:text-sm text-slate-400">Workout notifications</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.notifications?.dailyReminder || false}
                              onChange={(e) => onNotificationChange('dailyReminder', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <span className="material-symbols-outlined text-primary text-sm md:text-base">summarize</span>
                            </div>
                            <div>
                              <p className="text-sm md:text-base font-medium text-white">Weekly Reports</p>
                              <p className="text-xs md:text-sm text-slate-400">Progress summaries</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.notifications?.weeklyReport || false}
                              onChange={(e) => onNotificationChange('weeklyReport', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <span className="material-symbols-outlined text-primary text-sm md:text-base">group</span>
                            </div>
                            <div>
                              <p className="text-sm md:text-base font-medium text-white">Social Alerts</p>
                              <p className="text-xs md:text-sm text-slate-400">Community interactions</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.notifications?.socialAlerts || false}
                              onChange={(e) => onNotificationChange('socialAlerts', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Controls Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/20 rounded-xl p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
                    <span className="material-symbols-outlined text-primary text-sm md:text-base">admin_panel_settings</span>
                    <h4 className="text-sm md:text-base font-bold text-white">Admin Controls</h4>
                  </div>
                  <div className="space-y-4 lg:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">User Role</label>
                        <div className="relative">
                          <select
                            value={editForm.role}
                            onChange={(e) => onFieldChange('role', e.target.value)}
                            className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none text-sm md:text-base"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Subscription</label>
                        <div className="relative">
                          <select
                            value={editForm.plan}
                            onChange={(e) => onFieldChange('plan', e.target.value)}
                            className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none text-sm md:text-base"
                          >
                            <option value="Free">Free</option>
                            <option value="Basic">Basic</option>
                            <option value="Pro">Pro</option>
                            <option value="Elite">Elite</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-charcoal/50 rounded-xl p-3 lg:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${editForm.isBanned ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                            <span className={`material-symbols-outlined text-sm md:text-base ${editForm.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                              {editForm.isBanned ? 'block' : 'check_circle'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm md:text-base font-medium text-white">Account Status</p>
                            <p className="text-xs md:text-sm text-slate-400">
                              {editForm.isBanned ? 'User is currently banned' : 'User account is active'}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="isBanned"
                            checked={editForm.isBanned || false}
                            onChange={(e) => onFieldChange('isBanned', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 lg:p-8 border-t border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 md:py-3.5 px-4 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 order-2 sm:order-1 text-sm md:text-base"
              type="button"
            >
              <span className="material-symbols-outlined text-sm md:text-base">close</span>
              <span className="font-medium">Cancel</span>
            </button>
            <button
              onClick={onSave}
              className="flex-1 py-3 md:py-3.5 px-4 bg-gradient-to-r from-primary to-primary/90 text-charcoal rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 text-sm md:text-base"
              type="button"
            >
              <span className="material-symbols-outlined text-sm md:text-base">save</span>
              <span className="font-medium">Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

// Memoized CreateModal component
const CreateModal = memo(({
  showCreateModal,
  createForm,
  onClose,
  onCreate,
  onFieldChange
}) => {
  if (!showCreateModal) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card border border-white/10 rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-green-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <span className="material-symbols-outlined text-green-500 text-xl">person_add</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Create New User</h3>
                <p className="text-xs sm:text-sm text-slate-400">Add a new user to the system</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'password', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 capitalize">
                  {field === 'password' ? 'Password' : field} *
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  value={createForm[field]}
                  onChange={(e) => onFieldChange(field, e.target.value)}
                  className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500"
                  placeholder={`Enter ${field}`}
                  required
                />
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Role</label>
                <div className="relative">
                  <select
                    value={createForm.role}
                    onChange={(e) => onFieldChange('role', e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Plan</label>
                <div className="relative">
                  <select
                    value={createForm.plan}
                    onChange={(e) => onFieldChange('plan', e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Elite">Elite</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 sm:py-2.5 px-4 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              <span className="text-sm font-medium">Cancel</span>
            </button>
            <button
              onClick={onCreate}
              className="flex-1 py-3 sm:py-2.5 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="text-sm font-medium">Create User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    location: "",
    age: 0,
    weight: 0,
    height: 0,
    plan: "Free",
    isBanned: false,
    preferences: {
      language: "English"
    },
    notifications: {
      dailyReminder: true,
      weeklyReport: true,
      socialAlerts: false
    }
  })

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    plan: "Free"
  })
  const [resetForm, setResetForm] = useState({ newPassword: "" })

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
    icon: ""
  })

  // Refs for form state
  const editFormRef = useRef(editForm)

  // Update ref when form changes
  useEffect(() => {
    editFormRef.current = editForm
  }, [editForm])

  // Show snackbar function
  const showSnackbar = useCallback((message, type = "success") => {
    const icon = type === "success" ? "check_circle" : "error"
    setSnackbar({
      show: true,
      message,
      type,
      icon
    })

    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }))
    }, 3000)
  }, [])

  // Hide snackbar manually
  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }))
  }

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000'
  }, [])

  // Fetch users with useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        showSnackbar("Please login first", "error")
        return
      }

      const response = await axios.get(`/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          page,
          search,
          status: statusFilter,
          role: roleFilter,
          limit: 10
        }
      })

      if (response.data.success) {
        setUsers(response.data.users || [])
        setTotalPages(response.data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      if (error.response?.status === 401) {
        showSnackbar("Session expired. Please login again.", "error")
      } else if (error.response?.status === 403) {
        showSnackbar("Access denied. Admin only.", "error")
      } else {
        showSnackbar("Failed to fetch users", "error")
      }
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, roleFilter, showSnackbar])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1)
      fetchUsers()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [page, search, statusFilter, roleFilter, fetchUsers])

  // Initial fetch
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handle user actions
  const handleEdit = useCallback((user) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      location: user.location || "",
      age: user.age || 0,
      weight: user.weight || 0,
      height: user.height || 0,
      plan: user.plan || "Free",
      isBanned: user.isBanned || false,
      preferences: user.preferences || {
        language: "English"
      },
      notifications: user.notifications || {
        dailyReminder: true,
        weeklyReport: true,
        socialAlerts: false
      }
    })
    setShowEditModal(true)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `/api/admin/users/${selectedUser._id}`,
        editFormRef.current,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        showSnackbar("User updated successfully")
        setShowEditModal(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error("Edit error:", error)
      showSnackbar(error.response?.data?.message || "Failed to update user", "error")
    }
  }, [selectedUser, fetchUsers, showSnackbar])

  const handleCreateUser = useCallback(async () => {
    try {
      if (!createForm.name || !createForm.email || !createForm.password || !createForm.phone) {
        showSnackbar("Please fill all required fields", "error")
        return
      }

      const token = localStorage.getItem('token')
      const response = await axios.post(
        `/api/admin/users`,
        createForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        showSnackbar("User created successfully")
        setShowCreateModal(false)
        setCreateForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "user",
          plan: "Free"
        })
        fetchUsers()
      }
    } catch (error) {
      console.error("Create error:", error)
      showSnackbar(error.response?.data?.message || "Failed to create user", "error")
    }
  }, [createForm, fetchUsers, showSnackbar])

  const handleResetPassword = useCallback(async () => {
    try {
      if (!resetForm.newPassword) {
        showSnackbar("Please enter a new password", "error")
        return
      }

      const token = localStorage.getItem('token')
      const response = await axios.post(
        `/api/admin/users/${selectedUser._id}/reset-password`,
        resetForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        showSnackbar("Password reset successfully")
        setShowResetModal(false)
        setResetForm({ newPassword: "" })
        setSelectedUser(null)
      }
    } catch (error) {
      console.error("Reset error:", error)
      showSnackbar(error.response?.data?.message || "Failed to reset password", "error")
    }
  }, [resetForm, selectedUser, showSnackbar])

  const handleBanUser = useCallback(async (userId, banStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `/api/admin/users/${userId}/ban`,
        { banned: banStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        showSnackbar(`User ${banStatus ? 'banned' : 'unbanned'} successfully`)
        fetchUsers()
      }
    } catch (error) {
      console.error("Ban error:", error)
      showSnackbar(error.response?.data?.message || "Failed to update user status", "error")
    }
  }, [fetchUsers, showSnackbar])

  const handleDeleteUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(
        `/api/admin/users/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        showSnackbar("User deleted successfully")
        setShowDeleteModal(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error("Delete error:", error)
      showSnackbar(error.response?.data?.message || "Failed to delete user", "error")
    }
  }, [selectedUser, fetchUsers, showSnackbar])

  // Optimized handlers for edit form
  const handleFieldChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'weight' || field === 'height'
        ? (value === "" ? 0 : Number(value))
        : value
    }))
  }, [])

  const handlePreferenceChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }, [])

  const handleNotificationChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }, [])

  // Optimized handlers for create form
  const handleCreateFieldChange = useCallback((field, value) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Optimized modal close handlers
  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false)
    setSelectedUser(null)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  // ResetModal component
  const ResetModal = () => {
    if (!showResetModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowResetModal(false)}>
        <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-white mb-4">Reset Password for {selectedUser?.name}</h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">New Password *</label>
            <input
              type="password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ newPassword: e.target.value })}
              className="w-full bg-charcoal border border-white/5 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowResetModal(false)
                setResetForm({ newPassword: "" })
              }}
              className="flex-1 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              type="button"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DeleteModal component
  const DeleteModal = () => {
    if (!showDeleteModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
        <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-white mb-4">Delete User</h3>
          <p className="text-sm text-slate-400 mb-6">
            Are you sure you want to delete <span className="font-bold text-white">{selectedUser?.name}</span>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedUser(null)
              }}
              className="flex-1 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
              type="button"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Pagination component
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => setPage(prev => Math.max(1, prev - 1))}
        disabled={page === 1}
        className="px-3 py-2 border border-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
        type="button"
      >
        Previous
      </button>

      <span className="px-4 py-2 text-sm text-gray-300">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
        disabled={page === totalPages}
        className="px-3 py-2 border border-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
        type="button"
      >
        Next
      </button>
    </div>
  )

  return (
    <div className="bg-dark-bg min-h-screen p-3 sm:p-6">
      {/* Snackbar Component */}
      {snackbar.show && (
        <>
          <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm animate-slideUpMobile">
            <div className={`rounded-xl border p-4 flex items-center gap-3 shadow-lg backdrop-blur-sm ${snackbar.type === "success"
              ? "bg-gradient-to-r from-primary/90 to-primary/80 border-primary/40"
              : "bg-gradient-to-r from-red-500/90 to-red-500/80 border-red-500/40"
              }`}>
              <span className={`material-symbols-outlined text-xl ${snackbar.type === "success" ? "text-charcoal" : "text-charcoal"
                }`}>
                {snackbar.icon}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">
                  {snackbar.message}
                </p>
              </div>
              <button
                onClick={hideSnackbar}
                className="text-charcoal/70 hover:text-charcoal transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="hidden md:block fixed bottom-6 right-6 z-50 w-80 animate-slideInRight">
            <div className={`rounded-lg border shadow-xl backdrop-blur-sm ${snackbar.type === "success"
              ? "bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85 border-primary/50"
              : "bg-gradient-to-br from-red-500/95 via-red-500/90 to-red-500/85 border-red-500/50"
              }`}>
              <div className="flex items-center justify-between p-3 border-b border-charcoal/10">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined ${snackbar.type === "success" ? "text-charcoal" : "text-charcoal"
                    }`}>
                    {snackbar.icon}
                  </span>
                  <span className="text-sm font-semibold text-charcoal">
                    {snackbar.type === "success" ? "Success" : "Error"}
                  </span>
                </div>
                <button
                  onClick={hideSnackbar}
                  className="text-charcoal/70 hover:text-charcoal transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="p-3">
                <p className="text-sm text-charcoal">
                  {snackbar.message}
                </p>
              </div>

              <div className="h-1 w-full bg-charcoal/20 overflow-hidden">
                <div className={`h-full ${snackbar.type === "success" ? "bg-primary" : "bg-red-500"} animate-progress`}></div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="max-w-[1400px] mx-auto flex flex-col gap-4 sm:gap-6">

        {/* Header with Add button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">User Management</h1>
            <p className="text-sm text-slate-400">Manage all users in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-primary text-charcoal rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-charcoal border border-white/5 rounded-xl py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="Search users by name, email, or phone..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-charcoal border border-white/5 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-charcoal border border-white/5 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() => {
                setSearch("")
                setStatusFilter("")
                setRoleFilter("")
                setPage(1)
              }}
              className="px-3 py-2 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all text-sm"
              type="button"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-3 text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl bg-card">
            <div className="text-slate-500 mb-3">
              <span className="material-symbols-outlined text-4xl">group_off</span>
            </div>
            <p className="text-gray-400">No users found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="flex flex-col gap-3 md:hidden">
              {users.map((user) => (
                <div key={user._id} className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-white">
                      {user.name?.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={user.status} />
                    <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded">
                      {user.plan}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 capitalize">
                      ({user.role})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    <span className="font-bold">Last login:</span> {user.lastLoginFormatted || "Never"}
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleEdit(user)}
                      className="py-2 border border-white/10 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                      title="Edit"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm block mx-auto">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowResetModal(true)
                      }}
                      className="py-2 border border-white/10 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
                      title="Reset Password"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm block mx-auto">lock_reset</span>
                    </button>
                    <button
                      onClick={() => handleBanUser(user._id, !user.isBanned)}
                      className={`py-2 border border-white/10 rounded-lg transition-colors ${user.isBanned ? 'text-green-400 hover:bg-green-400/10' : 'text-yellow-400 hover:bg-yellow-400/10'
                        }`}
                      title={user.isBanned ? 'Unban User' : 'Ban User'}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm block mx-auto">
                        {user.isBanned ? 'check_circle' : 'block'}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowDeleteModal(true)
                      }}
                      className="py-2 border border-white/10 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete User"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm block mx-auto">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View */}
            <div className="hidden md:block bg-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500">User</th>
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500">Status</th>
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500">Role</th>
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500">Plan</th>
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500">Last Login</th>
                      <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-white">
                              {user.name?.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{user.name}</p>
                              <p className="text-[11px] text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-300 capitalize px-3 py-1 bg-white/5 rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-300 px-3 py-1 bg-white/5 rounded-full">
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500">{user.lastLoginFormatted || "Never"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-primary hover:bg-primary/10 transition-colors rounded-lg"
                              title="Edit"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">edit_square</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowResetModal(true)
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 transition-colors rounded-lg"
                              title="Reset Password"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">lock_reset</span>
                            </button>
                            <button
                              onClick={() => handleBanUser(user._id, !user.isBanned)}
                              className={`p-2 transition-colors rounded-lg ${user.isBanned
                                ? 'text-green-400 hover:bg-green-400/10'
                                : 'text-yellow-400 hover:bg-yellow-400/10'
                                }`}
                              title={user.isBanned ? 'Unban User' : 'Ban User'}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">
                                {user.isBanned ? 'check_circle' : 'block'}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteModal(true)
                              }}
                              className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                              title="Delete User"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && <Pagination />}
            </div>

            {totalPages > 1 && (
              <div className="md:hidden">
                <Pagination />
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <EditModal
          showEditModal={showEditModal}
          editForm={editForm}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          onFieldChange={handleFieldChange}
          onPreferenceChange={handlePreferenceChange}
          onNotificationChange={handleNotificationChange}
        />

        <CreateModal
          showCreateModal={showCreateModal}
          createForm={createForm}
          onClose={handleCloseCreateModal}
          onCreate={handleCreateUser}
          onFieldChange={handleCreateFieldChange}
        />

        <ResetModal />
        <DeleteModal />
      </div>

      <style jsx>{`
        @keyframes slideUpMobile {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slideUpMobile {
          animation: slideUpMobile 0.3s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  )
}

export default AdminUsers