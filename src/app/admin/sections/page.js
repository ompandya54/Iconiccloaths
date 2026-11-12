'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutTemplate,
  Plus,
  Trash2,
  Pencil,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  Tag,
  Percent,
  SlidersHorizontal,
  Flame,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import {
  getAllSections,
  createSection,
  updateSection,
  toggleSectionStatus,
  deleteSection,
} from '@/app/api/adminapi';

const FILTER_TYPES = [
  { value: 'discount', label: 'Minimum Discount %', hint: 'e.g. 40 (products with 40% discount or higher)', icon: Percent },
  { value: 'underPrice', label: 'Under Max Price (₹)', hint: 'e.g. 999 (products priced ₹999 or lower)', icon: Tag },
  { value: 'category', label: 'Product Category', hint: 'e.g. Oversized Tees, Graphic Streetwear, Hoodies', icon: Layers },
  { value: 'fit', label: 'Fit Style Silhouette', hint: 'e.g. Oversized Fit, Boxy Cut, Relaxed Fit', icon: SlidersHorizontal },
  { value: 'theme', label: 'Aesthetic / Theme', hint: 'e.g. Streetwear, Vintage Nostalgia, Typography, Anime', icon: Sparkles },
  { value: 'badge', label: 'Marketing Badge Tag', hint: 'e.g. BESTSELLER, NEW DROP, LIMITED, HOT', icon: Flame },
  { value: 'material', label: 'Fabric / Material', hint: 'e.g. French Terry Cotton, 240 GSM, Fleece', icon: Tag },
];

