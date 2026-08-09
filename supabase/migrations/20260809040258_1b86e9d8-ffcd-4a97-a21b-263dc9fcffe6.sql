
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  eco_rating smallint NOT NULL DEFAULT 3,
  material text,
  recycling text,
  description text,
  image_query text NOT NULL,
  is_alternative boolean NOT NULL DEFAULT false,
  alternative_for uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_alt_idx ON public.products(alternative_for);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products are public" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.eco_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  image_query text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eco_tips TO anon;
GRANT SELECT ON public.eco_tips TO authenticated;
GRANT ALL ON public.eco_tips TO service_role;
ALTER TABLE public.eco_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tips are public" ON public.eco_tips FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed originals
INSERT INTO public.products (id, name, category, price, eco_rating, material, recycling, description, image_query, is_alternative) VALUES
('11111111-1111-4111-8111-000000000001','Classic Cotton T-Shirt','Apparel',19.99,2,'Conventional cotton','Textile drop-off only','Everyday tee made from conventionally grown cotton.','cotton,tshirt,clothing',false),
('11111111-1111-4111-8111-000000000002','Standard Laundry Detergent','Home',12.50,2,'Plastic jug, petro-surfactants','Rinse jug, recycle #2 plastic','Liquid detergent in a single-use plastic jug.','laundry,detergent,bottle',false),
('11111111-1111-4111-8111-000000000003','Plastic Water Bottle 12-Pack','Drinkware',6.99,1,'PET plastic','Curbside recycling, low yield','Single-use bottled water multipack.','plastic,water,bottles',false),
('11111111-1111-4111-8111-000000000004','Disposable Coffee Cups (50)','Kitchen',9.99,1,'Paper with plastic lining','Not recyclable in most areas','Lined paper cups for hot drinks.','disposable,coffee,cup',false),
('11111111-1111-4111-8111-000000000005','Nylon Toothbrush 4-Pack','Personal Care',5.49,2,'Polypropylene handle','Landfill','Standard plastic-handled toothbrushes.','toothbrush,plastic,bathroom',false),
('11111111-1111-4111-8111-000000000006','Plastic Food Wrap','Kitchen',4.25,1,'PVC cling film','Not recyclable','Cling film roll for food storage.','plastic,wrap,kitchen',false),
('11111111-1111-4111-8111-000000000007','Polyester Tote Bag','Accessories',14.00,3,'Recycled polyester','Textile recycling','Lightweight reusable shopping bag.','tote,bag,shopping',false),
('11111111-1111-4111-8111-000000000008','Standard LED Desk Lamp','Electronics',29.99,3,'ABS plastic, LED','E-waste drop-off','Energy-saving desk lamp with plastic body.','desk,lamp,led',false);

INSERT INTO public.products (name, category, price, eco_rating, material, recycling, description, image_query, is_alternative, alternative_for) VALUES
('Organic Cotton T-Shirt','Apparel',26.00,5,'GOTS-certified organic cotton','Fully compostable fibre; take-back program','Grown without synthetic pesticides, dyed with low-impact dyes.','organic,cotton,tshirt',true,'11111111-1111-4111-8111-000000000001'),
('Hemp Blend Tee','Apparel',32.00,4,'55% hemp, 45% organic cotton','Textile take-back','Hemp needs a fraction of the water cotton does.','hemp,shirt,natural',true,'11111111-1111-4111-8111-000000000001'),
('Plant-Based Detergent Sheets','Home',15.00,5,'Plant surfactants, paper sleeve','Compostable packaging','Zero-plastic strips that dissolve in any wash temperature.','eco,laundry,sheets',true,'11111111-1111-4111-8111-000000000002'),
('Refillable Detergent Concentrate','Home',18.00,4,'Aluminium bottle + refills','Aluminium infinitely recyclable','Buy the bottle once, refill forever.','refill,detergent,eco',true,'11111111-1111-4111-8111-000000000002'),
('Insulated Steel Bottle','Drinkware',24.00,5,'18/8 stainless steel','100% recyclable steel','Replaces roughly 1,200 single-use bottles.','stainless,steel,waterbottle',true,'11111111-1111-4111-8111-000000000003'),
('Collapsible Silicone Cup','Kitchen',16.00,4,'Food-grade silicone','Specialist silicone recycling','Pocket-sized reusable cup for takeaway coffee.','reusable,coffee,cup',true,'11111111-1111-4111-8111-000000000004'),
('Bamboo Toothbrush 4-Pack','Personal Care',8.99,5,'Bamboo handle, castor-bean bristles','Handle composts at home','Plastic-free brushes with a compostable handle.','bamboo,toothbrush,eco',true,'11111111-1111-4111-8111-000000000005'),
('Beeswax Food Wraps','Kitchen',13.50,5,'Organic cotton, beeswax, jojoba','Compostable after a year of use','Washable wraps that mould to any bowl.','beeswax,wrap,food',true,'11111111-1111-4111-8111-000000000006'),
('Organic Canvas Tote','Accessories',18.00,5,'Unbleached organic canvas','Compostable natural fibre','Heavy-duty tote built to last a decade.','canvas,tote,bag',true,'11111111-1111-4111-8111-000000000007'),
('Solar Rechargeable Desk Lamp','Electronics',39.00,5,'Bamboo body, solar cell','Modular, repairable, e-waste program','Charges by daylight, runs 12 hours per charge.','solar,lamp,bamboo',true,'11111111-1111-4111-8111-000000000008');

INSERT INTO public.eco_tips (category, title, body, image_query) VALUES
('Reduce','Buy once, buy well','A durable product bought once beats five cheap replacements. Check warranty length as a proxy for build quality.','minimal,sustainable,products'),
('Reduce','Skip the single-use aisle','Cups, cutlery, wipes and bottles are the fastest route to landfill. Keep a reusable kit in your bag.','reusable,zerowaste,kit'),
('Reduce','Watch the packaging','Choose loose produce and concentrated refills; packaging can be a third of a product footprint.','plastic,free,packaging'),
('Reuse','Repair before replacing','Most appliance faults are one cheap part. Repair cafés and manufacturer spares keep gear alive for years.','repair,tools,workshop'),
('Reuse','Shop secondhand first','Buying used avoids nearly all of a product manufacturing emissions.','secondhand,thrift,store'),
('Reuse','Give containers a second life','Glass jars make excellent pantry storage, seedling pots and lunch containers.','glass,jars,storage'),
('Recycle','Rinse, dry, then bin it','Food residue contaminates whole recycling batches. A quick rinse keeps material in the loop.','recycling,bins,sorting'),
('Recycle','Never bin batteries or e-waste','Batteries cause fires in trucks. Use supermarket drop-off points or council e-waste days.','ewaste,batteries,recycling'),
('Recycle','Learn your local codes','Plastics #1 and #2 are widely accepted; #3 to #7 rarely are. Check your council list before tossing.','plastic,recycling,symbols'),
('Sustainable Brands','Look for real certifications','GOTS, B Corp, Fair Trade and Cradle to Cradle are audited. Vague words like green are not.','eco,certification,label'),
('Sustainable Brands','Favour take-back programs','Brands that repair or recycle their own products design them to last.','sustainable,brand,store'),
('Sustainable Brands','Check the supply chain page','Serious brands publish factory lists and material sourcing. Silence is a red flag.','sustainable,factory,textile');
