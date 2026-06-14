import React, { useState } from 'react';
import { PastSpoiler } from '../types';
import { Trash2, Calendar, Eye, EyeOff, Flame, Edit } from 'lucide-react';

interface PastSpoilersSectionProps {
  spoilers: PastSpoiler[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onEdit?: (spoil: PastSpoiler) => void;
}

// Custom parser to split paragraphs, lists, headers, and media links in order
function renderRichContent(text: string) {
  if (!text) return null;

  // Split content into segments of media (images or base64) and text blocks
  const mediaRegex = /(!\[.*?\]\([^\)]+\)|<img\s+[^>]*src=["'](?:[^"']+)["'][^>]*>|(?:https?:\/\/[^\s]+?(?:\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp)(?:\?[^\s]*)?))/gi;
  const parts = text.split(mediaRegex);

  return (
    <div className="space-y-2 text-left mt-2 text-gray-300">
      {parts.map((part, partIdx) => {
        if (!part) return null;

        // Check for Markdown Image syntax: ![Alt](url)
        const mdMatched = part.match(/!\[(.*?)\]\((.*?)\)/i);
        if (mdMatched) {
          const altText = mdMatched[1] || 'Imagem do Spoiler';
          const imageUrl = mdMatched[2];
          return (
            <div key={`part-${partIdx}`} className="my-3 rounded-xl overflow-hidden border border-white/5 shadow bg-black/40 p-1.5 text-center">
              <img 
                src={imageUrl} 
                alt={altText} 
                className="w-full max-h-52 object-contain hover:scale-[1.02] transition-transform duration-300 mx-auto rounded-lg" 
                referrerPolicy="no-referrer"
              />
              {altText && altText !== 'Spoiler' && (
                <span className="text-[9px] text-gray-500 block pt-1 font-mono uppercase tracking-wider">
                  ✦ {altText}
                </span>
              )}
            </div>
          );
        }

        // Check for HTML img tag syntax
        const htmlMatched = part.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);
        if (htmlMatched) {
          const imageUrl = htmlMatched[1];
          return (
            <div key={`part-${partIdx}`} className="my-3 rounded-xl overflow-hidden border border-white/5 shadow bg-black/40 p-1.5">
              <img 
                src={imageUrl} 
                alt="Spoiler Media" 
                className="w-full max-h-52 object-contain hover:scale-[1.02] transition-transform duration-300 mx-auto rounded-lg" 
                referrerPolicy="no-referrer"
              />
            </div>
          );
        }

        // Check for raw image URL match
        if (part.match(/^https?:\/\/[^\s]+?(?:\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp)(?:\?[^\s]*)?$/i)) {
          return (
            <div key={`part-${partIdx}`} className="my-3 rounded-xl overflow-hidden border border-white/5 shadow bg-black/40 p-1.5">
              <img src={part} alt="Raw URL Web Image" className="w-full max-h-52 object-contain hover:scale-[1.02] transition-transform duration-300 mx-auto rounded-lg" referrerPolicy="no-referrer" />
            </div>
          );
        }

        // Otherwise, it's a plain text run
        const lines = part.split('\n');
        return (
          <div key={`part-${partIdx}`} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} className="h-1" />;

              // Bullet lists
              if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                const content = trimmed.substring(1).trim();
                return (
                  <div key={lineIdx} className="flex items-start gap-1.5 text-xs text-gray-300 pl-1">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">✧</span>
                    <span>{content}</span>
                  </div>
                );
              }

              // Headers
              if (trimmed.startsWith('###')) {
                return <h5 key={lineIdx} className="font-sans font-extrabold text-xs text-cyan-400 uppercase tracking-wider pt-1">{trimmed.replace('###', '').trim()}</h5>;
              }
              if (trimmed.startsWith('##')) {
                return <h4 key={lineIdx} className="font-sans font-black text-sm text-yellow-300 uppercase tracking-widest pt-1">{trimmed.replace('##', '').trim()}</h4>;
              }

              return (
                <p key={lineIdx} className="font-sans text-xs text-gray-400 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function PastSpoilersSection({ spoilers, isAdmin, onDelete, onEdit }: PastSpoilersSectionProps) {
  // Track expanded cards
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isEmpty = !spoilers || spoilers.length === 0;

  return (
    <section 
      id="past-spoilers-history-section"
      className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden text-left"
    >
      {/* Decorative neon gradient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/25">
            <Flame className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-black text-lg sm:text-xl text-white uppercase tracking-wider">
              🔮 SPOILERS ANTERIORES
            </h3>
            <p className="font-sans text-xs text-gray-400">
              Explore o baú de segredos e novidades passadas já publicadas!
            </p>
          </div>
        </div>
        <span className="text-[10px] sm:text-xs font-mono font-bold px-3 py-1 bg-zinc-900 border border-zinc-800 text-pink-400 rounded-full flex-shrink-0 self-start sm:self-center">
          {isEmpty ? 0 : spoilers.length} Registros Gravados
        </span>
      </div>

      {isEmpty ? (
        <div className="relative z-10 text-center py-10 px-4 bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 text-gray-400 font-sans space-y-3">
          <p className="text-sm font-semibold text-gray-300">
            Nenhum spoiler arquivado ainda 🔮
          </p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Abra o Modo Admin e publique um spoiler! Ao salvar, ele será liberado instantaneamente e guardado no arquivo de spoilers antigos.
          </p>
        </div>
      ) : (
        /* Grid of Past Spoilers */
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {spoilers.map((spoil) => {
          const isExpanded = !!expandedIds[spoil.id];
          const formattedDate = new Date(spoil.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div 
              key={spoil.id}
              className="flex flex-col bg-zinc-90 w-full bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-md group relative"
            >
              {/* Optional Cover image / GIF */}
              {spoil.imageUrl && (
                <div className="h-40 w-full overflow-hidden border-b border-zinc-800 relative bg-black/40">
                  <img 
                    src={spoil.imageUrl} 
                    alt={spoil.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400"; }}
                  />
                  <div className="absolute top-2 left-2 bg-pink-500 text-white font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded-md shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    MÍDIA COMPLETA / GIF
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Title & Metadata */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2">
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {onEdit && (
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(spoil);
                            }}
                            className="text-yellow-400 hover:text-yellow-350 p-1.5 bg-yellow-950/25 hover:bg-yellow-950/60 border border-yellow-500/20 hover:border-yellow-400/40 rounded-lg transition-colors cursor-pointer"
                            title="Editar Spoiler do Histórico"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Deseja mesmo remover permanentemente este spoiler do histórico?")) {
                              onDelete(spoil.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-1.5 bg-red-950/25 hover:bg-red-950/60 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors cursor-pointer"
                          title="Deletar Spoiler do Histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="font-sans font-extrabold text-sm sm:text-base text-yellow-400 leading-tight group-hover:text-yellow-300 transition-colors">
                    {spoil.title}
                  </h4>

                  {/* Body Details (Conditional expander to safe guard page space) */}
                  <div>
                    {isExpanded ? (
                      renderRichContent(spoil.description)
                    ) : (
                      <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {spoil.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expansion button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(spoil.id)}
                  className="w-full mt-2 py-1.5 rounded-xl border border-white/5 hover:border-white/10 bg-zinc-950/40 hover:bg-zinc-950/80 text-[11px] font-bold text-gray-300 hover:text-white uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-pink-400" />
                      <span>Ver Menos</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ver Detalhes, Imagens e Gifs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </section>
  );
}
