import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Grid2x2, LayoutGrid } from 'lucide-react';
import { handleImageError } from '../lib/images';

interface Props {
  images: string[];
  propertyName: string;
}

interface ImageGroup {
  label: string;
  images: string[];
}

function labelFromPath(src: string): string {
  const filename = src.split('/').pop() ?? '';
  const base = filename.replace(/\.[^.]+$/, '');
  const parts = base.split('-');
  const nameParts = parts[parts.length - 1].match(/^\d+$/) ? parts.slice(0, -1) : parts;
  return nameParts.join(' ').replace(/_/g, ' ');
}

function groupImages(images: string[]): ImageGroup[] {
  const map = new Map<string, string[]>();
  for (const src of images) {
    const label = labelFromPath(src);
    const normalised = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    if (!map.has(normalised)) map.set(normalised, []);
    map.get(normalised)!.push(src);
  }
  return Array.from(map.entries()).map(([label, imgs]) => ({ label, images: imgs }));
}

function heroSlice(images: string[]) {
  return images.slice(0, 5);
}

export default function PropertyGallery({ images, propertyName }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = groupImages(images);
  const hero = heroSlice(images);
  const hasMany = images.length > 5;

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function openAt(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  const flatGroupImages = groups.flatMap(g => g.images);

  return (
    <>
      {/* Hero grid */}
      <div className="rounded-2xl overflow-hidden mb-10">
        {hero.length === 1 ? (
          <div
            className="aspect-[16/7] cursor-pointer"
            onClick={() => openAt(0)}
          >
            <img
              src={hero[0]}
              alt={propertyName}
              className="w-full h-full object-cover hover:brightness-95 transition-all"
              onError={handleImageError}
            />
          </div>
        ) : hero.length === 2 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 aspect-auto sm:aspect-[16/7]">
            {hero.map((src, i) => (
              <div key={i} className="overflow-hidden cursor-pointer aspect-video sm:aspect-auto" onClick={() => openAt(i)}>
                <img src={src} alt={`${propertyName} ${i + 1}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" onError={handleImageError} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-1 lg:h-[360px] xl:h-[480px]">
            {/* Main large image */}
            <div
              className="sm:col-span-2 lg:row-span-2 overflow-hidden cursor-pointer relative group aspect-video sm:aspect-auto"
              onClick={() => openAt(0)}
            >
              <img
                src={hero[0]}
                alt={`${propertyName} main`}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                onError={handleImageError}
              />
            </div>
            {/* Secondary grid */}
            {hero.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className="overflow-hidden cursor-pointer relative group aspect-video sm:aspect-auto hidden sm:block"
                onClick={() => openAt(i + 1)}
              >
                <img
                  src={src}
                  alt={`${propertyName} ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  onError={handleImageError}
                />
                {/* "Show all" overlay on last visible */}
                {hasMany && i === 3 && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      +{images.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show all button */}
      {images.length > 1 && (
        <div className="flex justify-end mb-8 -mt-6">
          <button
            onClick={() => openAt(0)}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink border border-cream-400 hover:border-ink-faint rounded-lg px-4 py-2 transition-colors bg-cream"
          >
            <Grid2x2 className="w-4 h-4" />
            View all {images.length} photos
          </button>
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/10">
            <div>
              <p className="text-white font-semibold text-sm">{propertyName}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {activeIndex + 1} / {images.length}
                {' · '}
                {labelFromPath(images[activeIndex]).charAt(0).toUpperCase() + labelFromPath(images[activeIndex]).slice(1).replace(/_/g, ' ')}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main viewer */}
          <div className="flex-1 flex items-center justify-center relative px-4 min-h-0 py-4">
            <button
              onClick={prev}
              className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${propertyName} ${activeIndex + 1}`}
              className="max-w-full max-h-[calc(100dvh-14rem)] object-contain rounded-lg select-none"
              onError={handleImageError}
            />

            <button
              onClick={next}
              className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Grouped thumbnail strip */}
          <div className="flex-shrink-0 border-t border-white/10 overflow-y-auto max-h-48 pb-4">
            <div className="px-6 pt-4 space-y-4">
              {groups.map(group => {
                const groupStart = flatGroupImages.indexOf(group.images[0]);
                return (
                  <div key={group.label}>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      {group.label}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {group.images.map((src, gi) => {
                        const flatIdx = groupStart + gi;
                        return (
                          <button
                            key={src}
                            onClick={() => setActiveIndex(flatIdx)}
                            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                              flatIdx === activeIndex
                                ? 'border-white opacity-100'
                                : 'border-transparent opacity-50 hover:opacity-80'
                            }`}
                          >
                            <img src={src} alt="" className="w-full h-full object-cover" onError={handleImageError} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
