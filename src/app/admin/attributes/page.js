'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Palette,
  Layers,
  Loader2
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import {
  getAttributes,
  createAttribute,
  deleteAttribute,
  seedAttributes,
} from '@/app/api/adminapi';

export default function AdminAttributesPage() {
  const { showToast } = useAdmin() || {};

  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);

  // Input states
  const [newFit, setNewFit] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newCollection, setNewCollection] = useState('');

  // Submitting states for instant add feedback
  const [addingType, setAddingType] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type, name }

  // Load attributes from MongoDB
  const loadAttributes = async () => {
    try {
      setLoading(true);
      const res = await getAttributes();
      if (res?.success && Array.isArray(res.data)) {
        setAttributes(res.data);
      }
    } catch (err) {
      console.error('Failed to load attributes:', err);
      if (showToast) showToast('Failed to load attributes from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  // Filter attributes by type
  const fits = attributes.filter((a) => a.type === 'fit');
  const themes = attributes.filter((a) => a.type === 'theme');
  const badges = attributes.filter((a) => a.type === 'badge');
  const materials = attributes.filter((a) => a.type === 'material');
  const colors = attributes.filter((a) => a.type === 'color');
  const collections = attributes.filter((a) => a.type === 'collection');

  // Generic handler to add attribute to DB
  const handleAdd = async (type, name, value = '') => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();

    try {
      setAddingType(type);
      const res = await createAttribute({
        type,
        name: cleanName,
        value: value || '',
      });

      if (res?.success && res.data) {
        setAttributes((prev) => [...prev, res.data]);
        if (showToast) showToast(`${type.toUpperCase()} "${cleanName}" saved to database`, 'success');
      } else {
        if (showToast) showToast(res?.message || 'Failed to add attribute', 'error');
      }
    } catch (err) {
      console.error('Error adding attribute:', err);
      if (showToast) showToast(err.message || 'Error saving attribute', 'error');
    } finally {
      setAddingType(null);
    }
  };

  const handleAddFit = (e) => {
    e.preventDefault();
    handleAdd('fit', newFit);
    setNewFit('');
  };

  const handleAddTheme = (e) => {
    e.preventDefault();
    handleAdd('theme', newTheme);
    setNewTheme('');
  };

  const handleAddBadge = (e) => {
    e.preventDefault();
    handleAdd('badge', newBadge.toUpperCase());
    setNewBadge('');
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    handleAdd('material', newMaterial);
    setNewMaterial('');
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!newColor.name.trim()) return;
    handleAdd('color', newColor.name.trim(), newColor.hex);
    setNewColor({ name: '', hex: '#000000' });
  };

  const handleAddCollection = (e) => {
    e.preventDefault();
    handleAdd('collection', newCollection);
    setNewCollection('');
  };

  // Seed / Reset defaults handler
  const handleSeedDefaults = async () => {
    try {
      setSeeding(true);
      const res = await seedAttributes(false);
      if (res?.success && Array.isArray(res.data)) {
        setAttributes(res.data);
        if (showToast) showToast('Default attributes synced successfully', 'success');
      }
    } catch (err) {
      console.error('Error seeding defaults:', err);
      if (showToast) showToast('Failed to seed defaults', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const requestDelete = (item) => {
    setItemToDelete({
      id: item._id,
      type: item.type,
      name: item.name,
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;
    const { id, type, name } = itemToDelete;

    try {
      const res = await deleteAttribute(id);
      if (res?.success) {
        setAttributes((prev) => prev.filter((a) => a._id !== id));
        if (showToast) showToast(`Deleted ${type} "${name}" from database`, 'success');
      } else {
        if (showToast) showToast(res?.message || 'Failed to delete attribute', 'error');
      }
    } catch (err) {
      console.error('Error deleting attribute:', err);
      if (showToast) showToast(err.message || 'Error deleting attribute', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Database Taxonomy & Product Specs
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Product Attributes Management
          </h1>
          <p className="text-xs text-slate-500">
            Live database-backed presets for Fits, Themes, Badges, Materials, Colors, and Drops.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding || loading}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            title="Populate missing default streetwear presets in MongoDB"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>Sync Defaults</span>
          </button>

          <Link
            href="/admin/products"
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <span>Products Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading Attributes from MongoDB...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. FIT STYLES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Fit Styles</h2>
                  <p className="text-[11px] text-slate-500">Cut & silhouette presets</p>
                </div>
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
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingType === 'fit' || !newFit.trim()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'fit' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {fits.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="text-indigo-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 2. THEMES & AESTHETICS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Theme Tags</h2>
                  <p className="text-[11px] text-slate-500">Design aesthetics & subcultures</p>
                </div>
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
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingType === 'theme' || !newTheme.trim()}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'theme' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {themes.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="text-sky-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 3. RIBBON BADGES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Ribbon Badges</h2>
                  <p className="text-[11px] text-slate-500">Thumbnail tags & marketing labels</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                {badges.length} Badges
              </span>
            </div>

            <form onSubmit={handleAddBadge} className="flex gap-2">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="e.g. EXCLUSIVE DROP"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500 uppercase"
              />
              <button
                type="submit"
                disabled={addingType === 'badge' || !newBadge.trim()}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'badge' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {badges.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="text-rose-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 4. FABRICS & MATERIALS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Fabrics & GSM</h2>
                  <p className="text-[11px] text-slate-500">Fabric weight & composition presets</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {materials.length} Presets
              </span>
            </div>

            <form onSubmit={handleAddMaterial} className="flex gap-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="e.g. 100% Cotton (280 GSM)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingType === 'material' || !newMaterial.trim()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'material' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {materials.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800 truncate mr-2">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. COLOR PALETTES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Color Swatches</h2>
                  <p className="text-[11px] text-slate-500">Color names & hex codes</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                {colors.length} Colors
              </span>
            </div>

            <form onSubmit={handleAddColor} className="flex gap-2">
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor((prev) => ({ ...prev, hex: e.target.value }))}
                className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                title="Select Hex Color"
              />
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Color Name (e.g. Onyx)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingType === 'color' || !newColor.name.trim()}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'color' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {colors.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm"
                    style={{ backgroundColor: item.value || '#000000' }}
                  />
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 6. SIGNATURE CAPSULES & DROPS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Capsule Drops</h2>
                  <p className="text-[11px] text-slate-500">Collection name classifications</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {collections.length} Drops
              </span>
            </div>

            <form onSubmit={handleAddCollection} className="flex gap-2">
              <input
                type="text"
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
                placeholder="e.g. Acid Wash Series"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingType === 'collection' || !newCollection.trim()}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {addingType === 'collection' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
            </form>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {collections.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs"
                >
                  <span className="font-semibold text-amber-950 truncate mr-2">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    className="p-1 text-amber-600 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reusable Delete Confirmation Popup */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete?.type ? itemToDelete.type.toUpperCase() : 'Attribute'}`}
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}" from MongoDB?`}
        itemName={itemToDelete?.name || ''}
        confirmText="Permanently Delete"
        isDanger={true}
      />
    </div>
  );
}
