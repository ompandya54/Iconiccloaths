'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Tag,
  SlidersHorizontal,
  Sparkles,
  Flame,
  Palette,
  Layers,
  Shirt,
  Check,
} from 'lucide-react';
import { useAdmin } from '../layout';
import ConfirmModal from '@/components/ConfirmModal';
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from '@/app/api/adminapi';

// Defined Tab Categories for the top sticky bar matching the reference design
const ATTRIBUTE_TABS = [
  { key: 'fit', tabTitle: 'FIT STYLES', label: 'Fit Styles', icon: SlidersHorizontal, defaultDesc: 'Cut & silhouette classifications (e.g. Oversized Fit, Boxy Cut)' },
  { key: 'theme', tabTitle: 'THEMES', label: 'Theme Tags', icon: Sparkles, defaultDesc: 'Design aesthetics & subcultures (e.g. Streetwear, Anime Art)' },
  { key: 'badge', tabTitle: 'BADGES', label: 'Ribbon Badges', icon: Flame, defaultDesc: 'Thumbnail promo badges & marketing tags (e.g. NEW DROP, BESTSELLER)' },
  { key: 'material', tabTitle: 'FABRICS & GSM', label: 'Fabrics & GSM', icon: Tag, defaultDesc: 'Fabric composition & GSM weight presets (e.g. 260 GSM French Terry)' },
  { key: 'color', tabTitle: 'COLORS', label: 'Color Swatches', icon: Palette, defaultDesc: 'Colorways & hex values for product variant pickers' },
  { key: 'collection', tabTitle: 'COLLECTIONS', label: 'Capsule Drops', icon: Layers, defaultDesc: 'Signature collection drops & lookbook themes' },
  { key: 'size', tabTitle: 'SIZES', label: 'Sizes', icon: Shirt, defaultDesc: 'Standard garment sizing scale (e.g. XS to 3XL)' },
];

// Fallback descriptions for standard presets if description isn't stored in DB yet
const DEFAULT_DESCRIPTIONS = {
  'Oversized Fit': 'Signature drop-shoulder relaxed silhouette with generous chest drape.',
  'Boxy Cut': 'Square-proportioned streetwear cut with shortened torso and wide hem.',
  'Relaxed Fit': 'Easy-going casual drape for effortless everyday styling.',
  'Drop Shoulder': 'Extended shoulder seam creating slouchy streetwear drape.',
  'Regular Fit': 'Classic tailored garment fit true to standard size.',
  'Streetwear': 'Urban subculture styling inspired by modern skate and runway wear.',
  'Vintage Nostalgia': 'Washed retro aesthetics with 90s distressing and faded graphics.',
  'Minimalist Typography': 'Subtle editorial type layout on monochrome bases.',
  'Japanese Anime Art': 'Hand-drawn manga illustrations with vibrant screenprint accents.',
  'Gothic & Cyberpunk': 'Dark futuristic glyphs with neon industrial highlights.',
  'Acid Wash': 'Mineral wash treatment delivering unique marbled fade tones.',
  'NEW DROP': 'Front-line seasonal archive drop badge for new arrivals.',
  'BESTSELLER': 'Top-performing streetwear grail tag with maximum customer demand.',
  'LIMITED': 'Limited edition archive piece produced in capped production runs.',
  'ESSENTIAL': 'Core foundational everyday wardrobe garment.',
  'HOT': 'Fast-trending product generating intense customer views.',
  'FLAT 40% OFF': 'Seasonal promotional discount badge.',
  'ARCHIVE': 'Permanent vault staple from iconic collection archives.',
  '100% French Terry Cotton (240 GSM)': 'Heavyweight loopback French terry knit with breathable soft finish.',
  'Heavyweight Combed Cotton (260 GSM)': 'Dense, compact luxury cotton with pre-shrunk structure.',
  'Compact Cotton (210 GSM)': 'Lightweight breathable pure cotton for summer comfort.',
  'Pre-Shrunk Bio-Washed Cotton (250 GSM)': 'Silky soft enzyme wash cotton resistant to post-wash shrinkage.',
  'Heavy Fleece (380 GSM)': 'Ultra-dense brushed interior fleece for winter insulation.',
  'Silicon Washed Loopknit (280 GSM)': 'Smooth silicon-finished loopknit with velvety hand-feel.',
  'Pitch Black': 'Deep midnight black reactive dye with colorfast finish.',
  'Pure White': 'Crisp optical white pre-shrunk cotton base.',
  'Vintage Charcoal': 'Washed dark graphite with authentic vintage stone-wash patina.',
  'Acid Grey': 'Smoky mineral acid wash with marbled fade highlights.',
  'Slate Blue': 'Muted steel blue dye inspired by industrial streetwear palettes.',
  'Drop 01 - Heavyweight': 'Inaugural seasonal streetwear capsule collection.',
  'Fall Winter 2026': 'Cold-weather capsule featuring dense fleece and outerwear.',
  'Acid Wash Series': 'Experimental distressed denim and mineral wash t-shirt drop.',
  'Monochrome Signature': 'Minimalist black, white, and graphite capsule collection.',
};

