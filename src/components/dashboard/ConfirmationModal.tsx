'use client';

import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import { AlertTriangle, CheckCircle, X, Pin, Star } from 'lucide-react';

export default function ConfirmationModal() {
  const { confirmDialog, closeConfirm } = useDashboardContext();
  const [verifyText, setVerifyText] = useState('');

  // Reset input when modal opens
  useEffect(() => {
    if (confirmDialog?.isOpen) {
      setVerifyText('');
    }
  }, [confirmDialog?.isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmDialog?.isOpen) {
        closeConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, closeConfirm]);

  if (!confirmDialog || !confirmDialog.isOpen) return null;

  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    onConfirm,
  } = confirmDialog;

  const titleLower = title.toLowerCase();
  
  const isRed = isDestructive || 
                titleLower.includes('delete') || 
                titleLower.includes('remove') || 
                titleLower.includes('unpin') || 
                titleLower.includes('unfavorite');

  const isBlue = titleLower.includes('pin') && !titleLower.includes('unpin');
  
  const isYellow = titleLower.includes('favorite') && !titleLower.includes('unfavorite');

  const isConfirmDisabled = Boolean(
    confirmDialog.verificationText && verifyText !== confirmDialog.verificationText
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeConfirm}
      />

      {/* Dialog container */}
      <div className="relative w-full max-w-sm bg-[#0e0e11] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        
        {/* Content body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            
            {/* Visual Action Indicator Icon */}
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isRed 
                ? 'bg-red-500/10 text-red-500' 
                : isBlue
                ? 'bg-blue-500/10 text-blue-400'
                : isYellow
                ? 'bg-yellow-500/10 text-yellow-500'
                : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {isRed ? (
                <AlertTriangle className="h-5 w-5" />
              ) : isBlue ? (
                <Pin className="h-5 w-5" />
              ) : isYellow ? (
                <Star className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </div>

            {/* Typography */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed break-words">
                {message}
              </p>
              {confirmDialog.verificationText && (
                <div className="pt-3">
                  <p className="text-xs text-zinc-500 mb-1.5">
                    To confirm, type <strong className="text-zinc-300 font-mono select-all">"{confirmDialog.verificationText}"</strong> below:
                  </p>
                  <input
                    type="text"
                    value={verifyText}
                    onChange={(e) => setVerifyText(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                    placeholder={confirmDialog.verificationText}
                  />
                </div>
              )}
            </div>

            {/* Close Cross icon */}
            <button 
              onClick={closeConfirm}
              className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer self-start shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-4 border-t border-zinc-800/50 bg-zinc-950/40 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeConfirm}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isConfirmDisabled}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md select-none ${
              isConfirmDisabled 
                ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500'
                : 'cursor-pointer active:scale-[0.98] ' + (isRed
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/10'
                : isBlue
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10'
                : isYellow
                ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 shadow-yellow-500/10'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10')
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
