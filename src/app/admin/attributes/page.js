'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Plus, Trash2, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminAttributesPage() {
  const { showToast } = useAdmin() || {};

  // Attribute groups
  const [fits, setFits] = useState([
    'Oversized Fit',
    'Boxy Cut',
    'Relaxed Fit',
    'Drop Shoulder',
    'Regular Fit',
  ]);

  const [themes, setThemes] = useState([
    'Street',
    'Minimal',
    'Vintage',
    'Typography',
    'Anime',
    'Abstract',
    'Cyberpunk',
    'Gothic',
  ]);

  const [badges, setBadges] = useState([
    'NEW DROP',
    'BESTSELLER',
    'LIMITED',
    'ESSENTIAL',
    'HOT',
    'FLAT 40% OFF',
    'POPULAR',
  ]);

  const [materials, setMaterials] = useState([
    '100% French Terry (240 GSM)',
    'Heavyweight Cotton (260 GSM)',
    'Compact Cotton (210 GSM)',
    '100% Organic Cotton (220 GSM)',
    'Fleece Cotton (380 GSM)',
    'High-Density Ripstop Cotton',
  ]);

  // Input states
  const [newFit, setNewFit] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type, name }

  const handleAddFit = (e) => {
    e.preventDefault();
    if (!newFit.trim() || fits.includes(newFit.trim())) return;
    setFits((prev) => [...prev, newFit.trim()]);
    if (showToast) showToast(`Fit "${newFit.trim()}" added`, 'success');
    setNewFit('');
  };

  const handleAddTheme = (e) => {
    e.preventDefault();
    if (!newTheme.trim() || themes.includes(newTheme.trim())) return;
    setThemes((prev) => [...prev, newTheme.trim()]);
    if (showToast) showToast(`Theme "${newTheme.trim()}" added`, 'success');
    setNewTheme('');
  };

  const handleAddBadge = (e) => {
    e.preventDefault();
    if (!newBadge.trim() || badges.includes(newBadge.trim().toUpperCase())) return;
    setBadges((prev) => [...prev, newBadge.trim().toUpperCase()]);
    if (showToast) showToast(`Badge "${newBadge.trim().toUpperCase()}" added`, 'success');
    setNewBadge('');
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.trim() || materials.includes(newMaterial.trim())) return;
    setMaterials((prev) => [...prev, newMaterial.trim()]);
    if (showToast) showToast(`Material "${newMaterial.trim()}" added`, 'success');
    setNewMaterial('');
  };

  const requestDelete = (type, name) => {
    setItemToDelete({ type, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { type, name } = itemToDelete;

    if (type === 'fit') setFits((prev) => prev.filter((i) => i !== name));
    if (type === 'theme') setThemes((prev) => prev.filter((i) => i !== name));
    if (type === 'badge') setBadges((prev) => prev.filter((i) => i !== name));
    if (type === 'material') setMaterials((prev) => prev.filter((i) => i !== name));

    if (showToast) showToast(`Removed ${type} "${name}"`, 'success');
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Taxonomy & Product Specs
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Product Attributes & Taxonomy
          </h1>
          <p className="text-xs text-slate-500">
            Define and manage custom Fit styles, Theme tags, Ribbon badges, and Fabric specifications.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto"
        >
          <span>Catalog View</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIT STYLES (Distinct Attribute) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fit Styles (Distinct Column)</h2>
              <p className="text-xs text-slate-500">Cut & silhouette options</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {fits.length} Options
            </span>
          </div>

          <form onSubmit={handleAddFit} className="flex gap-2">
            <input
              type="text"
              value={newFit}
              onChange={(e) => setNewFit(e.target.value)}
              placeholder="e.g. Ultra Oversized"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {fits.map((fit) => (
              <span
                key={fit}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold"
              >
                <span>{fit}</span>
                <button
                  type="button"
                  onClick={() => requestDelete('fit', fit)}
                  className="text-indigo-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* THEMES (Distinct Attribute) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Theme Tags (Distinct Column)</h2>
              <p className="text-xs text-slate-500">Aesthetic design classifications</p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
              {themes.length} Options
            </span>
          </div>

          <form onSubmit={handleAddTheme} className="flex gap-2">
            <input
              type="text"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              placeholder="e.g. Y2K Street"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <span
                key={theme}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold"
              >
                <span>{theme}</span>
                <button
                  type="button"
                  onClick={() => requestDelete('theme', theme)}
                  className="text-sky-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* RIBBON BADGES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ribbon Badges</h2>
              <p className="text-xs text-slate-500">Thumbnail promotional badges</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {badges.length} Badges
            </span>
          </div>

          <form onSubmit={handleAddBadge} className="flex gap-2">
            <input
              type="text"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              placeholder="e.g. EXCLUSIVE DROP"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500 uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase"
              >
                <span>{badge}</span>
                <button
                  type="button"
                  onClick={() => requestDelete('badge', badge)}
                  className="text-blue-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* MATERIALS & FABRICS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fabrics & Materials</h2>
              <p className="text-xs text-slate-500">GSM weight and composition presets</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {materials.length} Presets
            </span>
          </div>

          <form onSubmit={handleAddMaterial} className="flex gap-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder="e.g. 100% Loopknit Cotton (280 GSM)"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {materials.map((mat) => (
              <div
                key={mat}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <span className="font-semibold text-slate-800">{mat}</span>
                <button
                  type="button"
                  onClick={() => requestDelete('material', mat)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reusable Delete Confirmation Popup */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete?.type ? itemToDelete.type.toUpperCase() : 'Attribute'}`}
        message={`Are you sure you want to remove "${itemToDelete?.name}" from presets?`}
        itemName={itemToDelete?.name || ''}
        confirmText="Remove Attribute"
        isDanger={true}
      />
    </div>
  );
}