export default function AdminAttributesPage() {
  const { showToast } = useAdmin() || {};

  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);

  // Active Category Tab
  const [activeTab, setActiveTab] = useState('fit');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state (default: 25 items per page like reference design)
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Checkbox multi-select state
  const [selectedIds, setSelectedIds] = useState([]);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = create, object = edit
  const [modalForm, setModalForm] = useState({
    type: 'fit',
    name: '',
    description: '',
    value: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
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

  // Filtered attributes for currently active tab + search query
  const filteredItems = useMemo(() => {
    const list = attributes.filter((a) => a.type === activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.value && a.value.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }, [attributes, activeTab, searchQuery]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Tab switch handler
  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Toggle select all on current page
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allPageIds = paginatedItems.map((item) => item._id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allPageIds])));
    } else {
      const pageIdSet = new Set(paginatedItems.map((item) => item._id));
      setSelectedIds(selectedIds.filter((id) => !pageIdSet.has(id)));
    }
  };

  const isAllPageSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item._id));

  // Toggle single item selection
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Create Modal (pre-sets type to currently active tab)
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setModalForm({
      type: activeTab,
      name: '',
      description: '',
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
      description: item.description || DEFAULT_DESCRIPTIONS[item.name] || '',
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
          description: modalForm.description.trim(),
          value: modalForm.value || '',
          isActive: modalForm.isActive,
        });

        if (res?.success && res.data) {
          setAttributes((prev) =>
            prev.map((a) => (a._id === editingItem._id ? res.data : a))
          );
          if (showToast) showToast(`"${cleanName}" updated successfully`, 'success');
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
          description: modalForm.description.trim(),
          value: modalForm.value || '',
          isActive: modalForm.isActive,
        });

        if (res?.success && res.data) {
          setAttributes((prev) => [...prev, res.data]);
          if (showToast) showToast(`Added "${cleanName}"`, 'success');
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

  // Request single delete
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
        setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
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

  // Format date helper: "21 Apr 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return '21 Apr 2026';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '21 Apr 2026';
    }
  };

  const currentTabObj = ATTRIBUTE_TABS.find((t) => t.key === activeTab) || ATTRIBUTE_TABS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER ROW: TITLE + HORIZONTAL CATEGORY TABS      */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 pt-3.5 flex flex-col md:flex-row md:items-end justify-between gap-3 flex-shrink-0">
        
        {/* Left: Product Attributes Title */}
        <div className="pb-3 flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Product Attributes
          </h1>
        </div>

        {/* Right: Clean horizontal uppercase tabs line with bottom active border */}
        <nav className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar flex-shrink-0">
          <Link
            href="/admin/categories"
            className="pb-3 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-700 font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            CATEGORIES
          </Link>
          {ATTRIBUTE_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-3 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'text-slate-950 font-bold border-b-2 border-slate-950 -mb-px'
                    : 'text-slate-400 hover:text-slate-700 font-semibold'
                }`}
              >
                {tab.tabTitle}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ======================================================== */}
      {/* 2. ACTION TOOLBAR: [+] BUTTON + SEARCH + PAGINATION CTRL */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
        
        {/* Left: Dark Square [+] Add Button + Search input */}
        <div className="flex items-center space-x-2.5">
          {/* Black Square [+] Button */}
          <button
            onClick={handleOpenCreateModal}
            className="w-8 h-8 rounded-lg bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer flex-shrink-0"
            title={`Add New ${currentTabObj.label}`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Search categories input */}
          <div className="relative w-52 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search ${currentTabObj.tabTitle.toLowerCase()}...`}
              className="w-full bg-white border border-slate-200 rounded-lg pl-8.5 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Items per page select dropdown & < 1 > Pagination Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Items Per Page Select [ 25 ˅ ] */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Pagination Navigation [ < 1 > ] */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-colors cursor-pointer"
              title="Previous Page"
            >
              ‹
            </button>
            <span className="px-2.5 py-1 text-xs font-bold text-slate-900 border-x border-slate-100 min-w-[28px] text-center">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-colors cursor-pointer"
              title="Next Page"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CLEAN HIGH-DENSITY ATTRIBUTES TABLE                   */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Loading attributes...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              No {currentTabObj.label} found
            </p>
            <p className="text-xs text-slate-400">
              {searchQuery
                ? `No items matching "${searchQuery}"`
                : `Click the "+" button to add your first ${currentTabObj.label.toLowerCase()}`}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              + Add {currentTabObj.tabTitle}
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header Row */}
            <thead className="bg-white border-b border-slate-200 text-slate-400 uppercase font-bold text-[11px] tracking-wider sticky top-0 z-10 shadow-xs">
              <tr>
                {/* Checkbox */}
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </th>

                {/* Photo / Preview Thumbnail */}
                <th className="py-3 px-3 w-16 text-center">Photo</th>

                {/* Name */}
                <th className="py-3 px-4 min-w-[160px]">Name</th>

                {/* Description */}
                <th className="py-3 px-4 min-w-[280px]">Description</th>

                {/* Type */}
                <th className="py-3 px-4 w-28 text-center">Type</th>

                {/* Status */}
                <th className="py-3 px-4 w-24 text-center">Status</th>

                {/* Created */}
                <th className="py-3 px-4 w-32">Created</th>

                {/* Actions (Pencil & Trash) */}
                <th className="py-3 px-4 w-20 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedItems.map((item) => {
                const isSelected = selectedIds.includes(item._id);
                const descriptionText =
                  item.description || DEFAULT_DESCRIPTIONS[item.name] || '—';

                return (
                  <tr
                    key={item._id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-slate-50/90' : ''
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td className="py-2.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item._id)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Photo / Visual Swatch Column */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center">
                        {item.type === 'color' ? (
                          <div
                            className="w-9 h-9 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: item.value || '#0a0a0c' }}
                            title={item.value || '#0a0a0c'}
                          />
                        ) : item.type === 'material' ? (
                          <div className="w-9 h-9 rounded-xl border border-slate-200/80 bg-amber-50/80 text-amber-900 flex flex-col items-center justify-center font-mono text-[9px] font-black leading-tight flex-shrink-0 shadow-xs">
                            <span>{item.value ? item.value.replace(/[^0-9]/g, '') : '240'}</span>
                            <span className="text-[7px] text-amber-700">GSM</span>
                          </div>
                        ) : item.type === 'badge' ? (
                          <div className="w-9 h-9 rounded-xl border border-slate-900 bg-slate-950 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Flame className="w-4 h-4 fill-amber-400/20" />
                          </div>
                        ) : item.type === 'fit' ? (
                          <div className="w-9 h-9 rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Shirt className="w-4 h-4 text-slate-600" />
                          </div>
                        ) : item.type === 'theme' ? (
                          <div className="w-9 h-9 rounded-xl border border-slate-200/80 bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        ) : item.type === 'collection' ? (
                          <div className="w-9 h-9 rounded-xl border border-slate-200/80 bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Layers className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl border border-slate-200/80 bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                            {item.name}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.name}
                      </div>
                    </td>

                    {/* Description Column */}
                    <td className="py-2.5 px-4">
                      <div
                        className="text-xs text-slate-500 max-w-md truncate font-normal"
                        title={descriptionText}
                      >
                        {descriptionText}
                      </div>
                    </td>

                    {/* Type Badge (Light Blue Pill matching reference) */}
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                        STANDARD
                      </span>
                    </td>

                    {/* Status Badge (Soft Green Pill matching reference) */}
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.isActive !== false
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {item.isActive !== false ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-2.5 px-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions: Edit (Pencil) + Delete (Trash) */}
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Attribute"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Attribute"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. ADD / EDIT ATTRIBUTE POPUP MODAL                      */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingItem ? 'Edit Attribute' : 'Add New Attribute'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Saves directly to database taxonomy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAttribute} className="p-6 space-y-3.5 text-xs">
              {/* Type Selector Dropdown */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Attribute Type *</label>
                <select
                  value={modalForm.type}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-slate-400 outline-none cursor-pointer"
                >
                  {ATTRIBUTE_TABS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label} ({t.tabTitle})
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
                  placeholder="e.g. Oversized Fit, 260 GSM, Pitch Black..."
                  value={modalForm.name}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-slate-400 outline-none"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description displayed in the taxonomy table..."
                  value={modalForm.description}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:border-slate-400 outline-none resize-none"
                />
              </div>

              {/* Special Value Input (Color Swatch or GSM) */}
              {modalForm.type === 'color' && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Hex Color Swatch *</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={modalForm.value || '#0a0a0c'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#0a0a0c"
                      value={modalForm.value || '#0a0a0c'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-slate-400 outline-none"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-slate-400 outline-none font-mono"
                  />
                </div>
              )}

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    Status: {modalForm.isActive ? 'Active' : 'Draft'}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Active attributes appear in product selection dropdowns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                    modalForm.isActive ? 'bg-slate-950 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{editingItem ? 'Update' : 'Save'}</span>
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
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}"?`}
        itemName={itemToDelete?.name || ''}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
