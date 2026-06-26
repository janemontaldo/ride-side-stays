export const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800';

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const t = e.currentTarget;
  if (!t.dataset.fallback) {
    t.dataset.fallback = '1';
    t.src = FALLBACK_IMAGE;
  }
}
