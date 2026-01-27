'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      role: value as 'user' | 'admin' | 'superadmin',
    });
    setError('');
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${apiUrl}/superadmin/users/${user.id}/role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: formData.role,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSubmit(formData);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit User Role</h2>
            <p className="text-sm text-slate-600 mt-1">Update {user.name}'s role</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Role updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* User Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                  Name
                </p>
                <p className="text-slate-900 font-medium mt-1">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                  Email
                </p>
                <p className="text-slate-900 font-medium mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                  Current Role
                </p>
                <div className="mt-1 inline-block">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-900 mb-3">
              Select New Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="user">Regular User - Can use the system</option>
              <option value="admin">Admin - Manage orders & payments</option>
              <option value="superadmin">Superadmin - Full system access</option>
            </select>

            {/* Role Description */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {formData.role === 'user' && (
                <div>
                  <p className="text-sm font-medium text-blue-900">Regular User</p>
                  <ul className="text-xs text-blue-800 mt-2 space-y-1">
                    <li>• Can create and manage orders</li>
                    <li>• Can view order history</li>
                    <li>• Can manage cart items</li>
                  </ul>
                </div>
              )}
              {formData.role === 'admin' && (
                <div>
                  <p className="text-sm font-medium text-blue-900">Admin</p>
                  <ul className="text-xs text-blue-800 mt-2 space-y-1">
                    <li>• View all system orders</li>
                    <li>• Manage order status</li>
                    <li>• Confirm/reject payments</li>
                    <li>• View statistics and reports</li>
                  </ul>
                </div>
              )}
              {formData.role === 'superadmin' && (
                <div>
                  <p className="text-sm font-medium text-blue-900">Superadmin</p>
                  <ul className="text-xs text-blue-800 mt-2 space-y-1">
                    <li>• Full system access</li>
                    <li>• Manage all users and roles</li>
                    <li>• Manage areas and restaurants</li>
                    <li>• Manage menus</li>
                    <li>• System settings and configuration</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Warning for role change */}
          {formData.role !== user.role && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> This user's permissions will change immediately after
                role update.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.role === user.role}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Update Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}