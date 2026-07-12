
-- Prices are Australian dollars for all properties. Store nightly_rate as text so it can
-- hold a formatted value (e.g. '$350') or a placeholder (e.g. '$$$') until a rate is set.
ALTER TABLE properties ALTER COLUMN nightly_rate TYPE text USING nightly_rate::text;

-- Add (or refresh) the Eymet listing. Upsert on slug so this is safe to re-run.
INSERT INTO properties (name, slug, location, region, description, short_description, max_guests, bedrooms, bathrooms, nightly_rate, property_type, amenities, featured_image, gallery, availability_notes) VALUES
(
  'Eymet',
  'eymet',
  'Eymet, Dordogne, France',
  'Dordogne',
  'Park the bikes in the secure garage, sink into the spa, and settle in for the evening — this big, eclectic village house is built for groups who ride together and like to eat, drink and swap stories afterwards. You are on the main boulevard of a beautiful, English-friendly bastide, a three-minute stroll from the central square, with an Australian greeter on hand to help you find your feet.

The house has a story. We have transformed what was once the village nightclub into a relaxed, characterful home — eclectic, full of foibles, and all the more fun for it. The original main building is over 400 years old, and the kitchen, dining and living areas flow out to a terrace and courtyard, cooled by a big ceiling fan. It is a brilliant space for summer: long lunches, easy evenings, everyone together. Downstairs in the original building there is a separate restaurant under its own management — handy when you do not feel like cooking.

Sleeping is in three double bedrooms on the upper floor: a master suite with its own dressing room and ensuite, and two further guest bedrooms. All rooms have ceiling fans, with reverse-cycle air conditioning in the master suite and guest bedroom 1. The spacious living and bar area — fridge, streaming TV — opens onto the deck, and a 7-person outdoor spa, BBQ and alfresco dining set the scene for long group evenings.

Eymet is a classic Dordogne bastide that comes alive in summer, with a weekly night market and no shortage of restaurants, bars and entertainment, all a few minutes'' walk away. The riding is superb in every direction: charming villages, châteaux, farms, and of course the wine. It is an easy, scenic base for day loops through some of France''s prettiest country.

Riders are well looked after: a secure garage for the bikes, plus a Moto Guzzi Norge and two e-bikes available to rent if you want to add a machine to the trip.',
  'A characterful 400-year-old bastide house in the heart of Eymet — built for riding groups, with a secure garage, outdoor spa and a three-minute walk to the village square.',
  6,
  3,
  3,
  '$$$',
  'Rooms / House',
  ARRAY['3 double bedrooms', 'Master suite with dressing room & ensuite', 'Two further guest bedrooms', 'Reverse-cycle air conditioning (master & guest 1)', 'Ceiling fans throughout', '7-person outdoor spa', 'BBQ & outdoor dining', 'Living & bar area with streaming TV', 'Full kitchen (dishwasher, coffee machine, microwave)', 'Laundry', 'Secure garage for bikes', 'Moto Guzzi Norge & 2 e-bikes for hire', '3-minute walk to the village square', 'English-speaking village', 'Australian greeter'],
  '/images/featured/eymet-living-5.jpg',
  ARRAY[
    '/images/properties/eymet/courtyard-1.jpg',
    '/images/properties/eymet/living-1.jpg',
    '/images/properties/eymet/kitchen-1.jpg',
    '/images/properties/eymet/dining-1.jpg',
    '/images/properties/eymet/master-suite-1.jpg',
    '/images/properties/eymet/courtyard-2.jpg',
    '/images/properties/eymet/courtyard-3.jpg',
    '/images/properties/eymet/courtyard-4.jpg',
    '/images/properties/eymet/living-2.jpg',
    '/images/properties/eymet/living-3.jpg',
    '/images/properties/eymet/living-4.jpg',
    '/images/properties/eymet/living-5.jpg',
    '/images/properties/eymet/kitchen-2.jpg',
    '/images/properties/eymet/kitchen-3.jpg',
    '/images/properties/eymet/dining-2.jpg',
    '/images/properties/eymet/dining-3.jpg',
    '/images/properties/eymet/terrace-1.jpg',
    '/images/properties/eymet/terrace-2.jpg',
    '/images/properties/eymet/master-suite-2.jpg',
    '/images/properties/eymet/master-suite-3.jpg',
    '/images/properties/eymet/master-suite-4.jpg',
    '/images/properties/eymet/master-suite-5.jpg',
    '/images/properties/eymet/master-suite-6.jpg',
    '/images/properties/eymet/master-suite-7.jpg',
    '/images/properties/eymet/master-suite-8.jpg',
    '/images/properties/eymet/guest-bedroom-1-1.jpg',
    '/images/properties/eymet/guest-bedroom-1-2.jpg',
    '/images/properties/eymet/guest-bedroom-1-3.jpg',
    '/images/properties/eymet/guest-bedroom-1-4.jpg',
    '/images/properties/eymet/guest-bedroom-2-1.jpg',
    '/images/properties/eymet/guest-bedroom-2-2.jpg',
    '/images/properties/eymet/guest-bedroom-2-3.jpg',
    '/images/properties/eymet/guest-bedroom-2-4.jpg',
    '/images/properties/eymet/bathroom-1.jpg',
    '/images/properties/eymet/bathroom-2.jpg',
    '/images/properties/eymet/bathroom-3.jpg',
    '/images/properties/eymet/exterior-1.jpg',
    '/images/properties/eymet/exterior-2.jpg',
    '/images/properties/eymet/garage-1.jpg',
    '/images/properties/eymet/garage-2.jpg',
    '/images/properties/eymet/eymet-and-surrounds-1.jpg',
    '/images/properties/eymet/eymet-and-surrounds-2.jpg',
    '/images/properties/eymet/eymet-and-surrounds-3.jpg',
    '/images/properties/eymet/eymet-and-surrounds-4.jpg',
    '/images/properties/eymet/eymet-and-surrounds-5.jpg',
    '/images/properties/eymet/eymet-and-surrounds-6.jpg'
  ],
  'Available as the whole house or by the room. Good to know: the three bedrooms are upstairs on the boulevard side — a working route where trucks and farm machinery pass at all hours, and they can be noisy. With the shutters and windows closed the rooms are comfortable and quiet; light sleepers may want to pack earplugs. A separate restaurant operates downstairs in the original building.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  region = EXCLUDED.region,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  max_guests = EXCLUDED.max_guests,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  nightly_rate = EXCLUDED.nightly_rate,
  property_type = EXCLUDED.property_type,
  amenities = EXCLUDED.amenities,
  featured_image = EXCLUDED.featured_image,
  gallery = EXCLUDED.gallery,
  availability_notes = EXCLUDED.availability_notes;
