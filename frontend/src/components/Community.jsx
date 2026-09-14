import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, ThumbsUp, Share2, Plus, 
  Sparkles, Send, X, CheckCircle2, Bookmark, Filter, MapPin 
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Suresh Reddy",
    village: "Tenali, Guntur",
    time: "2 hours ago",
    crop: "Cotton (Kapas)",
    category: "Pest Remedy",
    title: "Pink bollworm traps worked wonders this Kharif season!",
    content: "Installed 8 pheromone traps per acre at 45 DAS. Noticed initial moth catches early and applied Emamectin Benzoate 5% SG @ 88g/acre on time. Zero boll damage so far. Highly recommend all farmers monitor traps daily!",
    likes: 34,
    hasLiked: false,
    comments: [
      { id: 101, author: "Venkat Rao", text: "Where did you buy the pheromone lures in Guntur?", time: "1 hour ago" },
      { id: 102, author: "Suresh Reddy", text: "Got them at the Rythu Bharosa Kendra (RBK) subsidized center.", time: "45 mins ago" }
    ]
  },
  {
    id: 2,
    author: "Balram Singh",
    village: "Karnal, Haryana",
    time: "5 hours ago",
    crop: "Paddy (Basmati)",
    category: "Pest Remedy",
    title: "How are you managing BPH (hopper burn) with current rains?",
    content: "Continuous cloudy weather in Karnal. I drained the standing water yesterday for 3 days. Anyone tried Triflumezopyrim 10% SC? What dosage per acre works best?",
    likes: 19,
    hasLiked: false,
    comments: [
      { id: 201, author: "Dr. Sandeep (KVK)", text: "Triflumezopyrim 10% SC @ 94 ml/acre in 200 liters water. Direct spray to the base of tillers.", time: "3 hours ago" }
    ]
  },
  {
    id: 3,
    author: "Anil Patel",
    village: "Junagadh, Gujarat",
    time: "1 day ago",
    crop: "Groundnut",
    category: "Mandi Rates",
    title: "Mandi price for dry groundnut touched ₹5,800 in Rajkot today",
    content: "Export quality pods are receiving good premiums. If you have hermetic storage bags, hold your dry pods (<8% moisture); prices are projected to rise towards ₹6,200 next month.",
    likes: 42,
    hasLiked: false,
    comments: [
      { id: 301, author: "Manish Shah", text: "Thanks for the market trend update brother!", time: "12 hours ago" }
    ]
  }
];

