import { Link } from 'react-router-dom';
import { Bed, Bath, Users } from 'lucide-react';
import type { Property } from '../lib/supabase';
import { handleImageError } from '../lib/images';

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] bg-ink"
    >
      {/* Photo */}
      <img
        src={property.featured_image}
        alt={property.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
        onError={handleImageError}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Type pill */}
      <div className="absolute top-4 right-4">
        <span className="bg-white text-ink text-xs font-semibold px-3.5 py-1.5 rounded-full">
          {property.property_type}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-6">
        <h3 className="text-white font-bold text-card-title leading-tight mb-1.5 tracking-tight">
          {property.name}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
          {property.short_description}
        </p>

        <div className="border-t border-white/20 pt-4 flex items-center gap-2.5 flex-wrap">
          <StatPill icon={<Bed className="w-3.5 h-3.5" />} value={String(property.bedrooms)} />
          <StatPill icon={<Bath className="w-3.5 h-3.5" />} value={String(property.bathrooms)} />
          <StatPill icon={<Users className="w-3.5 h-3.5" />} value={`${property.max_guests}`} />
        </div>
      </div>
    </Link>
  );
}

function StatPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
      {icon}
      {value}
    </span>
  );
}
