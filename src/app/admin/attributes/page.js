'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Trash2,
  Pencil,
  Search,
  Sparkles,
  ArrowRight,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Palette,
  Layers,
  Shirt,
  X,
  CheckCircle2,
  Filter,
  Eye
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  seedAttributes,
} from '@/app/api/adminapi';

// Defined Tab Categories for the top sticky bar
const ATTRIBUTE_TABS = [
  { key: 'fit', label: 'Fit Styles', icon: SlidersHorizontal, description: 'Cut & silhouette classifications (e.g. Oversized Fit, Boxy Cut)' },
  { key: 'theme', label: 'Theme Tags', icon: Sparkles, description: 'Design aesthetics & subcultures (e.g. Streetwear, Cyberpunk, Anime)' },
  { key: 'badge', label: 'Ribbon Badges', icon: Flame, description: 'Thumbnail promo badges & marketing tags (e.g. NEW DROP, BESTSELLER)' },
  { key: 'material', label: 'Fabrics & GSM', icon: Tag, description: 'Fabric composition & GSM weight presets (e.g. 260 GSM French Terry)' },
  { key: 'color', label: 'Color Swatches', icon: Palette, description: 'Colorways & hex values for product variant pickers' },
  { key: 'collection', label: 'Capsule Drops', icon: Layers, description: 'Signature collection drops & lookbook themes' },
  { key: 'size', label: 'Sizes', icon: Shirt, description: 'Standard garment sizing scale (e.g. XS to 3XL)' },
];

