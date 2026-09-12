import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Plus, Droplets, Calendar, AlertCircle, 
  CheckCircle2, Sprout, Clock, Trash2, CheckSquare, 
  Square, X, Activity, BarChart2, ShieldCheck, ChevronRight,
  BookOpen, Search, Layers, Award, Info, Sparkles, ExternalLink,
  Thermometer, Sun, Beaker, Bug, ArrowRight
} from 'lucide-react';
import { ALL_CROPS_DIRECTORY } from '../data/allCropsData';

const INITIAL_CROPS = [
  {
    id: 1,
    name: "Paddy (BPT 5204 - Samba Mahsuri)",
    variety: "BPT 5204 (Fine Grain)",
    area: "2.5 Acres",
    sowingDate: "2026-07-15",
    stage: "Active Tillering",
    stageNumber: 2,
    totalStages: 5,
    progress: 55,
    waterSchedule: "Alternate Wetting & Drying (AWD)",
    healthStatus: "Healthy",
    healthLevel: "green",
    expectedHarvest: "Nov 2026",
    expectedYield: "65 Quintals",
    tasks: [
      { id: 101, text: "Apply 2nd dose of Urea (25kg) + Potash (15kg)", done: true, dueDate: "10 Sep 2026" },
      { id: 102, text: "Inspect leaf tips for Yellow Stem Borer dead hearts", done: false, dueDate: "14 Sep 2026" },
      { id: 103, text: "Check water drainage before forecasted rain", done: false, dueDate: "16 Sep 2026" }
    ],
    activities: [
      { date: "10 Sep 2026", type: "Fertilizer", note: "Applied Urea top dressing." },
      { date: "28 Aug 2026", type: "Weeding", note: "Cono-weeder intercultivation done." },
      { date: "15 Jul 2026", type: "Sowing", note: "Transplanting 25-day old seedlings." }
    ]
  },
  {
    id: 2,
    name: "Tomato (Arka Rakshak)",
    variety: "Arka Rakshak (F1 Hybrid)",
    area: "1.5 Acres",
    sowingDate: "2026-08-01",
    stage: "Flowering & Early Fruiting",
    stageNumber: 3,
    totalStages: 5,
    progress: 68,
    waterSchedule: "Drip Irrigation (Daily 2 Hours)",
    healthStatus: "Attention: Leaf spot preventive spray due",
    healthLevel: "yellow",
    expectedHarvest: "Oct 2026",
    expectedYield: "220 Crates",
    tasks: [
      { id: 201, text: "Foliar spray Mancozeb 75% WP @ 2g/L", done: false, dueDate: "13 Sep 2026" },
      { id: 202, text: "Check trellis staking for heavy fruiting branches", done: true, dueDate: "08 Sep 2026" },
      { id: 203, text: "Apply 19:19:19 soluble fertilizer via fertigation", done: false, dueDate: "18 Sep 2026" }
    ],
    activities: [
      { date: "08 Sep 2026", type: "Support", note: "Staking bamboo poles completed." },
      { date: "18 Aug 2026", type: "Pesticide", note: "Neem oil spray for whiteflies." }
    ]
  },
  {
    id: 3,
    name: "Guntur Teja Red Chilli",
    variety: "Teja 334 / G4",
    area: "1.0 Acre",
    sowingDate: "2026-08-20",
    stage: "Vegetative Branching",
    stageNumber: 1,
    totalStages: 5,
    progress: 30,
    waterSchedule: "Micro-Sprinkler (Alternate Days)",
    healthStatus: "Healthy",
    healthLevel: "green",
    expectedHarvest: "Dec 2026",
    expectedYield: "18 Quintals (Dry)",
    tasks: [
      { id: 301, text: "Install 25 Blue Sticky Traps for Black Thrips", done: false, dueDate: "15 Sep 2026" },
      { id: 302, text: "Seedling root dip with Trichoderma viride", done: true, dueDate: "20 Aug 2026" }
    ],
    activities: [
      { date: "20 Aug 2026", type: "Transplant", note: "Transplanted healthy 30-day seedlings." }
    ]
  }
];

