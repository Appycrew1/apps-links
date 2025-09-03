-- Enable uuid generation
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.categories (
  id text primary key,
  label text not null,
  created_at timestamptz default now()
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id text not null references public.categories(id) on delete restrict,
  website text,
  summary text,
  details text,
  tags text[] default '{}',
  logo text,
  is_active boolean default true,
  is_featured boolean default false,
  tier text default 'free',
  discount_label text,
  discount_details text,
  feature_until timestamptz,
  created_at timestamptz default now()
);

-- RLS & public read policies
alter table public.categories enable row level security;
alter table public.providers enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read active providers" on public.providers;
create policy "public read active providers" on public.providers for select using (is_active = true);

-- Categories
insert into public.categories (id, label) values
  ('software','Software'),
  ('crm','CRM'),
  ('marketing','Marketing'),
  ('leads','Leads/Marketplaces'),
  ('insurance','Insurance'),
  ('storage','Self Storage'),
  ('packaging','Boxes & Packaging'),
  ('vehicle','Vehicle Rental'),
  ('equipment','Lifting/Ramps/Equipment'),
  ('printing','Printing & Signage'),
  ('cleaning','Cleaning'),
  ('waste','Waste & Recycling'),
  ('utilities','Business Utilities'),
  ('payments','Payments/Finance'),
  ('telephony','Telephony/VoIP'),
  ('it','IT Support & Hosting'),
  ('gps','GPS/Tracking'),
  ('training','Training & Compliance')
on conflict (id) do nothing;

-- 50 providers
insert into public.providers (name, category_id, website, summary, details, tags, logo, is_active, is_featured, tier, discount_label, discount_details)
values
('MoveFlow CRM','crm','https://prov01.example.com','CRM & job scheduling for removals','Pipeline, surveys, scheduling, invoicing', ARRAY['crm','jobs','calendar'],'https://api.dicebear.com/7.x/initials/svg?seed=MoveFlow+CRM',true,true,'free',null,null),
('BoxBrain','software','https://prov02.example.com','Inventory & barcode tracking','Track boxes, barcodes, and warehouse moves', ARRAY['inventory','barcode'],'https://api.dicebear.com/7.x/initials/svg?seed=BoxBrain',true,false,'free',null,null),
('RouteWise','software','https://prov03.example.com','Route optimisation for multi-van fleets','Reduce miles with smart routing', ARRAY['routing','optimisation'],'https://api.dicebear.com/7.x/initials/svg?seed=RouteWise',true,false,'free',null,null),
('OpsDesk','software','https://prov04.example.com','All-in-one ops dashboard','Tasks, templates, compliance kit', ARRAY['ops','templates'],'https://api.dicebear.com/7.x/initials/svg?seed=OpsDesk',true,false,'free',null,null),
('Quoter Pro','software','https://prov05.example.com','Instant quotes & proposals','Online quotes with e-sign and deposits', ARRAY['quotes','e-sign'],'https://api.dicebear.com/7.x/initials/svg?seed=Quoter+Pro',true,false,'free',null,null),

('LeadBridge','leads','https://prov06.example.com','Pay-per-lead for movers','Geofenced, fraud-screened removal leads', ARRAY['leads','ppc'],'https://api.dicebear.com/7.x/initials/svg?seed=LeadBridge',true,true,'free',null,null),
('MoveSEO','marketing','https://prov07.example.com','SEO for removal firms','Local SEO, citations, content', ARRAY['seo','content'],'https://api.dicebear.com/7.x/initials/svg?seed=MoveSEO',true,false,'free',null,null),
('AdCrate','marketing','https://prov08.example.com','PPC & social ads','Landing pages + tracking', ARRAY['ppc','social'],'https://api.dicebear.com/7.x/initials/svg?seed=AdCrate',true,false,'free',null,null),
('ReviewRocket','marketing','https://prov09.example.com','Automated review collection','Google & Trustpilot automations', ARRAY['reviews','automation'],'https://api.dicebear.com/7.x/initials/svg?seed=ReviewRocket',true,false,'free',null,null),
('LocalListings','marketing','https://prov10.example.com','Directory + citation building','NAP cleanups at scale', ARRAY['citations','local'],'https://api.dicebear.com/7.x/initials/svg?seed=LocalListings',true,false,'free',null,null),

