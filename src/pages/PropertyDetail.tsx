import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bed, Bath, Users, MapPin, Check,
  AlertCircle, ArrowLeft, CalendarDays,
  Mail, Phone
} from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery';
import ContactForm from '../components/ContactForm';
import PageWrapper from '../components/PageWrapper';
import Container from '../components/Container';
import { fetchPropertyBySlug, type Property } from '../lib/supabase';

const CONTACT = {
  name: 'Colin Montaldo',
  email: 'montymfg@gmail.com',
  phone: '+61 427 814 824',
};

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPropertyBySlug(slug)
      .then(data => {
        if (!data) setNotFound(true);
        else setProperty(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper>
        <Container className="py-12 animate-pulse">
          <div className="h-4 bg-cream-300 rounded w-28 mb-8" />
          <div className="h-[480px] bg-cream-300 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-cream-300 rounded w-3/4" />
              <div className="h-4 bg-cream-300 rounded w-1/3" />
              <div className="h-32 bg-cream-300 rounded" />
            </div>
            <div className="h-64 bg-cream-300 rounded-2xl" />
          </div>
        </Container>
      </PageWrapper>
    );
  }

  if (notFound || !property) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-14 h-14 text-cream-400 mb-6" />
        <h1 className="text-2xl font-bold text-ink mb-3">Property not found</h1>
        <p className="text-ink-muted mb-8">We couldn't find a property at that address.</p>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 bg-ink text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-ink-soft transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </button>
      </PageWrapper>
    );
  }

  const images = property.gallery.length > 0 ? property.gallery : [property.featured_image];

  return (
    <PageWrapper>
      <Container className="py-8 lg:py-12">
        {/* Back link */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All properties
        </Link>

        {/* Gallery */}
        <PropertyGallery images={images} propertyName={property.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1.5 text-ink-faint text-xs mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {property.location}
            </div>
            <h1 className="text-ink font-bold text-3xl sm:text-4xl leading-tight tracking-tight mb-2">
              {property.name}
            </h1>
            <p className="text-ink-muted text-sm mb-8 leading-relaxed">{property.short_description}</p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-cream-400/60 mb-8">
              <div className="flex items-center gap-2 text-ink-soft">
                <Bed className="w-4 h-4 text-ink-faint" />
                <span className="font-semibold text-sm">{property.bedrooms}</span>
                <span className="text-ink-muted text-sm">bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-soft">
                <Bath className="w-4 h-4 text-ink-faint" />
                <span className="font-semibold text-sm">{property.bathrooms}</span>
                <span className="text-ink-muted text-sm">bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-soft">
                <Users className="w-4 h-4 text-ink-faint" />
                <span className="font-semibold text-sm">Up to {property.max_guests}</span>
                <span className="text-ink-muted text-sm">guests</span>
              </div>
              <div className="ml-auto flex items-baseline gap-1">
                <span className="text-2xl font-bold text-ink tracking-tight">
                  {property.nightly_rate}
                </span>
                <span className="text-ink-muted text-sm">/ night</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-ink-soft leading-relaxed text-base whitespace-pre-line mb-10">
              {property.description}
            </div>

            {/* Amenities */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-5">
                What's included
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-start gap-3 text-ink-soft text-sm">
                    <Check className="w-4 h-4 text-ink-faint flex-shrink-0 mt-0.5" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability notes */}
            {property.availability_notes && (
              <div className="border border-cream-400 rounded-xl p-5 flex gap-4">
                <CalendarDays className="w-5 h-5 text-ink-faint flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Availability &amp; notes</p>
                  <p className="text-ink-muted text-sm leading-relaxed">{property.availability_notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Direct contact */}
            <div className="border border-cream-400 rounded-2xl p-6">
              <p className="font-semibold text-ink text-sm mb-1">Direct contact</p>
              <p className="text-ink-muted text-sm mb-5">Enquire directly with the host — we reply quickly.</p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-ink">{CONTACT.name}</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  <Mail className="w-4 h-4 text-ink-faint flex-shrink-0" />
                  {CONTACT.email}
                </a>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  <Phone className="w-4 h-4 text-ink-faint flex-shrink-0" />
                  {CONTACT.phone}
                </a>
              </div>
            </div>

            {/* Enquiry form */}
            <div className="border border-cream-400 rounded-2xl p-7">
              <p className="font-bold text-ink text-lg tracking-tight mb-2">Send an enquiry</p>
              <p className="text-ink-muted text-sm mb-6">
                Tell us your dates, group size, and any questions — we'll get back to you the same day.
              </p>
              <ContactForm prefilledProperty={property.name} />
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}
