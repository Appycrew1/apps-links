export const categoriesSeed = [
  { id: "software",  label: "Moving Software & CRM" },
  { id: "sales",     label: "Moving Sales Solutions" },
  { id: "marketing", label: "Marketing / Advertising" },
  { id: "insurance", label: "Moving Insurance" },
  { id: "equipment", label: "Moving Equipment" },
  { id: "apps",      label: "Apps & Online Tools" },
  { id: "leads",     label: "Moving Leads" },
];

export const providersSeed = [
  // SOFTWARE / CRM
  { id:"moveman", name:"MoveMan", category:"software", tags:["UK","CRM","Ops"], website:"https://www.movemanpro.com/", summary:"UK removals CRM for quoting, planning and storage.", details:"Diary, crews, storage and invoicing.", is_featured:true },
  { id:"moveware", name:"Moveware", category:"software", tags:["ERP","CRM"], website:"https://www.moveconnect.com/", summary:"End-to-end ERP/CRM for moving & storage.", details:"Sales → ops → accounting in one stack." },
  { id:"movehq", name:"MoveHQ", category:"software", tags:["CRM","Survey"], website:"https://www.movehq.com/", summary:"Digital surveys, CRM, ops tools.", details:"Mobile crews apps & digital inventory." },
  { id:"supermove", name:"Supermove", category:"software", tags:["CRM","Ops"], website:"https://www.supermove.com/", summary:"Modern CRM & operations.", details:"Scheduling, dispatch, payments, portal." },
  { id:"smoveit", name:"Smove IT", category:"software", tags:["Ops","Inventory"], website:"https://www.smoveit.com/", summary:"Crew app & inventory.", details:"Signatures & photos." },
  { id:"surveybot", name:"Surveybot", category:"software", tags:["Video","Survey"], website:"https://www.surveybot.io/", summary:"Remote video pre-move surveys.", details:"Qualify jobs faster." },
  { id:"smartmoving", name:"SmartMoving", category:"software", tags:["CRM","Scheduling"], website:"https://www.smartmoving.com/", summary:"CRM & scheduling platform.", details:"Pipeline to dispatch." },
  { id:"oncue", name:"Oncue", category:"software", tags:["Sales","Follow-up"], website:"https://www.oncue.co/", summary:"Done-for-you sales team.", details:"Follow-ups & booking." },

  // SALES
  { id:"moneypenny", name:"Moneypenny (UK)", category:"sales", tags:["Answering","Chat","UK"], website:"https://www.moneypenny.com/uk/", summary:"Call answering & live chat.", details:"Capture enquiries 24/7.", is_featured:true },
  { id:"yomdel", name:"Yomdel Live Chat", category:"sales", tags:["Live Chat","Leads"], website:"https://www.yomdel.com/", summary:"Managed live chat.", details:"Human chat teams convert." },
  { id:"answer4u", name:"Answer4u", category:"sales", tags:["Call Handling"], website:"https://www.answer-4u.com/", summary:"24/7 call handling.", details:"Never miss a call." },
  { id:"talkative", name:"Talkative", category:"sales", tags:["Web Chat","Cobrowse"], website:"https://www.talkative.uk/", summary:"Web chat & video.", details:"Cobrowse; proactive chat." },
  { id:"livechat", name:"LiveChat", category:"sales", tags:["Chat"], website:"https://www.livechat.com/", summary:"Website chat widget.", details:"Rules & CRM integrations." },

  // MARKETING
  { id:"bar_marketing", name:"BAR Partner Marketing", category:"marketing", tags:["Association","UK"], website:"https://bar.co.uk/", summary:"Reach BAR member movers.", details:"Ads & sponsorship." },
  { id:"brightlocal", name:"BrightLocal", category:"marketing", tags:["Local SEO","Reviews"], website:"https://www.brightlocal.com/", summary:"Local SEO & reviews.", details:"Boost map rankings." },
  { id:"mailchimp", name:"Mailchimp", category:"marketing", tags:["Email","CRM"], website:"https://mailchimp.com/", summary:"Email marketing.", details:"Nurture quotes → bookings." },
  { id:"canva", name:"Canva", category:"marketing", tags:["Design","Social"], website:"https://www.canva.com/", summary:"Design made easy.", details:"Brand kits & templates." },

  // INSURANCE
  { id:"basilfry", name:"Basil Fry & Company", category:"insurance", tags:["Broker","Removals"], website:"https://basilfry.co.uk/removals-and-storage/", summary:"Specialist removals insurance.", details:"Claims support.", is_featured:true },
  { id:"feeds", name:"FEEDS Insurance", category:"insurance", tags:["Storage","Policy"], website:"https://www.feedsinsurance.com/", summary:"Storage & removals cover.", details:"Tailored for operators." },
  { id:"insurethatmove", name:"Insure That Move", category:"insurance", tags:["Transit","Cover"], website:"https://www.insurethatmove.co.uk/", summary:"Transit & GIT cover.", details:"Flexible options." },
  { id:"towergate", name:"Towergate Brokers", category:"insurance", tags:["Commercial","Fleet"], website:"https://www.towergate.com/", summary:"Commercial & fleet.", details:"Bespoke policies." },

  // EQUIPMENT
  { id:"teacrate", name:"phs Teacrate – Crate Hire", category:"equipment", tags:["Crate Hire","Nationwide"], website:"https://teacrate.co.uk/", summary:"UK-wide crate hire.", details:"Fast delivery; full range.", is_featured:true },
  { id:"pss_supplies", name:"PSS – Removals Supplies", category:"equipment", tags:["Packaging"], website:"https://www.pssremovals.com/packing-materials", summary:"Boxes & materials.", details:"Trade options." },
  { id:"raja", name:"RAJA UK", category:"equipment", tags:["Boxes","Tape"], website:"https://www.rajapack.co.uk/", summary:"Packaging & warehouse.", details:"Bulk pricing." },
  { id:"harcross", name:"Harcross Crate Hire", category:"equipment", tags:["Crates","Dollies"], website:"https://www.harcrosscrates.co.uk/", summary:"Crate hire & kit.", details:"Skates & dollies." },

  // APPS & TOOLS
  { id:"zapier", name:"Zapier", category:"apps", tags:["Automation"], website:"https://zapier.com/", summary:"Connect 6,000+ apps.", details:"Automate workflows." },
  { id:"typeform", name:"Typeform", category:"apps", tags:["Forms"], website:"https://www.typeform.com/", summary:"Lead & survey forms.", details:"Great UX." },
  { id:"calendly", name:"Calendly", category:"apps", tags:["Scheduling"], website:"https://calendly.com/", summary:"Book surveys/visits.", details:"Reduce back-and-forth." },
  { id:"notion", name:"Notion", category:"apps", tags:["Docs","Wiki"], website:"https://www.notion.so/", summary:"Team wiki & SOPs.", details:"Keep playbooks updated." },

  // LEADS
  { id:"comparemymove", name:"Compare My Move", category:"leads", tags:["Lead Gen","UK"], website:"https://www.comparemymove.com/", summary:"Consumer marketplace.", details:"Pay-per-lead.", is_featured:true },
  { id:"reallymoving", name:"reallymoving", category:"leads", tags:["Leads","UK"], website:"https://www.reallymoving.com/", summary:"Moving leads UK.", details:"Domestic & intl." },
  { id:"moveit", name:"Move It Removals Leads", category:"leads", tags:["Leads"], website:"https://www.moveitnetwork.co.uk/", summary:"Lead supply network.", details:"Flexible volumes." },
  { id:"houseremovalleads", name:"House Removal Leads UK", category:"leads", tags:["Leads"], website:"https://houseremovalleads.co.uk/", summary:"Exclusive/shared leads.", details:"Filter by postcode." }
];