('MoverCover','insurance','https://prov11.example.com','Removals insurance','Goods in transit, liability, fleet', ARRAY['insurance','git'],'https://api.dicebear.com/7.x/initials/svg?seed=MoverCover',true,false,'free',null,null),
('FleetSecure','insurance','https://prov12.example.com','Fleet insurance & telematics','Dashcams + risk management', ARRAY['fleet','telematics'],'https://api.dicebear.com/7.x/initials/svg?seed=FleetSecure',true,false,'free',null,null),
('PayMove','payments','https://prov13.example.com','Card + Bank payments','Links, terminals, and subscriptions', ARRAY['payments','cards'],'https://api.dicebear.com/7.x/initials/svg?seed=PayMove',true,true,'free','2% off processing','For first 3 months'),
('CapitalLift','payments','https://prov14.example.com','Business finance','Asset finance for vans & kit', ARRAY['finance','loans'],'https://api.dicebear.com/7.x/initials/svg?seed=CapitalLift',true,false,'free',null,null),
('FuelCard UK','payments','https://prov15.example.com','Fuel cards for SMEs','Discount networks + reporting', ARRAY['fuel','cards'],'https://api.dicebear.com/7.x/initials/svg?seed=FuelCard+UK',true,false,'free',null,null),

('SafeStore Boxes','packaging','https://prov16.example.com','Boxes & packing supplies','Trade rates, next-day delivery', ARRAY['boxes','packing'],'https://api.dicebear.com/7.x/initials/svg?seed=SafeStore+Boxes',true,false,'free',null,null),
('WrapRight','packaging','https://prov17.example.com','Eco packing materials','Paper wrap, recyclable tape', ARRAY['eco','packing'],'https://api.dicebear.com/7.x/initials/svg?seed=WrapRight',true,false,'free',null,null),
('LockerHub','storage','https://prov18.example.com','Self storage partner network','Commission per move-in', ARRAY['storage','partner'],'https://api.dicebear.com/7.x/initials/svg?seed=LockerHub',true,true,'free',null,null),
('Vault+','storage','https://prov19.example.com','Containerised storage','Warehouse systems + vaults', ARRAY['containers','warehouse'],'https://api.dicebear.com/7.x/initials/svg?seed=Vault+',true,false,'free',null,null),
('QuickCrate','packaging','https://prov20.example.com','Crates & dollies','Short-term crate hire for moves', ARRAY['crates','dollies'],'https://api.dicebear.com/7.x/initials/svg?seed=QuickCrate',true,false,'free',null,null),

('VanHire Co','vehicle','https://prov21.example.com','Short & long-term van hire','Tail-lifts, Luton, insurance included', ARRAY['vans','hire'],'https://api.dicebear.com/7.x/initials/svg?seed=VanHire+Co',true,false,'free',null,null),
('LiftMate','equipment','https://prov22.example.com','Stair climbers & lifts','Install + training', ARRAY['lifts','stair'],'https://api.dicebear.com/7.x/initials/svg?seed=LiftMate',true,false,'free',null,null),
('RampWorks','equipment','https://prov23.example.com','Ramps & boards','Custom widths and ratings', ARRAY['ramps','boards'],'https://api.dicebear.com/7.x/initials/svg?seed=RampWorks',true,false,'free',null,null),
('StrapPro','equipment','https://prov24.example.com','Straps & tie-downs','EN-rated kits, bulk pricing', ARRAY['straps','tie-down'],'https://api.dicebear.com/7.x/initials/svg?seed=StrapPro',true,false,'free',null,null),
('DollyKing','equipment','https://prov25.example.com','Sack trucks & dollies','Pro-spec aluminium trucks', ARRAY['dollies','trucks'],'https://api.dicebear.com/7.x/initials/svg?seed=DollyKing',true,false,'free',null,null),

('PrintYard','printing','https://prov26.example.com','Flyers & van graphics','Design, print, and wrap', ARRAY['print','wraps'],'https://api.dicebear.com/7.x/initials/svg?seed=PrintYard',true,false,'free',null,null),
('SignLab','printing','https://prov27.example.com','Site boards & signage','Reflective + magnetic', ARRAY['signage','boards'],'https://api.dicebear.com/7.x/initials/svg?seed=SignLab',true,false,'free',null,null),
('MoveClean','cleaning','https://prov28.example.com','End-of-tenancy cleaning','Partner program', ARRAY['cleaning','eot'],'https://api.dicebear.com/7.x/initials/svg?seed=MoveClean',true,false,'free',null,null),
('SparklePro','cleaning','https://prov29.example.com','Deep cleaning crew','Bio & specialist', ARRAY['deep','bio'],'https://api.dicebear.com/7.x/initials/svg?seed=SparklePro',true,false,'free',null,null),
('ScrubHub','cleaning','https://prov30.example.com','Regular office cleaning','Contracted cleans', ARRAY['office','clean'],'https://api.dicebear.com/7.x/initials/svg?seed=ScrubHub',true,false,'free',null,null),

