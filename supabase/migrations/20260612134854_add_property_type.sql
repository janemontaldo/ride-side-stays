
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type text NOT NULL DEFAULT 'House';

UPDATE properties SET property_type = 'House' WHERE slug = 'big-hill';
UPDATE properties SET property_type = 'Rooms / House' WHERE slug = 'eymet';