export default function AdminSectionsPage() {
  const { showToast } = useAdmin() || {};

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Modal State (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    filterType: 'discount',
    filterValue: '40',
    badgeText: 'FLAT 40% OFF',
    limit: 8,
    displayOrder: 1,
    countdownEndsAt: '',
    isActive: true,
  });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch sections from API
  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await getAllSections();
      if (res && (res.sections || res.data)) {
        setSections(res.sections || res.data || []);
      } else if (Array.isArray(res)) {
        setSections(res);
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
      if (showToast) showToast('Failed to load sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSection(null);
    setFormData({
      title: '',
      subtitle: '',
      filterType: 'discount',
      filterValue: '40',
      badgeText: 'FLAT 40% OFF',
      limit: 8,
      displayOrder: sections.length + 1,
      countdownEndsAt: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sec) => {
    setEditingSection(sec);
    const dateStr = sec.countdownEndsAt
      ? new Date(sec.countdownEndsAt).toISOString().slice(0, 16)
      : '';

    setFormData({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      filterType: sec.filterType || 'discount',
      filterValue: sec.filterValue || '',
      badgeText: sec.badgeText || '',
      limit: sec.limit || 8,
      displayOrder: sec.displayOrder || 1,
      countdownEndsAt: dateStr,
      isActive: sec.isActive !== false,
    });
    setIsModalOpen(true);
  };

  // Handle Form Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-suggest values when filterType changes
      if (field === 'filterType') {
        if (value === 'discount') {
          next.filterValue = '40';
          next.badgeText = 'FLAT 40% OFF';
        } else if (value === 'underPrice') {
          next.filterValue = '999';
          next.badgeText = 'UNDER ₹999';
        } else if (value === 'category') {
          next.filterValue = 'Oversized Tees';
          next.badgeText = 'TRENDING CAPSULE';
        } else if (value === 'fit') {
          next.filterValue = 'Oversized Fit';
          next.badgeText = 'BOXY SILHOUETTES';
        } else if (value === 'badge') {
          next.filterValue = 'BESTSELLER';
          next.badgeText = 'MOST WANTED';
        }
      }
      return next;
    });
  };

  // Save Section (Create / Update)
  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Section Title');
      return;
    }
    if (!formData.filterValue.trim()) {
      alert('Please enter a Filter Value');
      return;
    }

    setIsSaving(true);
    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      filterType: formData.filterType,
      filterValue: formData.filterValue.trim(),
      badgeText: formData.badgeText.trim(),
      limit: Number(formData.limit) || 8,
      displayOrder: Number(formData.displayOrder) || 1,
      countdownEndsAt: formData.countdownEndsAt ? new Date(formData.countdownEndsAt).toISOString() : null,
      isActive: formData.isActive,
    };

    try {
      if (editingSection) {
        const id = editingSection._id || editingSection.id;
        const res = await updateSection(id, payload);
        if (res && res.success !== false) {
          if (showToast) showToast(`Section "${payload.title}" updated successfully!`, 'success');
          setIsModalOpen(false);
          fetchSections();
        } else {
          alert(res?.message || 'Failed to update section');
        }
      } else {
        const res = await createSection(payload);
        if (res && res.success !== false) {
          if (showToast) showToast(`Section "${payload.title}" created successfully!`, 'success');
          setIsModalOpen(false);
          fetchSections();
        } else {
          alert(res?.message || 'Failed to create section');
        }
      }
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Server error while saving section');
    } finally {
      setIsSaving(false);
    }
  };

  // 1-Click Toggle Active Status
  const handleToggleStatus = async (sec) => {
    const id = sec._id || sec.id;
    if (!id) return;
    setTogglingId(id);

    try {
      const res = await toggleSectionStatus(id);
      if (res && res.success !== false) {
        const updatedStatus = res.data?.isActive ?? res.section?.isActive ?? !sec.isActive;
        setSections((prev) =>
          prev.map((s) => ((s._id || s.id) === id ? { ...s, isActive: updatedStatus } : s))
        );
        if (showToast) {
          showToast(`"${sec.title}" is now ${updatedStatus ? 'LIVE ON STOREFRONT' : 'HIDDEN / DRAFT'}`, 'success');
        }
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      if (showToast) showToast('Failed to toggle status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Section Handlers
  const requestDelete = (sec) => {
    setSectionToDelete(sec);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sectionToDelete) return;
    const id = sectionToDelete._id || sectionToDelete.id;
    setIsDeleting(true);

    try {
      const res = await deleteSection(id);
      if (res && res.success !== false) {
        setSections((prev) => prev.filter((s) => (s._id || s.id) !== id));
        if (showToast) showToast(`Deleted "${sectionToDelete.title}" section`, 'success');
        setDeleteModalOpen(false);
        setSectionToDelete(null);
      } else {
        alert(res?.message || 'Failed to delete section');
      }
    } catch (err) {
      console.error('Delete section error:', err);
      alert('Error deleting section');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = sections.filter((s) => s.isActive !== false).length;
  const timedDropsCount = sections.filter((s) => s.countdownEndsAt && new Date(s.countdownEndsAt) > new Date()).length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Storefront Merchandising
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Landing Page Sections
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Configure dynamic product drops, flash deal countdowns, and curated collection strips that automatically display live on your homepage.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <Link
            href="/shop"
            target="_blank"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            title="View Live Store"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Store</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Section</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Sections
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {sections.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active on Home
          </span>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {activeCount}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Flash / Timed Drops
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {timedDropsCount}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Merchandising Rules
          </span>
          <div className="text-2xl font-black text-blue-600 font-mono">
            {FILTER_TYPES.length} Types
          </div>
        </div>
      </div>

      {/* 3. SECTIONS LIST */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Configured Homepage Strips
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Ordered by Priority
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Loading Landing Page Sections...
            </p>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <LayoutTemplate className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No Custom Sections Configured Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create promotional drops like &quot;Flat 40% Off Capsule&quot;, &quot;Under ₹999 Street Picks&quot;, or &quot;Heavyweight Boxy Tees&quot; to showcase targeted items on your homepage.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              + Create First Dynamic Section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sections.map((sec, idx) => {
              const id = sec._id || sec.id;
              const isActive = sec.isActive !== false;
              const isToggling = togglingId === id;
              const hasTimer = sec.countdownEndsAt && new Date(sec.countdownEndsAt) > new Date();
              const isExpired = sec.countdownEndsAt && new Date(sec.countdownEndsAt) <= new Date();

              const ruleTypeObj = FILTER_TYPES.find((t) => t.value === sec.filterType) || FILTER_TYPES[0];
              const RuleIcon = ruleTypeObj.icon;

              return (
                <div
                  key={id}
                  className={`p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors hover:bg-slate-50/70 ${
                    !isActive ? 'bg-slate-50/40 opacity-75' : ''
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-start space-x-4 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 mt-0.5">
                      #{sec.displayOrder || idx + 1}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                          {sec.title}
                        </h3>

                        {sec.badgeText && (
                          <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded tracking-wider">
                            {sec.badgeText}
                          </span>
                        )}

                        {hasTimer && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-mono font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Ends {new Date(sec.countdownEndsAt).toLocaleDateString()}</span>
                          </span>
                        )}

                        {isExpired && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[9px] font-bold">
                            EXPIRED
                          </span>
                        )}
                      </div>

                      {sec.subtitle && (
                        <p className="text-xs text-slate-500 truncate max-w-lg">
                          {sec.subtitle}
                        </p>
                      )}

                      {/* Rule Pill */}
                      <div className="flex items-center space-x-2 pt-1 text-xs">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          <RuleIcon className="w-3 h-3" />
                          <span>{ruleTypeObj.label}: <strong>{sec.filterValue}</strong></span>
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          Limit: {sec.limit || 8} products
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-3 self-end lg:self-center flex-shrink-0">
                    {/* Status Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(sec)}
                      disabled={isToggling}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      } ${isToggling ? 'opacity-50 cursor-wait' : 'cursor-pointer active:scale-95'}`}
                      title="Click to toggle visibility on storefront"
                    >
                      {isActive ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(sec)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Section Parameters"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => requestDelete(sec)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CREATE / EDIT SECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingSection ? 'Edit Landing Page Section' : 'Create Dynamic Landing Section'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Merchandise targeted drops directly to your homepage
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
            <form onSubmit={handleSaveSection} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block font-bold text-slate-700">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MIDNIGHT DROP, UNDER ₹999 ESSENTIALS"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Ribbon Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50% OFF"
                    value={formData.badgeText}
                    onChange={(e) => handleInputChange('badgeText', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none uppercase font-mono"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavyweight combed cotton basics in monochrome palettes."
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              {/* Filter Type & Filter Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Dynamic Filter Rule *
                  </label>
                  <select
                    value={formData.filterType}
                    onChange={(e) => handleInputChange('filterType', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    {FILTER_TYPES.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Filter Match Value *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={FILTER_TYPES.find((t) => t.value === formData.filterType)?.hint || ''}
                    value={formData.filterValue}
                    onChange={(e) => handleInputChange('filterValue', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                💡 <strong>How it matches:</strong> Products in your database that match{' '}
                <strong className="text-slate-700 font-mono">
                  {formData.filterType}: {formData.filterValue || '...'}
                </strong>{' '}
                will be fetched and automatically displayed under this section.
              </p>

              {/* Display Order & Product Limit & Countdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Display Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.displayOrder}
                    onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:bg-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Max Products Limit
                  </label>
                  <select
                    value={formData.limit}
                    onChange={(e) => handleInputChange('limit', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value={4}>4 Products</option>
                    <option value={8}>8 Products</option>
                    <option value={12}>12 Products</option>
                    <option value={16}>16 Products</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'draft'}
                    onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="active">🟢 Active / Live</option>
                    <option value="draft">⚪ Inactive / Draft</option>
                  </select>
                </div>
              </div>

              {/* Countdown Timer (Optional) */}
              <div className="space-y-1 pt-1">
                <label className="block font-bold text-slate-700">
                  Countdown Deadline (Optional for Flash Deals)
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.countdownEndsAt}
                    onChange={(e) => handleInputChange('countdownEndsAt', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-500 outline-none"
                  />
                  {formData.countdownEndsAt && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('countdownEndsAt', '')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-2">
                <label className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1.5">
                  Live Storefront Preview:
                </label>
                <div className="bg-[#0e0e12] text-white p-4 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      {formData.badgeText && (
                        <span className="inline-block px-2 py-0.5 mb-1 text-[9px] font-black uppercase tracking-wider bg-white text-black rounded-sm">
                          {formData.badgeText}
                        </span>
                      )}
                      <h4 className="font-sans font-black text-base text-white uppercase tracking-tight">
                        {formData.title || 'YOUR SECTION TITLE'}
                      </h4>
                      {formData.subtitle && (
                        <p className="text-[11px] text-gray-400">{formData.subtitle}</p>
                      )}
                    </div>
                    {formData.countdownEndsAt && (
                      <div className="flex items-center space-x-1 text-[10px] text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">
                        <Clock className="w-3 h-3" />
                        <span>Limited Drop</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{editingSection ? 'Update Section' : 'Create Section'}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setSectionToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Landing Section"
        message="Are you sure you want to remove this section? It will be immediately removed from the live homepage."
        itemName={sectionToDelete?.title || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Section'}
        isLoading={isDeleting}
        isDanger={true}
      />

    </div>
  );
}

