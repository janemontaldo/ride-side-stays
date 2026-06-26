
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text NOT NULL,
  region text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  max_guests integer NOT NULL DEFAULT 2,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  nightly_rate integer NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  featured_image text NOT NULL,
  gallery text[] NOT NULL DEFAULT '{}',
  availability_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_properties" ON properties FOR SELECT TO anon USING (true);
CREATE POLICY "insert_properties" ON properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_properties" ON properties FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_properties" ON properties FOR DELETE TO authenticated USING (true);

CREATE TABLE enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  property_interest text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_enquiries" ON enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "select_enquiries" ON enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "update_enquiries" ON enquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_enquiries" ON enquiries FOR DELETE TO authenticated USING (true);

INSERT INTO properties (name, slug, location, region, description, short_description, max_guests, bedrooms, bathrooms, nightly_rate, amenities, featured_image, gallery, availability_notes) VALUES
(
  'The Dune House',
  'the-dune-house',
  'Perranporth, Cornwall',
  'Cornwall',
  'Perched behind the sand dunes of Perranporth''s legendary three-mile beach, The Dune House is a beautifully restored Cornish cottage with whitewashed walls, slate floors and uninterrupted sea views from every window. Step outside your front door and within seconds your feet are in the sand. Inside, the open-plan kitchen and living space is warm and sociable, complete with a wood-burning stove for cool evenings. The master bedroom occupies the top floor with a wrap-around balcony perfect for watching spectacular Atlantic sunsets. Ideal for couples or small families looking for an authentic Cornish escape.',
  'Whitewashed beachfront cottage with direct dune access and breathtaking Atlantic views.',
  6,
  3,
  2,
  185,
  ARRAY['Beach access', 'Sea views', 'Wood-burning stove', 'Fully equipped kitchen', 'Private garden', 'Free parking', 'WiFi', 'BBQ', 'Dog friendly', 'Balcony'],
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Available most of the year. Minimum 3-night stay in peak season.'
),
(
  'Tidal Retreat',
  'tidal-retreat',
  'St Ives, Cornwall',
  'Cornwall',
  'Tucked into the cobbled streets of St Ives'' bohemian Downlong district, Tidal Retreat is a lovingly converted fisherman''s cottage that blends original character with contemporary comfort. Exposed stone walls, hand-laid reclaimed oak floors and bespoke oak joinery sit alongside a designer kitchen, roll-top bath and handcrafted king bed. The sun-filled courtyard garden is a suntrap from morning until dusk. Stroll minutes to the internationally acclaimed Tate St Ives, the golden arc of Porthminster Beach, and the town''s outstanding restaurants and galleries.',
  'Characterful fisherman''s cottage in the heart of St Ives, steps from Porthminster Beach.',
  4,
  2,
  1,
  210,
  ARRAY['Courtyard garden', 'Roll-top bath', 'Designer kitchen', 'WiFi', 'Smart TV', 'Dog friendly', 'Bike storage', 'Central location', 'Sea views from master'],
  'https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Highly sought after. Book early to avoid disappointment.'
),
(
  'Clifftop Lodge',
  'clifftop-lodge',
  'Kynance Cove, The Lizard',
  'Cornwall',
  'Clifftop Lodge commands one of the most dramatic positions on the entire Cornish coastline, sitting directly above the crystal-clear turquoise waters of Kynance Cove — a location so naturally beautiful it has appeared in countless films and postcards. This architect-designed lodge brings floor-to-ceiling glazing and a generous wraparound deck right to the cliff edge, putting the full panorama of the Atlantic on display from your sofa, your bed and your breakfast table. The interior is refined and calm, with natural linen, locally crafted furniture and a signature stone fireplace. An extraordinary retreat for those who want nature at its most awe-inspiring.',
  'Architect-designed lodge perched dramatically above the turquoise waters of Kynance Cove.',
  2,
  1,
  1,
  250,
  ARRAY['Panoramic sea views', 'Wraparound deck', 'Floor-to-ceiling glazing', 'Stone fireplace', 'Luxury linens', 'Espresso machine', 'WiFi', 'Private parking'],
  'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/3288103/pexels-photo-3288103.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Perfect for romantic breaks. Adults only (18+).'
),
(
  'Harbour Light',
  'harbour-light',
  'Padstow, North Cornwall',
  'Cornwall',
  'Harbour Light is a generous Georgian townhouse right on Padstow''s famous harbour, offering the unique pleasure of watching fishing boats and the Camel Estuary from the comfort of your own sitting room. The house has been fully renovated to an exceptionally high standard while preserving the original sash windows, ornate cornicing and wide-plank floorboards that give it such distinctive character. Upstairs, four well-appointed bedrooms sleep eight guests comfortably, making this an ideal choice for larger family gatherings or groups of friends. The ground floor opens directly onto the harbourside and Rick Stein''s celebrated restaurants are a short stroll away.',
  'Georgian townhouse on Padstow harbour with estuary views and space for up to eight guests.',
  8,
  4,
  3,
  320,
  ARRAY['Harbourside location', 'Estuary views', 'Private courtyard', 'Fully equipped kitchen', 'Dining for 8', 'WiFi', 'Smart TVs', 'Free parking nearby', 'Welcome hamper'],
  'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Very popular for large groups. Weekend stays available in low season.'
),
(
  'The Boathouse',
  'the-boathouse',
  'Rock, North Cornwall',
  'Cornwall',
  'Sitting directly on the water''s edge at Rock, The Boathouse is one of those rare properties where the view is simply all you need. The Camel Estuary stretches out before you in ever-changing tides and light, and on clear days you can see all the way to Stepper Point. Originally a working boat store, this sensitively converted property retains its double-height ceilings, original beams and shipyard-style windows, now wrapped around three comfortable bedrooms, a designer kitchen and a spectacular open living space with a floating mezzanine. Private slipway access means kayaks and paddleboards can be launched directly into the estuary.',
  'Converted boathouse with private slipway on the Camel Estuary at Rock, North Cornwall.',
  6,
  3,
  2,
  295,
  ARRAY['Estuary views', 'Private slipway', 'Kayak storage', 'Mezzanine lounge', 'Designer kitchen', 'WiFi', 'BBQ', 'Outdoor seating', 'Parking', 'Dog friendly'],
  'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Slipway access subject to tidal conditions. Kayaks available by prior arrangement.'
),
(
  'Moor''s Edge',
  'moors-edge',
  'Bodmin Moor, Cornwall',
  'Cornwall',
  'For those who seek quiet space, open skies and the restorative power of wild landscape, Moor''s Edge is exceptional. This stone-built farmhouse sits on the southern edge of Bodmin Moor with views that reach to the coast on clear days. Completely secluded yet only 20 minutes from Padstow and Wadebridge, it offers a rare combination of genuine peace and easy access to North Cornwall''s finest beaches and towns. Inside, the farmhouse is warm, spacious and lovingly decorated with antiques, original artwork and deep sofas — a proper home away from home. A large walled garden, outdoor hot tub and fire pit make it perfect for autumn and winter escapes.',
  'Secluded moorland farmhouse with hot tub, fire pit and sweeping views to the Cornish coast.',
  10,
  5,
  3,
  275,
  ARRAY['Hot tub', 'Fire pit', 'Walled garden', 'Moorland views', 'Wood-burning stoves', 'Fully equipped kitchen', 'WiFi', 'Parking', 'Dog friendly', 'Games room'],
  'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY['https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/2062425/pexels-photo-2062425.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  'Minimum 3-night stay. Hot tub heating included. Ideal for autumn/winter breaks.'
);