export default function Community({ t, language, user }) {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_community_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  // New Post State
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    crop: 'Paddy',
    category: 'Pest Remedy'
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrisathi_community_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  const categories = ["All", "Pest Remedy", "Mandi Rates", "Sowing Tips", "Machinery Rental", "General"];

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
            hasLiked
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const created = {
      id: Date.now(),
      author: user?.name || "Ramesh Kumar",
      village: user?.location || "Vijayawada, Andhra Pradesh",
      time: "Just now",
      crop: newPost.crop,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: 1,
      hasLiked: true,
      comments: []
    };

    setPosts([created, ...posts]);
    setNewPost({ title: '', content: '', crop: 'Paddy', category: 'Pest Remedy' });
    setShowCreateModal(false);
  };

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...(p.comments || []),
              {
                id: Date.now(),
                author: user?.name || "Ramesh Kumar",
                text: commentInput.trim(),
                time: "Just now"
              }
            ]
          };
        }
        return p;
      })
    );

    setCommentInput('');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Visual Farmer Community Showcase Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(30, 58, 138, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #93c5fd'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#bfdbfe' }}>
            <Sparkles size={14} /> Peer-to-Peer Indian Farmer Network
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.communityTitle || "Farmer Community Hub"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#dbeafe', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            {t.communitySubtitle || "Exchange real field experiences, organic pest remedies, local APMC mandi trends, and practical farming tips with fellow cultivators."}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="as-btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#ffffff', fontWeight: '700' }}
            >
              <Plus size={16} /> {t.createPostBtn || "+ Share Experience / Ask"}
            </button>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/community-farmers.jpg" 
            alt="Farmer Community Collaboration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #1e3a8a 0%, rgba(30,58,138,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'as-btn-primary' : 'as-btn-outline'}
            style={{ borderRadius: '20px', padding: '8px 18px', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
          >
            {cat === "All" ? (t.allDiscussions || "All Discussions") : cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredPosts.map((p) => (
          <div key={p.id} className="as-card" style={{ padding: '24px' }}>
            {/* Author Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                  {p.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {p.author} <CheckCircle2 size={14} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {p.village} • {p.time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge badge-green">{p.crop}</span>
                <span className="badge badge-blue">{p.category}</span>
              </div>
            </div>

            {/* Title & Body */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>{p.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '18px' }}>{p.content}</p>

            {/* Action Buttons: Like, Comment, Share */}
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <button 
                onClick={() => handleLike(p.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: p.hasLiked ? '#16a34a' : 'inherit', 
                  fontWeight: '700' 
                }}
              >
                <ThumbsUp size={16} color={p.hasLiked ? '#16a34a' : 'currentColor'} /> {p.likes} {t.upvotes || "Helpful"}
              </button>

              <button 
                onClick={() => setActiveCommentPostId(activeCommentPostId === p.id ? null : p.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#2563eb', 
                  fontWeight: '700' 
                }}
              >
                <MessageSquare size={16} /> {p.comments ? p.comments.length : 0} {t.repliesCount || "Replies"}
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit' }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Comment Thread */}
            {activeCommentPostId === p.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '14px' }}
              >
                {/* Existing comments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  {p.comments && p.comments.map((c) => (
                    <div key={c.id} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                        <strong>{c.author}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{c.text}</div>
                    </div>
                  ))}
                </div>

                {/* Add comment input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="as-input" 
                    placeholder={t.writeReplyPlaceholder || "Write your answer or suggestion..."}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(p.id); }}
                    style={{ borderRadius: '20px', padding: '10px 16px' }}
                  />
                  <button 
                    className="as-btn-primary" 
                    onClick={() => handleAddComment(p.id)}
                    style={{ borderRadius: '20px', padding: '0 18px' }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Create New Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="as-card"
              style={{ maxWidth: '540px', width: '100%', padding: '30px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532d' }}>{t.modalCreatePostTitle || "Ask Kisan Community"}</h3>
                <button onClick={() => setShowCreateModal(false)} className="icon-btn"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.postTitleLabel || "Question / Subject"}</label>
                  <input 
                    type="text" 
                    required 
                    className="as-input" 
                    placeholder="e.g. Effective spray for Chilli leaf curl?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Crop Tag</label>
                    <select 
                      className="as-select"
                      value={newPost.crop}
                      onChange={(e) => setNewPost({...newPost, crop: e.target.value})}
                    >
                      <option value="Paddy">Paddy (Rice)</option>
                      <option value="Cotton">Cotton (Kapas)</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Chillies">Chillies</option>
                      <option value="Groundnut">Groundnut</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Maize">Maize</option>
                      <option value="General">General Farming</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.postCategoryLabel || "Category"}</label>
                    <select 
                      className="as-select"
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    >
                      <option value="Pest Remedy">Pest & Disease Remedy</option>
                      <option value="Mandi Rates">Mandi Rates & Selling</option>
                      <option value="Sowing Tips">Sowing & Varieties</option>
                      <option value="Machinery Rental">Machinery & Custom Hiring</option>
                      <option value="General">General Discussion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{t.postContentLabel || "Describe your problem or tip in detail..."}</label>
                  <textarea 
                    required 
                    className="as-input" 
                    rows={4}
                    placeholder="Describe what you observed, what chemicals you used, or what question you want to ask..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>

                <button type="submit" className="as-btn-primary" style={{ marginTop: '8px' }}>
                  {t.submitPostBtn || "Publish Discussion Post"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
