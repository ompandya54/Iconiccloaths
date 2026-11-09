'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Reusable Confirmation Modal in White & Blue Theme
 * Used across Admin for Products, Categories, Attributes, Orders, etc.
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {Function} onClose - Close callback
 * @param {Function} onConfirm - Confirm action callback
 * @param {string} title - Modal heading
 * @param {string} message - Explanatory message
 * @param {string} itemName - Optional item label to emphasize
 * @param {string} confirmText - Button text (default: 'Delete')
 * @param {string} cancelText - Cancel button text (default: 'Cancel')
 * @param {boolean} isDanger - If true, displays red danger styling; if false, blue action styling
 * @param {boolean} isLoading - Loading state for action button
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={!isLoading ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-scaleUp">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isDanger
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-5 h-5 stroke-[2]" />
              ) : (
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Please confirm your decision</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          {itemName && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 break-words flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="truncate">{itemName}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 flex items-center space-x-2 disabled:opacity-50 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
