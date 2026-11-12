'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Tag,
  Percent,
  Flame,
  LayoutTemplate,
  Calendar,
  Layers,
  X,
  Filter,
  Check
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import {
  getAllSections,
  createSection,
  updateSection,
  toggleSectionStatus,
  deleteSection,
  getAttributes,
} from '@/app/api/adminapi';

const DEFAULT_CATEGORIES = [
  'Oversized Tees',
  'Graphic Streetwear',
  'Heavyweight Essentials',
  'Acid Wash Capsule',
  'Hoodies & Sweats',
  'Cargo Pants & Bottoms',
];

const DEFAULT_FITS = [
  'Oversized Fit',
  'Boxy Cut',
  'Relaxed Fit',
  'Drop Shoulder',
  'Regular Fit',
];

const DEFAULT_THEMES = [
  'Streetwear',
  'Vintage Nostalgia',
  'Minimalist Typography',
  'Japanese Anime Art',
  'Gothic & Cyberpunk',
  'Abstract Geometry',
  'Acid Wash',
];

const DEFAULT_COLLECTIONS = [
  'Drop 01 - Heavyweight',
  'Fall Winter 2026',
  'Acid Wash Series',
  'Monochrome Signature',
  'Limited Capsule',
];

export default function AdminSectionsPage() {
  const { showToast } = useAdmin() || {};

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Available options for pure select dropdowns (loaded from MongoDB)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [fits, setFits] = useState(DEFAULT_FITS);
  const [themes, setThemes] = useState(DEFAULT_THEMES);
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);

  // Modal State (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State (with 4 pure dropdown targeting criteria)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',        // Optional select dropdown
    fit: '',             // Optional select dropdown
    theme: '',           // Optional select dropdown
    collectionName: '',  // Optional select dropdown
    badgeText: '',
    limit: 8,
    displayOrder: 1,
    countdownEndsAt: '',
    isActive: true,
  });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch sections and live attributes from MongoDB
  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, attrRes] = await Promise.all([
        getAllSections().catch(() => null),
        getAttributes().catch(() => null),
      ]);

      if (secRes && (secRes.sections || secRes.data)) {
        setSections(secRes.sections || secRes.data || []);
      } else if (Array.isArray(secRes)) {
        setSections(secRes);
      }

      if (attrRes?.success && Array.isArray(attrRes.data)) {
        const liveFits = attrRes.data.filter((a) => a.type === 'fit').map((a) => a.name);
        const liveThemes = attrRes.data.filter((a) => a.type === 'theme').map((a) => a.name);
        const liveCollections = attrRes.data.filter((a) => a.type === 'collection').map((a) => a.name);

        if (liveFits.length > 0) setFits([...new Set([...liveFits, ...DEFAULT_FITS])]);
        if (liveThemes.length > 0) setThemes([...new Set([...liveThemes, ...DEFAULT_THEMES])]);
        if (liveCollections.length > 0) setCollections([...new Set([...liveCollections, ...DEFAULT_COLLECTIONS])]);
      }
    } catch (err) {
      console.error('Failed to load sections data:', err);
      if (showToast) showToast('Failed to load sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSection(null);
    setFormData({
      title: '',
      subtitle: '',
      category: '',
      fit: '',
      theme: '',
      collectionName: '',
      badgeText: '',
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
      category: sec.category || (sec.filterType === 'category' ? sec.filterValue : ''),
      fit: sec.fit || (sec.filterType === 'fit' ? sec.filterValue : ''),
      theme: sec.theme || (sec.filterType === 'theme' ? sec.filterValue : ''),
      collectionName: sec.collectionName || '',
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save Section (Create / Update)
  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Section Title');
      return;
    }

    setIsSaving(true);
    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category || '',
      fit: formData.fit || '',
      theme: formData.theme || '',
      collectionName: formData.collectionName || '',
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
          fetchData();
        } else {
          alert(res?.message || 'Failed to update section');
        }
      } else {
        const res = await createSection(payload);
        if (res && res.success !== false) {
          if (showToast) showToast(`Section "${payload.title}" created successfully!`, 'success');
          setIsModalOpen(false);
          fetchData();
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

  // Selected filter criteria count for live preview in modal
  const selectedCriteria = [
    formData.category ? `Category: ${formData.category}` : null,
    formData.fit ? `Fit: ${formData.fit}` : null,
    formData.theme ? `Theme: ${formData.theme}` : null,
    formData.collectionName ? `Collection: ${formData.collectionName}` : null,
  ].filter(Boolean);

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
            Target products using Category, Fit Style, Theme, and Collection dropdowns. Products matching all your selected criteria will automatically appear on the homepage.
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
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Section</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Sections
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{sections.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active on Store</span>
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Flash Drop Timers</span>
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{timedDropsCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block flex items-center space-x-1">
            <Filter className="w-3 h-3 text-blue-500" />
            <span>Targeting Rules</span>
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">Multi-Dropdown</p>
        </div>
      </div>

      {/* 3. SECTIONS LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900">
            Configured Merchandising Strips ({sections.length})
          </h2>
          <span className="text-xs text-slate-500">
            Sections display in order of Priority (#1 highest)
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            Loading Sections from Database...
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Custom Sections Configured Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create dynamic strips like &quot;Oversized Anime Capsule&quot;, &quot;Heavyweight Boxy Tees&quot;, or &quot;Acid Wash Streetwear&quot; to showcase targeted items on your homepage.
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

              // Collect active criteria pills for this section
              const criteriaList = [];
              if (sec.category) criteriaList.push({ label: 'Category', val: sec.category, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' });
              if (sec.fit) criteriaList.push({ label: 'Fit', val: sec.fit, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' });
              if (sec.theme) criteriaList.push({ label: 'Theme', val: sec.theme, color: 'bg-sky-50 text-sky-800 border-sky-200' });
              if (sec.collectionName) criteriaList.push({ label: 'Drop', val: sec.collectionName, color: 'bg-amber-50 text-amber-800 border-amber-200' });

              // Legacy rule fallback
              if (criteriaList.length === 0 && sec.filterType && sec.filterValue) {
                criteriaList.push({ label: sec.filterType, val: sec.filterValue, color: 'bg-blue-50 text-blue-800 border-blue-200' });
              }

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

                      {/* Rule Pills Strip */}
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 pt-1 text-xs">
                        {criteriaList.length > 0 ? (
                          <>
                            {criteriaList.map((crit, cIdx) => (
                              <React.Fragment key={cIdx}>
                                {cIdx > 0 && (
                                  <span className="text-[10px] font-black text-slate-400 font-mono">+</span>
                                )}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${crit.color}`}>
                                  <span>{crit.label}: <strong>{crit.val}</strong></span>
                                </span>
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                            Targeting: All Active Products
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-mono ml-2">
                          • Max {sec.limit || 8} items
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
                    Target products using pure dropdowns (no typing mistakes)
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
                    placeholder="e.g. OVERSIZED ANIME CAPSULE, BEST OF BOXY"
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
                    placeholder="e.g. LIMITED DROP"
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
                  placeholder="e.g. Heavyweight silhouettes engineered with Japanese manga art."
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              {/* ======================================================== */}
              {/* 4 PURE DROPDOWNS: CATEGORY, FIT, THEME, COLLECTION       */}
              {/* No manual typing allowed to prevent mismatches!          */}
              {/* None mandatory: 1 = matches 1, 2 = matches both (AND)    */}
              {/* ======================================================== */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    <span>Targeting Criteria (All Optional Dropdowns)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Select 1, 2, or more to filter by combined AND logic
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Category Dropdown */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Product Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">Any Category (No filter)</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Fit Style Dropdown */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Fit Style Cut
                    </label>
                    <select
                      value={formData.fit}
                      onChange={(e) => handleInputChange('fit', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">Any Fit Style (No filter)</option>
                      {fits.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Theme Dropdown */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Aesthetic Theme Tag
                    </label>
                    <select
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">Any Theme (No filter)</option>
                      {themes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Collection / Capsule Dropdown */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Capsule Drop / Collection
                    </label>
                    <select
                      value={formData.collectionName}
                      onChange={(e) => handleInputChange('collectionName', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">Any Collection (No filter)</option>
                      {collections.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Targeting Explanation Pill */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-700 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Targeting Logic:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedCriteria.length === 0 ? (
                      <span className="text-slate-500 italic">
                        No filters selected — this section will showcase all active products.
                      </span>
                    ) : (
                      <span>
                        Display products where{' '}
                        {selectedCriteria.map((crit, idx) => (
                          <span key={idx}>
                            {idx > 0 && <strong className="text-blue-600"> AND </strong>}
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-semibold text-slate-900">
                              {crit}
                            </span>
                          </span>
                        ))}
                      </span>
                    )}
                  </p>
                </div>
              </div>

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
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={formData.limit}
                    onChange={(e) => handleInputChange('limit', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:bg-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Flash Sale End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.countdownEndsAt}
                    onChange={(e) => handleInputChange('countdownEndsAt', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Section Status: {formData.isActive ? 'Active (Live)' : 'Draft (Hidden)'}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    When active, this strip immediately displays on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('isActive', !formData.isActive)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                    formData.isActive ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
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
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{editingSection ? 'Update Section' : 'Save Section'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. REUSABLE DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setSectionToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Merchandising Section"
        message="Are you sure you want to remove this dynamic section from your homepage storefront?"
        itemName={sectionToDelete?.title || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Section'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