export default function AdminAttributesPage() {
  const { showToast } = useAdmin() || {};

  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);

  // Active Category Tab
  const [activeTab, setActiveTab] = useState('fit');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for create, object for edit
  const [modalForm, setModalForm] = useState({
    type: 'fit',
    name: '',
    value: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type, name }
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Compute counts per attribute type
  const typeCounts = useMemo(() => {
    const counts = {};
    ATTRIBUTE_TABS.forEach((t) => {
      counts[t.key] = attributes.filter((a) => a.type === t.key).length;
    });
    return counts;
  }, [attributes]);

  // Filtered attributes for the currently active tab
  const activeItems = useMemo(() => {
    const list = attributes.filter((a) => a.type === activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((a) => a.name.toLowerCase().includes(q) || (a.value && a.value.toLowerCase().includes(q)));
  }, [attributes, activeTab, searchQuery]);

  // Open Create Modal (pre-sets type to currently active tab)
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setModalForm({
      type: activeTab,
      name: '',
      value: activeTab === 'color' ? '#0a0a0c' : '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalForm({
      type: item.type,
      name: item.name,
      value: item.value || (item.type === 'color' ? '#0a0a0c' : ''),
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveAttribute = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      alert('Please enter an attribute name');
      return;
    }

    setIsSubmitting(true);
    const cleanName = modalForm.name.trim();

    try {
      if (editingItem) {
        // Update existing attribute
        const res = await updateAttribute(editingItem._id, {
          type: modalForm.type,
          name: cleanName,
          value: modalForm.value || '',
          isActive: modalForm.isActive,
        });

        if (res?.success && res.data) {
          setAttributes((prev) =>
            prev.map((a) => (a._id === editingItem._id ? res.data : a))
          );
          if (showToast) showToast(`Attribute "${cleanName}" updated successfully!`, 'success');
          setIsModalOpen(false);
          setEditingItem(null);
        } else {
          alert(res?.message || 'Failed to update attribute');
        }
      } else {
        // Create new attribute
        const res = await createAttribute({
          type: modalForm.type,
          name: cleanName,
          value: modalForm.value || '',
          isActive: modalForm.isActive,
        });

        if (res?.success && res.data) {
          setAttributes((prev) => [...prev, res.data]);
          if (showToast) showToast(`Added "${cleanName}" to ${modalForm.type.toUpperCase()}`, 'success');
          setIsModalOpen(false);
          setEditingItem(null);
        } else {
          alert(res?.message || 'Failed to create attribute');
        }
      }
    } catch (err) {
      console.error('Error saving attribute:', err);
      alert(err.message || 'Error saving attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seed / Reset defaults
  const handleSeedDefaults = async () => {
    try {
      setSeeding(true);
      const res = await seedAttributes(false);
      if (res?.success && Array.isArray(res.data)) {
        setAttributes(res.data);
        if (showToast) showToast('Default attributes synced successfully with MongoDB', 'success');
      }
    } catch (err) {
      console.error('Error seeding defaults:', err);
      if (showToast) showToast('Failed to sync defaults', 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Delete modal open
  const requestDelete = (item) => {
    setItemToDelete({
      id: item._id,
      type: item.type,
      name: item.name,
    });
    setDeleteModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);

    try {
      const res = await deleteAttribute(itemToDelete.id);
      if (res?.success) {
        setAttributes((prev) => prev.filter((a) => a._id !== itemToDelete.id));
        if (showToast) showToast(`Deleted "${itemToDelete.name}" permanently`, 'success');
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        alert(res?.message || 'Failed to delete attribute');
      }
    } catch (err) {
      console.error('Error deleting attribute:', err);
      alert('Error deleting attribute');
    } finally {
      setIsDeleting(false);
    }
  };

  const currentTabObj = ATTRIBUTE_TABS.find((t) => t.key === activeTab) || ATTRIBUTE_TABS[0];
  const CurrentIcon = currentTabObj.icon;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      
      {/* ======================================================== */}
      {/* 1. STICKY TOP HEADER (ATTRIBUTES TITLE + ADD + TABS)     */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Left Side: "Attributes" Title + Count + [+] Add Attribute Button */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              Attributes
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {typeCounts[activeTab] || 0}
            </span>
          </div>

          {/* Prominent [+] Add Attribute Button (Opens Popup) */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            title={`Add New ${currentTabObj.label}`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add {currentTabObj.label.split(' ')[0]}</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Quick Defaults Sync */}
          <button
            onClick={handleSeedDefaults}
            disabled={seeding || loading}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            title="Sync / Seed missing standard streetwear presets in MongoDB"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync Defaults</span>
          </button>
        </div>

        {/* Right Side: Horizontal Attribute Category Tabs in a Line */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Quick Search in this attribute list */}
          <div className="relative w-36 sm:w-48 hidden lg:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentTabObj.label}...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Attribute Tabs in a Line */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl p-1 overflow-x-auto max-w-xl">
            {ATTRIBUTE_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              const count = typeCounts[tab.key] || 0;

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearchQuery('');
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  title={tab.description}
                >
                  <TabIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SUBHEADER DESCRIPTION & QUICK STATS                   */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <CurrentIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-900">{currentTabObj.label}:</span>
          <span className="text-slate-500 hidden sm:inline">{currentTabObj.description}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <span>
            Total: <strong className="text-slate-900">{activeItems.length}</strong> items
          </span>
          <Link
            href="/admin/products"
            className="text-blue-600 hover:underline font-bold hidden md:inline"
          >
            View in Catalog →
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ACTIVE ATTRIBUTE ITEMS TABLE (NO CLUTTERED BOXES)     */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Loading {currentTabObj.label} from MongoDB...
              </p>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  No {currentTabObj.label} found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No presets match "${searchQuery}". Click below to add it.`
                    : `No ${currentTabObj.label.toLowerCase()} configured in database yet.`}
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                + Add First {currentTabObj.label.split(' ')[0]}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Attribute Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">
                      {activeTab === 'color'
                        ? 'Color Swatch & Hex'
                        : activeTab === 'material'
                        ? 'GSM Weight'
                        : activeTab === 'badge'
                        ? 'Badge Preview'
                        : 'Slug Key'}
                    </th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeItems.map((item, idx) => {
                    const isColor = item.type === 'color';
                    const isMaterial = item.type === 'material';
                    const isBadge = item.type === 'badge';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Index */}
                        <td className="py-3.5 px-4 font-mono text-slate-400 font-bold w-12">
                          #{idx + 1}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                            {isColor && (
                              <span
                                className="w-4 h-4 rounded-full border border-slate-300 shadow-sm flex-shrink-0"
                                style={{ backgroundColor: item.value || '#000000' }}
                              />
                            )}
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            /{item.slug || item.name.toLowerCase().replace(/\s+/g, '-')}
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200/60">
                            {item.type}
                          </span>
                        </td>

                        {/* Spec / Value Column */}
                        <td className="py-3.5 px-4">
                          {isColor ? (
                            <div className="flex items-center space-x-2 font-mono text-slate-700 font-bold">
                              <span className="text-[11px]">{item.value || '#000000'}</span>
                            </div>
                          ) : isMaterial ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                              {item.value || '240 GSM'}
                            </span>
                          ) : isBadge ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider">
                              {item.name}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-500 text-[11px]">
                              {item.slug || '-'}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.isActive !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {item.isActive !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>

                        {/* Actions (Pencil Edit + Trash Delete) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Attribute"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => requestDelete(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete from Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Displaying <strong className="text-slate-900">{activeItems.length}</strong> {currentTabObj.label} in MongoDB
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
            >
              + Add Another {currentTabObj.label.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ADD / EDIT ATTRIBUTE POPUP MODAL                      */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'Edit Attribute' : 'Add New Attribute'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves permanently to MongoDB taxonomy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAttribute} className="p-6 space-y-4 text-xs">
              {/* Type Selector Dropdown */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Attribute Type *</label>
                <select
                  value={modalForm.type}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  {ATTRIBUTE_TABS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label} ({t.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Attribute Name *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    modalForm.type === 'fit'
                      ? 'e.g. Ultra Oversized Cut'
                      : modalForm.type === 'theme'
                      ? 'e.g. Y2K Street'
                      : modalForm.type === 'badge'
                      ? 'e.g. EXCLUSIVE DROP'
                      : modalForm.type === 'color'
                      ? 'e.g. Pitch Black'
                      : modalForm.type === 'material'
                      ? 'e.g. 100% French Terry Cotton'
                      : 'e.g. Acid Wash Series'
                  }
                  value={modalForm.name}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              {/* Special Value Input (Color Picker or GSM) */}
              {modalForm.type === 'color' && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Hex Color Swatch *</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={modalForm.value || '#0a0a0c'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="w-10 h-10 p-0.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#0a0a0c"
                      value={modalForm.value || '#0a0a0c'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {modalForm.type === 'material' && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">GSM Fabric Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 260 GSM"
                    value={modalForm.value}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              )}

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Status: {modalForm.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Active attributes appear in product creation dropdowns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                    modalForm.isActive ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{editingItem ? 'Update Attribute' : 'Save Attribute'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DELETE CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Attribute Preset"
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}" from MongoDB? Products referencing this value will keep their text, but it won't appear in dropdown presets.`}
        itemName={itemToDelete?.name || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