('WasteAway','waste','https://prov31.example.com','Waste collection','Man-and-van + skips', ARRAY['waste','skips'],'https://api.dicebear.com/7.x/initials/svg?seed=WasteAway',true,false,'free',null,null),
('EcoSkip','waste','https://prov32.example.com','Skip hire network','Trade rates', ARRAY['skip','hire'],'https://api.dicebear.com/7.x/initials/svg?seed=EcoSkip',true,false,'free',null,null),
('BizEnergy UK','utilities','https://prov33.example.com','Business energy switching','Fixed-rate tenders', ARRAY['energy','gas','electric'],'https://api.dicebear.com/7.x/initials/svg?seed=BizEnergy+UK',true,false,'free',null,null),
('WaterWise','utilities','https://prov34.example.com','Business water savings','Audits & switching', ARRAY['water','utilities'],'https://api.dicebear.com/7.x/initials/svg?seed=WaterWise',true,false,'free',null,null),
('OfficeNet','utilities','https://prov35.example.com','Broadband for depots','Static IP + 4G backup', ARRAY['broadband','backup'],'https://api.dicebear.com/7.x/initials/svg?seed=OfficeNet',true,false,'free',null,null),

('CallCloud','telephony','https://prov36.example.com','VoIP phone system','IVR, call recording, mobile apps', ARRAY['voip','ivr'],'https://api.dicebear.com/7.x/initials/svg?seed=CallCloud',true,false,'free',null,null),
('RingMate','telephony','https://prov37.example.com','Call tracking','Dynamic number insertion', ARRAY['tracking','numbers'],'https://api.dicebear.com/7.x/initials/svg?seed=RingMate',true,false,'free',null,null),
('DepotIT','it','https://prov38.example.com','IT support for SMEs','Helpdesk, M365, backups', ARRAY['it','msp'],'https://api.dicebear.com/7.x/initials/svg?seed=DepotIT',true,false,'free',null,null),
('HostFast','it','https://prov39.example.com','Hosting & email','Domains, DNS, SSL', ARRAY['hosting','email'],'https://api.dicebear.com/7.x/initials/svg?seed=HostFast',true,false,'free',null,null),
('TrackFleet','gps','https://prov40.example.com','Vehicle tracking','Live GPS & geofencing', ARRAY['gps','tracking'],'https://api.dicebear.com/7.x/initials/svg?seed=TrackFleet',true,false,'free',null,null),

('SafeCert','training','https://prov41.example.com','Manual handling & H&S','Onsite + online', ARRAY['training','safety'],'https://api.dicebear.com/7.x/initials/svg?seed=SafeCert',true,false,'free',null,null),
('ComplianceKit','training','https://prov42.example.com','Policies & templates','Risk assessments, RAMS', ARRAY['templates','compliance'],'https://api.dicebear.com/7.x/initials/svg?seed=ComplianceKit',true,false,'free',null,null),
('DriverCPC+','training','https://prov43.example.com','CPC training for drivers','JAUPT approved', ARRAY['cpc','drivers'],'https://api.dicebear.com/7.x/initials/svg?seed=DriverCPC+',true,false,'free',null,null),
('FirstAidPro','training','https://prov44.example.com','First-aid courses','HSE-compliant', ARRAY['first-aid','training'],'https://api.dicebear.com/7.x/initials/svg?seed=FirstAidPro',true,false,'free',null,null),
('FireSafe','training','https://prov45.example.com','Fire safety training','Extinguishers & drills', ARRAY['fire','safety'],'https://api.dicebear.com/7.x/initials/svg?seed=FireSafe',true,false,'free',null,null),

('StockSnap','software','https://prov46.example.com','Photo capture & notes','Survey + job photos to cloud', ARRAY['photos','surveys'],'https://api.dicebear.com/7.x/initials/svg?seed=StockSnap',true,false,'free',null,null),
('TimeTrack','software','https://prov47.example.com','Timesheets & payroll','Clock-in mobile app', ARRAY['timesheets','payroll'],'https://api.dicebear.com/7.x/initials/svg?seed=TimeTrack',true,false,'free',null,null),
('FormsFlow','software','https://prov48.example.com','Digital forms & RAMS','Sign-on-glass, PDFs', ARRAY['forms','rams'],'https://api.dicebear.com/7.x/initials/svg?seed=FormsFlow',true,false,'free',null,null),
('DepotBoard','software','https://prov49.example.com','Depot calendar & board','Drag-and-drop scheduling', ARRAY['calendar','board'],'https://api.dicebear.com/7.x/initials/svg?seed=DepotBoard',true,false,'free',null,null),
('InboxAI','software','https://prov50.example.com','AI email triage','Auto-replies & tagging', ARRAY['ai','email'],'https://api.dicebear.com/7.x/initials/svg?seed=InboxAI',true,false,'free',null,null);
