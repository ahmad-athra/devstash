'use client';

import React, { useState, useEffect } from 'react';
import { Item, ContentType, Tag } from '@/types/dashboard';
import { MOCK_ITEM_TYPES } from '@/lib/mockData';
import { DynamicIcon } from './DynamicIcon';
import { 
  X, 
  Sparkles, 
  Trash2, 
  Save, 
  Star, 
  Pin, 
  Eye, 
  Edit3, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  UploadCloud, 
  Cpu,
  BookmarkPlus,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { highlightCode } from '@/lib/syntaxHighlighter';

interface ItemDrawerProps {
  isOpen: boolean;
  item: Item | null; // null if creating a new item
  onClose: () => void;
  onSave: (item: Item, onSuccess?: () => void) => void;
  onDelete?: (id: string, onSuccess?: () => void) => void;
  proMode: boolean;
}

export default function ItemDrawer({
  isOpen,
  item,
  onClose,
  onSave,
  onDelete,
  proMode,
}: ItemDrawerProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemTypeKey, setItemTypeKey] = useState<string>('snippet');
  const [contentType, setContentType] = useState<ContentType>('TEXT');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [language, setLanguage] = useState<string>('plaintext');

  // AI Simulations states
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // Sync state with selected item
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setItemTypeKey(item.itemType.name);
      setContentType(item.contentType);
      setContent(item.content || '');
      setUrl(item.url || '');
      setFileName(item.fileName || '');
      setFileSize(item.fileSize);
      setIsFavorite(item.isFavorite);
      setIsPinned(item.isPinned);
      setTags(item.tags);
      setLanguage(item.language || 'plaintext');
      setActiveTab('view');
    } else {
      // Setup default for new item
      setTitle('');
      setDescription('');
      setItemTypeKey('snippet');
      setContentType('TEXT');
      setContent('');
      setUrl('');
      setFileName('');
      setFileSize(undefined);
      setIsFavorite(false);
      setIsPinned(false);
      setTags([]);
      setLanguage('plaintext');
      setActiveTab('edit'); // open directly to edit for new items
    }
    // Clear AI results
    setAiExplanation(null);
    setAiSummary(null);
    setOptimizedPrompt(null);
  }, [item, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Adjust content type automatically based on itemType select
  const handleItemTypeChange = (key: string) => {
    setItemTypeKey(key);
    const selectedType = MOCK_ITEM_TYPES[key];
    if (selectedType) {
      setContentType(selectedType.contentType);
    }
    
    // Auto-select sensible language based on item type
    if (key === 'snippet') {
      setLanguage('typescript');
    } else if (key === 'command') {
      setLanguage('bash');
    } else if (key === 'prompt') {
      setLanguage('markdown');
    } else {
      setLanguage('plaintext');
    }
  };

  const handleSave = () => {
    const selectedType = MOCK_ITEM_TYPES[itemTypeKey] || MOCK_ITEM_TYPES.snippet;
    const updatedData = {
      id: item?.id || `item-${Date.now()}`,
      title,
      description,
      contentType,
      content: contentType === 'TEXT' ? content : undefined,
      url: contentType === 'URL' ? url : undefined,
      fileName: contentType === 'FILE' ? fileName : undefined,
      fileSize: contentType === 'FILE' ? (fileSize || 1024) : undefined,
      language: contentType === 'TEXT' ? language : undefined,
      isFavorite,
      isPinned,
      itemType: selectedType,
      tags,
      collections: item?.collections || [],
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedData, () => {
      onClose();
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.some(t => t.name.toLowerCase() === tagInput.trim().toLowerCase())) {
        setTags([...tags, { id: `tag-${Date.now()}`, name: tagInput.trim().toLowerCase() }]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(t => t.id !== tagId));
  };

  const handleCopy = () => {
    const textToCopy = contentType === 'URL' ? url : content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Mocking Actions
  const runAiExplain = () => {
    if (!proMode) return;
    setAiLoading('explain');
    setAiExplanation(null);
    setTimeout(() => {
      setAiExplanation(
        `### AI Analysis (gpt-5-nano)
1. **Purpose**: Resolves storage state variables in React lifecycle events.
2. **Key Lines**:
   - \`useState\` initializer reads directly from storage on component mount to avoid hydration mismatch.
   - \`useEffect\` updates state automatically on dependency change.
3. **Optimizations**: Added structured error catching block within parser triggers.`
      );
      setAiLoading(null);
    }, 1500);
  };

  const runAiAutoTag = () => {
    if (!proMode) return;
    setAiLoading('autotag');
    setTimeout(() => {
      const suggestions = [
        { id: 'ai-tag-1', name: 'optimization' },
        { id: 'ai-tag-2', name: 'state-management' }
      ];
      setTags((prev) => {
        const unique = [...prev];
        suggestions.forEach(s => {
          if (!unique.some(t => t.name === s.name)) {
            unique.push(s);
          }
        });
        return unique;
      });
      setAiLoading(null);
    }, 1200);
  };

  const runAiSummarize = () => {
    if (!proMode) return;
    setAiLoading('summarize');
    setAiSummary(null);
    setTimeout(() => {
      setAiSummary(
        `This component acts as a local state synchronization bridge, capturing browser localstorage write/reads to keep React variables updated across renders.`
      );
      setAiLoading(null);
    }, 1300);
  };

  const runPromptOptimizer = () => {
    if (!proMode) return;
    setAiLoading('optimize');
    setOptimizedPrompt(null);
    setTimeout(() => {
      setOptimizedPrompt(
        `Act as an expert React & Next.js architect. Analyze the provided custom state hooks, inspect performance constraints, and suggest code modifications with TypeScript structures.`
      );
      setAiLoading(null);
    }, 1600);
  };

  if (!isOpen) return null;

  const currentTypeConfig = MOCK_ITEM_TYPES[itemTypeKey] || MOCK_ITEM_TYPES.snippet;
  const currentThemeColor = currentTypeConfig.color;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-[#0f0f12] border-l border-zinc-800 shadow-2xl flex flex-col justify-between h-full transform transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/20">
          <div className="flex items-center gap-3">
            <span 
              className="p-1.5 rounded-lg flex items-center justify-center shrink-0"
              style={{ color: currentThemeColor, backgroundColor: `${currentThemeColor}12` }}
            >
              <DynamicIcon name={currentTypeConfig.icon} className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono opacity-60" style={{ color: currentThemeColor }}>
                {currentTypeConfig.name}
              </span>
              <h2 className="text-sm font-semibold text-zinc-200 truncate max-w-[280px]">
                {title || (item ? 'Editing Stash' : 'New DevStash Item')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick favorites toggling in header */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg hover:bg-zinc-900 transition-colors ${
                isFavorite ? 'text-yellow-500' : 'text-zinc-500'
              }`}
            >
              <Star className={`h-4.5 w-4.5 ${isFavorite ? 'fill-yellow-500/20' : ''}`} />
            </button>
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg hover:bg-zinc-900 transition-colors ${
                isPinned ? 'text-blue-500' : 'text-zinc-500'
              }`}
            >
              <Pin className={`h-4.5 w-4.5 ${isPinned ? 'fill-blue-500/20' : ''}`} />
            </button>
            <div className="w-px h-5 bg-zinc-800 mx-1" />
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 p-2 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs (View vs Edit) */}
        {item && (
          <div className="px-5 py-2.5 border-b border-zinc-800/40 bg-zinc-950/10 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'view'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'edit'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        )}

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* VIEW MODE CONTAINER */}
          {activeTab === 'view' && item && (
            <div className="space-y-6">
              {/* Info block */}
              {description && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</span>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/20 p-3 rounded-xl border border-zinc-800/40">
                    {description}
                  </p>
                </div>
              )}

              {/* Dynamic Content block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Content</span>
                    {contentType === 'TEXT' && language && language !== 'plaintext' && (
                      <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800/80 rounded px-1.5 py-0.5 text-zinc-400 uppercase tracking-wider font-semibold">
                        {language}
                      </span>
                    )}
                  </div>
                  {(contentType === 'TEXT' || contentType === 'URL') && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {contentType === 'TEXT' && (
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 font-mono text-xs overflow-x-auto text-zinc-200 leading-relaxed shadow-inner max-h-[300px]">
                    <pre className="whitespace-pre"><code dangerouslySetInnerHTML={{ __html: highlightCode(content, language) }} /></pre>
                  </div>
                )}

                {contentType === 'URL' && (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-950/15 transition-all text-xs font-mono group"
                  >
                    <span className="underline truncate flex-1 mr-4">{url}</span>
                    <DynamicIcon name="ExternalLink" className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}

                {contentType === 'FILE' && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-400">
                        <DynamicIcon name={currentTypeConfig.name === 'image' ? 'Image' : 'File'} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200 truncate max-w-[200px]">{fileName}</p>
                        <p className="text-xs text-zinc-500">
                          {fileSize ? `${(fileSize / 1024).toFixed(1)} KB` : 'File Asset'}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors">
                      Download
                    </button>
                  </div>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => (
                      <span key={t.id} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400 font-mono text-xs">
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* PRO AI ACTIONS SECTION */}
              <div className="space-y-3 pt-6 border-t border-zinc-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-purple-400" />
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">AI Operations Center</span>
                  </div>
                  {!proMode && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider bg-purple-500/10 text-purple-300 border border-purple-800/30">
                      PRO ONLY
                    </span>
                  )}
                </div>

                {/* AI control bar buttons grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={runAiExplain}
                    disabled={!proMode || aiLoading !== null}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all select-none ${
                      proMode 
                        ? 'bg-purple-950/15 border-purple-900/60 hover:bg-purple-950/30 text-purple-300 hover:border-purple-800 active:scale-[0.98]' 
                        : 'bg-zinc-900 border-zinc-800/60 text-zinc-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {aiLoading === 'explain' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Cpu className="h-3.5 w-3.5" />}
                    <span>Explain Code</span>
                  </button>

                  <button
                    onClick={runAiAutoTag}
                    disabled={!proMode || aiLoading !== null}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all select-none ${
                      proMode 
                        ? 'bg-purple-950/15 border-purple-900/60 hover:bg-purple-950/30 text-purple-300 hover:border-purple-800 active:scale-[0.98]' 
                        : 'bg-zinc-900 border-zinc-800/60 text-zinc-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {aiLoading === 'autotag' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
                    <span>Suggest Tags</span>
                  </button>

                  <button
                    onClick={runAiSummarize}
                    disabled={!proMode || aiLoading !== null}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all select-none ${
                      proMode 
                        ? 'bg-purple-950/15 border-purple-900/60 hover:bg-purple-950/30 text-purple-300 hover:border-purple-800 active:scale-[0.98]' 
                        : 'bg-zinc-900 border-zinc-800/60 text-zinc-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {aiLoading === 'summarize' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <DynamicIcon name="Sparkles" className="h-3.5 w-3.5" />}
                    <span>AI Summary</span>
                  </button>

                  <button
                    onClick={runPromptOptimizer}
                    disabled={!proMode || aiLoading !== null}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all select-none ${
                      proMode 
                        ? 'bg-purple-950/15 border-purple-900/60 hover:bg-purple-950/30 text-purple-300 hover:border-purple-800 active:scale-[0.98]' 
                        : 'bg-zinc-900 border-zinc-800/60 text-zinc-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {aiLoading === 'optimize' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <DynamicIcon name="Sparkles" className="h-3.5 w-3.5" />}
                    <span>Optimize Prompt</span>
                  </button>
                </div>

                {/* Simulated AI Output Blocks */}
                {aiExplanation && (
                  <div className="bg-purple-950/10 border border-purple-900/40 p-4 rounded-xl text-xs text-purple-200 leading-relaxed font-mono mt-2 shadow-inner">
                    <div className="whitespace-pre-wrap">{aiExplanation}</div>
                  </div>
                )}

                {aiSummary && (
                  <div className="bg-purple-950/10 border border-purple-900/40 p-4 rounded-xl text-xs text-purple-200 leading-relaxed mt-2 shadow-inner">
                    <p className="font-semibold mb-1 text-purple-300">💡 Summary:</p>
                    <p>{aiSummary}</p>
                  </div>
                )}

                {optimizedPrompt && (
                  <div className="bg-purple-950/10 border border-purple-900/40 p-4 rounded-xl text-xs text-purple-200 leading-relaxed font-mono mt-2 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-300">✨ Optimized Prompt:</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(optimizedPrompt)}
                        className="text-[10px] bg-purple-950/40 px-2 py-0.5 rounded text-purple-300 border border-purple-900/30 hover:bg-purple-950"
                      >
                        Copy
                      </button>
                    </div>
                    <p>{optimizedPrompt}</p>
                  </div>
                )}

                {!proMode && (
                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center justify-center text-center">
                    <span className="text-[11px] text-zinc-500">
                      Toggle **DevStash Pro** in the sidebar to simulate AI code explanations and workflows.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDIT & CREATE MODE CONTAINER */}
          {(activeTab === 'edit' || !item) && (
            <div className="space-y-5">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Item Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(MOCK_ITEM_TYPES).map((key) => {
                    const typeConfig = MOCK_ITEM_TYPES[key];
                    const isSelected = itemTypeKey === key;
                    const isTypePro = typeConfig.proOnly;
                    
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleItemTypeChange(key)}
                        disabled={isTypePro && !proMode}
                        className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-[11px] transition-all capitalize relative ${
                          isSelected
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
                        } ${isTypePro && !proMode ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ 
                          borderColor: isSelected ? typeConfig.color : undefined,
                        }}
                      >
                        <span style={{ color: typeConfig.color }}>
                          <DynamicIcon name={typeConfig.icon} className="h-4 w-4" />
                        </span>
                        <span>{typeConfig.name}</span>
                        {isTypePro && (
                          <span className={`absolute top-1 right-1 text-[7px] px-1 py-0.2 rounded font-mono ${proMode ? 'bg-purple-950/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            {proMode ? 'PRO' : '🔒'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js Auth Middleware Setup"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 px-3.5 py-2 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short note explaining what this stash is about..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 px-3.5 py-2 rounded-xl text-sm focus:outline-hidden resize-none"
                />
              </div>

              {/* Language Selector (Snippets Only) */}
              {itemTypeKey === 'snippet' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 pl-3.5 pr-10 py-2.5 rounded-xl text-sm focus:outline-hidden cursor-pointer appearance-none"
                    >
                      <option value="plaintext">Plain Text</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                      <option value="bash">Bash / Shell</option>
                      <option value="json">JSON</option>
                      <option value="markdown">Markdown</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Type-based Inputs */}
              {contentType === 'TEXT' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Content Editor (Markdown / Code)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste code blocks, prompts instructions, notes..."
                    rows={8}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 px-3.5 py-3.5 rounded-xl text-xs font-mono focus:outline-hidden"
                  />
                </div>
              )}

              {contentType === 'URL' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">URL Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/docs"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {contentType === 'FILE' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">File Attachment</label>
                  
                  {fileName ? (
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
                      <div className="flex items-center gap-2 truncate">
                        <DynamicIcon name={currentTypeConfig.name === 'image' ? 'Image' : 'File'} className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span className="text-xs text-zinc-200 truncate">{fileName}</span>
                      </div>
                      <button 
                        onClick={() => { setFileName(''); setFileSize(undefined); }}
                        className="text-xs text-red-500 hover:text-red-400 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-zinc-800/80 hover:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-900/10 transition-colors">
                      <UploadCloud className="h-8 w-8 text-zinc-500 mb-2" />
                      <p className="text-xs font-semibold text-zinc-300">Drag & drop your file here, or click to upload</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Uploads up to 20MB are supported for Cloudflare R2</p>
                      <input 
                        type="file" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFileName(file.name);
                            setFileSize(file.size);
                          }
                        }}
                        className="hidden" 
                        id="drawer-file-upload"
                      />
                      <label htmlFor="drawer-file-upload" className="mt-3 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg cursor-pointer">
                        Select File
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Tags input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tags (Press Enter to add)</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                  {tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-xs border border-zinc-700/30"
                    >
                      <span>#{tag.name}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="hover:text-red-400 text-zinc-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 min-w-[80px] bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-hidden border-none p-0.5"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between">
          <div>
            {item && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(item.id, () => {
                    onClose();
                  });
                }}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete Item</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
