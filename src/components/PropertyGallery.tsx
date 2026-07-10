import { useState, useEffect, useCallback, useRef } from 'react';
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

function titleCase(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

function groupImages(images: string[]): ImageGroup[] {
  const map = new Map<string, string[]>();
  for (const src of images) {
    const label = titleCase(labelFromPath(src));
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(src);
  }
  return Array.from(map.entries()).map(([label, imgs]) => ({ label, images: imgs }));
}

function heroSlice(images: string[]) {
  return images.slice(0, 5);
}

export default function PropertyGallery({ images, propertyName }: Props) {
  const [open, setOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroup, setActiveGroup] = useState(0);

  const groups = groupImages(images);
  const hero = heroSlice(images);
  const hasMany = images.length > 5;
  const hasGroups = groups.length > 1;

  const tourScrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const globalIndex = (src: string) => images.indexOf(src);

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
    const lock = open || tourOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, tourOpen]);

  // Highlight the room currently in view within the photo tour
  useEffect(() => {
    if (!tourOpen) return;
    const root = tourScrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.groupIndex);
            if (!Number.isNaN(idx)) setActiveGroup(idx);
          }
        });
      },
      { root, rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [tourOpen, images.length]);

  function openAt(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  function scrollToGroup(i: number) {
    setActiveGroup(i);
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      {/* Hero grid */}
      <div className="rounded-2xl overflow-hidden mb-10">
        {hero.length === 1 ? (
          <div className="aspect-[16/7] cursor-pointer" onClick={() => openAt(0)}>
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
            {hero.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className="overflow-hidden cursor-pointer relative group aspect-video sm:aspect-auto hidden sm:block"
                onClick={() => (hasMany && i === 3 ? setTourOpen(true) : openAt(i + 1))}
              >
                <img
                  src={src}
                  alt={`${propertyName} ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  onError={handleImageError}
                />
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
            onClick={() => setTourOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink border border-cream-400 hover:border-ink-faint rounded-lg px-4 py-2 transition-colors bg-cream"
          >
            <Grid2x2 className="w-4 h-4" />
            View all {images.length} photos
          </button>
        </div>
      )}

      {/* Photo tour (Airbnb-style, grouped by room) */}
      {tourOpen && (
        <div className="fixed inset-0 z-40 bg-cream flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 px-5 sm:px-8 py-4 border-b border-cream-400 flex-shrink-0 bg-cream">
            <button
              onClick={() => setTourOpen(false)}
              className="p-2 -ml-2 rounded-lg text-ink-muted hover:text-ink hover:bg-cream-300 transition-colors"
              aria-label="Close photo tour"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <p className="text-ink font-bold text-sm tracking-tight">{propertyName}</p>
              <p className="text-ink-muted text-xs">Photo tour · {images.length} photos</p>
            </div>
          </div>

          {/* Room navigation (thumbnail + label at the top) */}
          {hasGroups && (
            <div className="flex-shrink-0 border-b border-cream-400 bg-cream">
              <div className="flex gap-3 overflow-x-auto px-5 sm:px-8 py-3">
                {groups.map((group, i) => (
                  <button
                    key={group.label}
                    onClick={() => scrollToGroup(i)}
                    className={`flex-shrink-0 w-28 text-left group/nav ${activeGroup === i ? '' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <div className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${activeGroup === i ? 'border-ink' : 'border-transparent'}`}>
                      <img src={group.images[0]} alt="" className="w-full h-full object-cover" onError={handleImageError} />
                    </div>
                    <p className={`mt-1.5 text-xs font-medium leading-tight ${activeGroup === i ? 'text-ink' : 'text-ink-muted'}`}>
                      {group.label}
                    </p>
                    <p className="text-ink-faint text-[11px]">{group.images.length} photo{group.images.length !== 1 ? 's' : ''}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable grouped sections */}
          <div ref={tourScrollRef} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-12 pb-16">
              {groups.map((group, i) => (
                <section
                  key={group.label}
                  data-group-index={i}
                  ref={el => { sectionRefs.current[i] = el; }}
                  className="scroll-mt-6"
                >
                  <h3 className="text-ink font-bold text-xl tracking-tight mb-4">{group.label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.images.map((src, gi) => (
                      <button
                        key={src}
                        onClick={() => openAt(globalIndex(src))}
                        className={`overflow-hidden rounded-xl bg-cream-300 group/img ${gi === 0 ? 'sm:col-span-2' : ''}`}
                      >
                        <img
                          src={src}
                          alt={`${group.label} ${gi + 1}`}
                          className={`w-full object-cover group-hover/img:brightness-95 transition-all ${gi === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox (single image) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/10">
            <div>
              <p className="text-white font-semibold text-sm">{propertyName}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {activeIndex + 1} / {images.length}
                {' · '}
                {titleCase(labelFromPath(images[activeIndex]))}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

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
                return (
                  <div key={group.label}>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      {group.label}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {group.images.map(src => {
                        const flatIdx = globalIndex(src);
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