export default function MyCrops({ t, language, user }) {
  const [activeTab, setActiveTab] = useState('library'); // 'tracker' | 'library'
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_my_crops');
      return saved ? JSON.parse(saved) : INITIAL_CROPS;
    } catch {
      return INITIAL_CROPS;
    }
  });

  const farmerPhone = user?.phone || '9848022338';

  // Fetch crops from Cloud Database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCloudCrops() {
      try {
        const res = await fetch(`/api/user/crops?farmer_phone=${farmerPhone}`);
        if (res.ok) {
          const cloudData = await res.json();
          if (isMounted && Array.isArray(cloudData) && cloudData.length > 0) {
            const mapped = cloudData.map(c => ({
              id: c.id,
              name: c.crop_name || c.name || "Paddy",
              variety: c.variety || "High Yield",
              area: typeof c.acres === 'number' ? `${c.acres} Acres` : (c.area || "2.0 Acres"),
              sowingDate: c.sowing_date || c.sowingDate || "2026-08-01",
              stage: c.stage || "Active Growth",
              stageNumber: 2,
              totalStages: 5,
              progress: 50,
              waterSchedule: c.water_schedule || "Drip / Furrow Irrigation",
              healthStatus: c.health_status || "Healthy",
              healthLevel: "green",
              expectedHarvest: c.expected_harvest || "Upcoming Season",
              expectedYield: c.expected_yield || "Standard Yield",
              tasks: [
                { id: 1, text: "Inspect leaf canopy & soil moisture", done: false, dueDate: "In 3 Days" },
                { id: 2, text: "Nutrient foliar application", done: true, dueDate: "Completed" }
              ],
              activities: [
                { date: c.sowing_date || "Recent", type: "Sowing", note: `Planted in ${c.acres || 2} acres.` }
              ]
            }));
            setCrops(mapped);
          }
        }
      } catch (err) {
        console.warn("Cloud crops fetch fallback:", err);
      }
    }
    loadCloudCrops();
    return () => { isMounted = false; };
  }, [farmerPhone]);

  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || 1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedDetailCrop, setSelectedDetailCrop] = useState(null);

  // Library filters
  const [libSearch, setLibSearch] = useState('');
  const [libCategory, setLibCategory] = useState('All');

  // New crop form
  const [newCrop, setNewCrop] = useState({
    name: "Cotton (Bt Hybrid)",
    variety: "Bollgard II",
    area: "2.0 Acres",
    sowingDate: new Date().toISOString().split('T')[0],
    waterSchedule: "Drip Irrigation",
    expectedHarvest: "Dec 2026"
  });

  // New activity form
  const [newActivity, setNewActivity] = useState({
    type: "Fertilizer",
    note: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Save crops to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrisathi_my_crops', JSON.stringify(crops));
    } catch (e) {
      console.error(e);
    }
  }, [crops]);

  const activeCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  const handleToggleTask = (cropId, taskId) => {
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
          };
        }
        return c;
      })
    );
  };

  const handleAddCropSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      name: newCrop.name,
      variety: newCrop.variety || "Standard Hybrid",
      area: newCrop.area || "1.0 Acre",
      sowingDate: newCrop.sowingDate,
      stage: "Nursery / Sowing",
      stageNumber: 1,
      totalStages: 5,
      progress: 15,
      waterSchedule: newCrop.waterSchedule || "Canal / Flood",
      healthStatus: "Healthy",
      healthLevel: "green",
      expectedHarvest: newCrop.expectedHarvest || "Upcoming Season",
      expectedYield: "As per package of practice",
      tasks: [
        { id: Date.now() + 1, text: "Initial basal fertilizer application (NPK)", done: false, dueDate: "Next Week" },
        { id: Date.now() + 2, text: "First irrigation & weed inspection", done: false, dueDate: "In 10 Days" }
      ],
      activities: [
        { date: newCrop.sowingDate, type: "Sowing", note: `Sown in ${newCrop.area} field.` }
      ]
    };

    setCrops([created, ...crops]);
    setSelectedCropId(created.id);
    setShowAddModal(false);
    setActiveTab('tracker');

    // Cloud sync in background
    try {
      await fetch('/api/user/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_phone: farmerPhone,
          crop_name: created.name,
          variety: created.variety,
          acres: parseFloat(created.area) || 2.0,
          sowing_date: created.sowingDate,
          stage: created.stage,
          health_status: created.healthStatus
        })
      });
    } catch (err) {
      console.warn("Cloud save crop fallback:", err);
    }
  };

  const handleAddFromLibrary = (libCrop) => {
    setNewCrop({
      name: libCrop.name,
      variety: libCrop.popularVarieties[0] || "High Yield Variety",
      area: "2.0 Acres",
      sowingDate: new Date().toISOString().split('T')[0],
      waterSchedule: "Drip / Furrow Irrigation",
      expectedHarvest: "As per season"
    });
    setSelectedDetailCrop(null);
    setShowAddModal(true);
  };

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!newActivity.note.trim()) return;

    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === selectedCropId) {
          return {
            ...c,
            activities: [
              { date: newActivity.date, type: newActivity.type, note: newActivity.note },
              ...(c.activities || [])
            ]
          };
        }
        return c;
      })
    );

    setNewActivity({ type: "Fertilizer", note: "", date: new Date().toISOString().split('T')[0] });
    setShowActivityModal(false);
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm("Are you sure you want to remove this crop tracker?")) {
      const remaining = crops.filter((c) => c.id !== id);
      setCrops(remaining);
      if (remaining.length > 0) setSelectedCropId(remaining[0].id);

      // Cloud delete
      try {
        await fetch(`/api/user/crops/${id}?farmer_phone=${farmerPhone}`, { method: 'DELETE' });
      } catch (err) {
        console.warn("Cloud delete crop fallback:", err);
      }
    }
  };

  // Filter crops in library
  const filteredDirectory = useMemo(() => {
    return ALL_CROPS_DIRECTORY.filter((c) => {
      const matchSearch = libSearch === '' || 
        c.name.toLowerCase().includes(libSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(libSearch.toLowerCase()) ||
        c.popularVarieties.some(v => v.toLowerCase().includes(libSearch.toLowerCase()));

      const matchCat = libCategory === 'All' || c.category.toLowerCase().includes(libCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [libSearch, libCategory]);

  const categories = ["All", "Cereals & Grains", "Cash Crops", "Spices", "Oilseeds", "Vegetables", "Pulses", "Fruits"];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Visual Farm Management Showcase Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(6, 95, 70, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #34d399'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#a7f3d0' }}>
            <Sparkles size={14} /> ICAR Precision Agronomy & Crop Advisory
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.myCropsTitle || "Indian Crops & Farm Management"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#d1fae5', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            Manage your active fields, track growth stages, schedule irrigation and pest sprays, and explore ICAR scientific agronomy packages.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="as-btn-primary" 
              onClick={() => setShowAddModal(true)}
              style={{ background: '#22c55e', borderColor: '#22c55e', color: '#052e16', fontWeight: '700' }}
            >
              <Plus size={16} /> {t.addNewCrop || "+ Add Crop Field"}
            </button>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/farmer-crops.jpg" 
            alt="Smart Farmer Field Management" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #065f46 0%, rgba(6,95,70,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border-color, #e2e8f0)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          style={{
            padding: '10px 22px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            background: activeTab === 'library' ? '#16a34a' : '#f1f5f9',
            color: activeTab === 'library' ? '#ffffff' : '#475569'
          }}
        >
          <BookOpen size={18} />
          <span>{t.tabCropLibrary || "All Indian Crops Agronomy Guide"} ({ALL_CROPS_DIRECTORY.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracker')}
          style={{
            padding: '10px 22px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            background: activeTab === 'tracker' ? '#16a34a' : '#f1f5f9',
            color: activeTab === 'tracker' ? '#ffffff' : '#475569'
          }}
        >
          <Sprout size={18} />
          <span>{t.tabMyTracker || "My Active Field Trackers"} ({crops.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL CROPS DIRECTORY & AGRONOMY GUIDE */}
      {activeTab === 'library' && (
        <div>
          {/* Search & Filter Toolbar */}
          <div className="as-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '240px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input
                  type="text"
                  className="as-input"
                  style={{ paddingLeft: '40px', width: '100%' }}
                  placeholder={t.searchCrops || "Search any crop e.g. Paddy, Cotton, Chilli, Wheat, Turmeric, Tomato..."}
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>Category:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: libCategory === cat ? '#16a34a' : 'white',
                      color: libCategory === cat ? 'white' : '#475569',
                      borderColor: libCategory === cat ? '#16a34a' : '#cbd5e1'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crops Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
            {filteredDirectory.map((c) => (
              <div 
                key={c.id} 
                className="as-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '22px',
                  borderTop: `4px solid ${c.iconColor || '#16a34a'}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedDetailCrop(c)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{c.category}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>{c.duration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#14532d', margin: '4px 0 2px 0' }}>{c.name}</h3>
                  <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '12px' }}>{c.scientificName}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <strong>🗓️ Season:</strong> <span>{c.season}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <strong>🌾 Avg Yield:</strong> <span>{c.yield}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <strong>💰 MSP/Rate:</strong> <span style={{ color: '#15803d', fontWeight: '600' }}>{c.benchmarkPrice}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Key Varieties:</div>
                    <div style={{ color: 'var(--text-main)' }}>{c.popularVarieties.slice(0, 3).join(', ')}...</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button 
                    type="button"
                    className="as-btn-outline" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDetailCrop(c);
                    }}
                  >
                    <Info size={15} />
                    <span>View Agronomy</span>
                  </button>

                  <button 
                    type="button"
                    className="as-btn-primary" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFromLibrary(c);
                    }}
                  >
                    <Plus size={15} />
                    <span>Track Field</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY ACTIVE CROPS TRACKER */}
      {activeTab === 'tracker' && (
        <div>
          {/* Top Farm Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.activeCropsCount || "ACTIVE CROPS"}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>{crops.length} {t.activeCropsCount || "Fields"}</div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.totalLand || "TOTAL FARM ACREAGE"}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>5.0 {t.acres || "Acres"}</div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CURRENT SEASON</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Kharif 2026</div>
              </div>
            </div>
          </div>

          {crops.length === 0 ? (
            <div className="as-card" style={{ padding: '60px', textAlign: 'center' }}>
              <Leaf size={48} color="#16a34a" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <h3>No Crops Registered In Tracker Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Select any crop from our ICAR Crop Library or add a custom field.</p>
              <button className="as-btn-primary" onClick={() => setActiveTab('library')}>
                <BookOpen size={16} /> Browse Crop Library
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' }}>
              {/* Left: Crop List Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Your Crop Fields</h3>
                {crops.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className="as-card"
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      border: crop.id === selectedCropId ? '2px solid #16a34a' : '1px solid var(--border-color)',
                      background: crop.id === selectedCropId ? '#f0fdf4' : 'white',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span className="badge badge-green" style={{ marginBottom: '4px' }}>{crop.area}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#14532d' }}>{crop.name}</h4>
                      </div>
                      <ChevronRight size={18} color={crop.id === selectedCropId ? '#16a34a' : 'var(--text-muted)'} />
                    </div>

                    <div style={{ margin: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Stage: {crop.stage}</span>
                        <span>{crop.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${crop.progress}%`, height: '100%', background: '#16a34a', borderRadius: '10px' }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: crop.healthLevel === 'yellow' ? '#b45309' : '#15803d', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> {crop.healthStatus}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Detailed Active Crop View */}
              {activeCrop && (
                <div className="as-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-green">{activeCrop.area}</span>
                        <span className="badge badge-blue">{activeCrop.variety}</span>
                      </div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#14532d' }}>{activeCrop.name}</h2>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Sown on: <strong>{activeCrop.sowingDate}</strong> • Expected Harvest: <strong>{activeCrop.expectedHarvest}</strong>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteCrop(activeCrop.id)} 
                      className="icon-btn" 
                      title="Remove Crop"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Crop Metrics Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>WATERING SCHEDULE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0284c7', marginTop: '2px' }}>{activeCrop.waterSchedule}</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>EXPECTED YIELD</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#15803d', marginTop: '2px' }}>{activeCrop.expectedYield}</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t.cropHealth || "HEALTH MONITORING"}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: activeCrop.healthLevel === 'yellow' ? '#b45309' : '#15803d', marginTop: '2px' }}>
                        {activeCrop.healthStatus}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Upcoming Tasks Checklist */}
                  <div style={{ marginBottom: '26px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckSquare size={18} color="#16a34a" /> {t.tasksTodo || "Action Checklist & Reminders"}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeCrop.tasks && activeCrop.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(activeCrop.id, task.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: task.done ? '#f0fdf4' : '#f8fafc',
                            border: task.done ? '1px solid #bbf7d0' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {task.done ? <CheckCircle2 size={18} color="#16a34a" /> : <Square size={18} color="var(--text-muted)" />}
                            <span style={{ fontSize: '0.9rem', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-main)' }}>
                              {task.text}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'white', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            Due: {task.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Field Activity Log */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} color="#0284c7" /> {t.recentActivity || "Field Activity & Spray Log"}
                      </h3>
                      <button className="as-btn-outline" onClick={() => setShowActivityModal(true)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        <Plus size={14} /> Add Log
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {activeCrop.activities && activeCrop.activities.map((act, i) => (
                        <div key={i} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="badge badge-blue">{act.type}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{act.note}</span>
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{act.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FULL CROP AGRONOMY DETAIL MODAL */}
      <AnimatePresence>
        {selectedDetailCrop && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="as-card"
              style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-green">{selectedDetailCrop.category}</span>
                    <span className="badge badge-blue">{selectedDetailCrop.season}</span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#14532d', margin: '0 0 4px 0' }}>
                    {selectedDetailCrop.name}
                  </h2>
                  <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    Scientific Name: {selectedDetailCrop.scientificName}
                  </div>
                </div>
                <button onClick={() => setSelectedDetailCrop(null)} className="icon-btn"><X size={20} /></button>
              </div>

              {/* Key Quick Facts Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '22px' }}>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>GROWTH DURATION</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>{selectedDetailCrop.duration}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>AVERAGE YIELD</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#16a34a', marginTop: '2px' }}>{selectedDetailCrop.yield}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>PRICE / MSP BENCHMARK</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ea580c', marginTop: '2px' }}>{selectedDetailCrop.benchmarkPrice}</div>
                </div>
              </div>

              {/* Detailed Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.9rem' }}>
                
                {/* Popular Varieties */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>
                    <Award size={18} color="#16a34a" /> Recommended High-Yield Varieties
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedDetailCrop.popularVarieties.map((v, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', borderRadius: '20px', background: '#f0fdf4', color: '#15803d', fontSize: '0.82rem', fontWeight: '600', border: '1px solid #bbf7d0' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soil & Climate */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#14532d', marginBottom: '6px' }}>
                    <Sun size={18} color="#eab308" /> Soil & Climate Requirements
                  </h4>
                  <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <strong>Soil:</strong> {selectedDetailCrop.soil}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <strong>Climate:</strong> {selectedDetailCrop.climate}
                  </p>
                </div>

                {/* Seed Rate & Sowing */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#14532d', marginBottom: '6px' }}>
                    <Sprout size={18} color="#16a34a" /> Seed Rate, Spacing & Sowing
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedDetailCrop.seedRate}
                  </p>
                </div>

                {/* Fertilizer Schedule */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#14532d', marginBottom: '6px' }}>
                    <Beaker size={18} color="#0284c7" /> Fertilizer & NPK Dosage (Package of Practices)
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedDetailCrop.fertilizer}
                  </p>
                </div>

                {/* Water Management */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#14532d', marginBottom: '6px' }}>
                    <Droplets size={18} color="#0284c7" /> Water & Irrigation Management
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedDetailCrop.irrigation}
                  </p>
                </div>

                {/* Pests & Diseases */}
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#dc2626', marginBottom: '10px' }}>
                    <Bug size={18} color="#dc2626" /> Major Pest & Disease Management
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedDetailCrop.pestsAndDiseases.map((p, idx) => (
                      <div key={idx} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontWeight: '700', color: '#991b1b', marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ fontSize: '0.83rem', color: '#7f1d1d', marginBottom: '4px' }}><strong>Symptoms:</strong> {p.symptom}</div>
                        <div style={{ fontSize: '0.83rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                          <strong>Treatment / Spray:</strong> {p.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harvesting Guidelines */}
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '700', color: '#14532d', marginBottom: '4px' }}>🌾 Harvesting & Post-Harvest Storage</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>{selectedDetailCrop.harvestingTip}</div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="as-btn-outline" onClick={() => setSelectedDetailCrop(null)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="as-btn-primary"
                  onClick={() => handleAddFromLibrary(selectedDetailCrop)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Track This Crop on My Farm</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Crop Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 120,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="as-card"
              style={{ maxWidth: '520px', width: '100%', padding: '30px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532d' }}>{t.modalAddCropTitle || "Register New Crop Field"}</h3>
                <button onClick={() => setShowAddModal(false)} className="icon-btn"><X size={18} /></button>
              </div>

              <form onSubmit={handleAddCropSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.cropNameLabel || "Crop Name"}</label>
                  <input 
                    type="text" 
                    required 
                    className="as-input" 
                    placeholder="e.g. Cotton (Bt Hybrid)"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.cropVarietyLabel || "Variety"}</label>
                    <input 
                      type="text" 
                      className="as-input" 
                      placeholder="e.g. Bollgard II"
                      value={newCrop.variety}
                      onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.areaLabel || "Acreage (Size)"}</label>
                    <input 
                      type="text" 
                      required 
                      className="as-input" 
                      placeholder="e.g. 2.0 Acres"
                      value={newCrop.area}
                      onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.sownDateLabel || "Sowing Date"}</label>
                    <input 
                      type="date" 
                      required 
                      className="as-input" 
                      value={newCrop.sowingDate}
                      onChange={(e) => setNewCrop({...newCrop, sowingDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.irrigationAdvise || "Irrigation Type"}</label>
                    <input 
                      type="text" 
                      className="as-input" 
                      placeholder="e.g. Drip / Furrow"
                      value={newCrop.waterSchedule}
                      onChange={(e) => setNewCrop({...newCrop, waterSchedule: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="as-btn-primary" style={{ marginTop: '8px' }}>
                  {t.saveCropBtn || "Save Crop Field"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Field Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 120,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="as-card"
              style={{ maxWidth: '440px', width: '100%', padding: '26px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Add Field Activity Log</h3>
                <button onClick={() => setShowActivityModal(false)} className="icon-btn"><X size={18} /></button>
              </div>

              <form onSubmit={handleAddActivitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Activity Type</label>
                  <select 
                    className="as-select" 
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                  >
                    <option value="Fertilizer">Fertilizer Application</option>
                    <option value="Pesticide">Pesticide / Fungicide Spray</option>
                    <option value="Irrigation">Irrigation / Watering</option>
                    <option value="Weeding">Weeding / Interculture</option>
                    <option value="Harvesting">Harvesting / Picking</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Date</label>
                  <input 
                    type="date" 
                    required 
                    className="as-input" 
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Activity Notes & Chemical / Dosage</label>
                  <textarea 
                    required 
                    className="as-input" 
                    placeholder="e.g. Sprayed Chlorantraniliprole @ 60ml/acre for stem borer."
                    rows={3}
                    value={newActivity.note}
                    onChange={(e) => setNewActivity({...newActivity, note: e.target.value})}
                  />
                </div>

                <button type="submit" className="as-btn-primary" style={{ marginTop: '6px' }}>
                  Add to Activity Log
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
