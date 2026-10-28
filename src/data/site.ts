export const business = {
  name: 'LB Elevators',
  legal: 'A Unit of Lifts Bazar Private Limited',
  tagline: 'Leading the Way in Innovative Vertical Mobility',
  phones: ['+91 9679112375', '+91 9102595785'],
  email: 'liftsbazar2025@gmail.com',
  address:
    'Shivaji Nagar, Champasari Main Road, Near Gulam View Hotel, Behind Bata Showroom, Siliguri – 734003, West Bengal, India',
  director: 'Binod Yadav',
  website: 'www.liftsbazar.in',
  // WhatsApp chat uses the primary phone unless an approved number is configured.
  whatsapp: (import.meta.env.PUBLIC_WHATSAPP_NUMBER as string) || '919679112375',
  mapEmbed:
    'https://maps.google.com/maps?q=Champasari+Main+Road,+Shivaji+Nagar,+Siliguri,+West+Bengal+734003&z=15&output=embed',
  map: 'https://www.google.com/maps/search/?api=1&query=Shivaji+Nagar+Champasari+Main+Road+Near+Gulam+View+Hotel+Siliguri+734003',
};
export const products = [
  {
    slug: 'passenger-lifts',
    name: 'Passenger Lifts',
    image: 'passenger',
    // Highlights as printed in the supplied brochure.
    highlights: ['Stylish & comfortable', 'Safe & reliable', 'Suitable for all buildings'],
    short: 'Comfort in every journey.',
    description:
      'Modern passenger lift solutions for comfortable, everyday movement between floors.',
    overview:
      'Connect the spaces people use every day. Our passenger lift solutions bring together practical building access, considered cabin design and a comfortable passenger experience.',
    features: [
      'Comfortable passenger cabins',
      'Finishes suited to your interiors',
      'Planning around building usage',
    ],
    applications: ['Residential buildings', 'Commercial buildings', 'Hotels'],
    advice:
      'Tell us about your building height, expected passenger use and available space. Our team can discuss a suitable configuration following a site assessment.',
  },
  {
    slug: 'goods-lifts',
    name: 'Goods Lifts',
    image: 'goods',
    // Highlights as printed in the supplied brochure.
    highlights: ['Heavy duty & durable', 'For industrial and commercial use', 'Multiple capacity options'],
    short: 'Built for the working day.',
    description:
      'Heavy-duty lift solutions for factories, warehouses and commercial spaces.',
    overview:
      'Make movement of goods part of a better building workflow. Goods lifts support the vertical transport needs of industrial and commercial environments, with the configuration considered around the materials being moved.',
    features: [
      'Goods-focused cabin layouts',
      'Options for commercial and industrial use',
      'Capacity discussed for your requirements',
    ],
    applications: [
      'Factories & industries',
      'Warehouses',
      'Commercial buildings',
    ],
    advice:
      'Share the type, weight and size of goods, loading method and floor layout. Capacity and dimensions are confirmed only after technical assessment.',
  },
  {
    slug: 'home-lifts',
    name: 'Home Lifts',
    image: 'home',
    // Highlights as printed in the supplied brochure.
    highlights: ['Elegant & space saving', 'Modern design', 'Ideal for villas & homes'],
    short: 'A new level of living.',
    description:
      'Elegant, space-conscious lifts for villas and residential homes.',
    overview:
      'Bring the floors of your home closer together. A home lift can support convenient daily movement while fitting naturally into the character of a villa or residential interior.',
    features: [
      'Residential design focus',
      'Space-conscious planning',
      'Finishes that complement your home',
    ],
    applications: ['Private homes', 'Villas', 'Residential buildings'],
    advice:
      'Bring your floor plan and preferred lift location. Available space, access needs and the existing structure help guide the recommendation.',
  },
  {
    slug: 'hospital-lifts',
    name: 'Hospital Lifts',
    image: 'hospital',
    // Highlights as printed in the supplied brochure.
    highlights: ['Hygienic & spacious', 'For hospitals & healthcare facilities', 'Smooth & reliable'],
    short: 'Care, carried thoughtfully.',
    description:
      'Spacious lift solutions for hospitals and healthcare environments.',
    overview:
      'Healthcare buildings need thoughtful movement between floors. Hospital lift planning considers patients, staff and equipment, with cabin arrangements discussed around the building’s healthcare requirements.',
    features: [
      'Spacious cabin planning',
      'Healthcare-oriented layouts',
      'Consideration for patient and equipment movement',
    ],
    applications: [
      'Hospitals',
      'Healthcare facilities',
      'Institutional buildings',
    ],
    advice:
      'Discuss bed or trolley dimensions, circulation needs and expected usage with our team. Specific cabin sizes and technical provisions require project review.',
  },
  {
    slug: 'capsule-panoramic-lifts',
    name: 'Capsule / Panoramic Lifts',
    image: 'panoramic',
    // Highlights as printed in the supplied brochure.
    highlights: ['Modern & attractive', 'Panoramic glass view', 'Enhances building beauty'],
    short: 'Make movement a statement.',
    description:
      'Architectural glass lifts that create a striking view between floors.',
    overview:
      'Turn a journey between floors into part of the architectural experience. Panoramic lifts use a glass-led appearance to complement contemporary buildings and visually open circulation spaces.',
    features: [
      'Panoramic glass appearance',
      'Architectural integration',
      'Interior-focused design options',
    ],
    applications: [
      'Hotels',
      'Commercial buildings',
      'Contemporary residential buildings',
    ],
    advice:
      'Share the architectural concept and proposed lift position. Glazing, structure and configuration need a project-specific technical discussion.',
  },
];
export const services = [
  {
    slug: 'elevator-installation',
    media: 'service-installation',
    // Supplied site video and photographs (src/data/photos.json).
    video: 'installation-site',
    photos: ['site-work-03', 'site-work-04', 'site-work-05', 'home-lift-02'],
    name: 'Installation',
    icon: 'tools',
    description: 'Professional installation, planned around your building.',
    overview:
      'From a first discussion about your building to installation planning, LB Elevators helps bring your chosen lift solution into place. The scope is considered around the building and the selected equipment.',
    points: [
      'Building and access requirements',
      'Lift and door selection discussion',
      'Project-specific installation planning',
    ],
    process: [
      'Discuss your building',
      'Review the proposed solution',
      'Agree the installation scope',
    ],
  },
  {
    slug: 'elevator-maintenance',
    media: 'service-maintenance',
    // Supplied site video and photographs (src/data/photos.json).
    video: 'door-operation',
    photos: [
      'steel-cabin-01',
      'site-work-01',
      'steel-cabin-04',
      'site-work-02',
    ],
    name: 'Maintenance',
    icon: 'gear',
    description: 'Regular care for smooth, dependable operation.',
    overview:
      'Ongoing maintenance is an important part of elevator ownership. We offer maintenance services for lift systems, with the work and schedule agreed around the equipment and its usage.',
    points: [
      'Review of the existing lift',
      'Maintenance requirements discussion',
      'An agreed care and service scope',
    ],
    process: [
      'Tell us about your lift',
      'Review its service needs',
      'Agree a maintenance plan',
    ],
  },
  {
    slug: 'elevator-modernization',
    media: 'service-modernization',
    // Supplied site video and photographs (src/data/photos.json).
    video: 'finish-details',
    photos: [
      'designer-cabin-08',
      'designer-cabin-05',
      'designer-cabin-12',
      'designer-cabin-10',
    ],
    name: 'Modernization',
    icon: 'chart',
    description: 'A considered upgrade for your existing lift.',
    overview:
      'An existing elevator may benefit from an upgrade as building needs change. Our modernization service starts with a discussion of the current lift and the improvements you want to explore.',
    points: [
      'Existing equipment assessment',
      'Upgrade priorities and options',
      'Project-specific modernization scope',
    ],
    process: [
      'Review the existing installation',
      'Discuss upgrade priorities',
      'Agree a suitable scope',
    ],
  },
  {
    slug: 'amc-service',
    media: 'service-amc',
    // Supplied site video and photographs (src/data/photos.json).
    video: 'glass-doors',
    photos: [
      'steel-cabin-02',
      'steel-cabin-03',
      'home-lift-03',
      'steel-cabin-08',
    ],
    name: 'AMC / Service',
    icon: 'document',
    description: 'A longer-term approach to elevator care.',
    overview:
      'An Annual Maintenance Contract provides an agreed framework for ongoing elevator service. Talk to our team about the equipment, usage and service arrangements that your building needs.',
    points: [
      'Equipment and usage discussion',
      'Written contract scope',
      'Agreed service arrangements',
    ],
    process: [
      'Share your equipment details',
      'Discuss contract requirements',
      'Review and agree the terms',
    ],
  },
];
// Brochure promise line and business-card service line.
export const promises = ['Safe', 'Reliable', 'Smart', 'Comfortable', 'Future Ready'];
export const values = [
  { icon: 'diamond', title: 'Quality Products', text: 'Lift categories selected for comfort, durability and a refined finish.' },
  { icon: 'shield', title: 'Safety First', text: 'Safe and reliable vertical mobility, planned around how your building is used.' },
  { icon: 'users', title: 'Client Satisfaction', text: 'Customized solutions shaped by your space, priorities and budget.' },
  { icon: 'gear', title: 'Modern Technology', text: 'Advanced and efficient elevator solutions for contemporary buildings.' },
  { icon: 'leaf', title: 'Energy Efficient', text: 'Smarter systems for a better tomorrow.' },
];
export const doors = [
  {
    name: 'Without Vision Door',
    image: 'door-solid',
    description:
      'A solid door for privacy and a clean appearance in residential, commercial and industrial settings.',
  },
  {
    name: 'Auto Door (Center Opening)',
    image: 'door-auto',
    description:
      'Center-opening automatic doors for convenient access in residential, commercial and hospital buildings.',
  },
  {
    name: 'Half Vision Door',
    image: 'door-half',
    description:
      'A partial glass vision panel balances visibility and privacy for commercial and institutional spaces.',
  },
  {
    name: 'Full Vision Door (Big Glass Vision)',
    image: 'door-full',
    description:
      'A glass-led door with an open visual appearance for malls, offices, hotels and contemporary buildings.',
  },
  {
    name: 'Manual Telescopic Door',
    image: 'door-telescopic',
    description:
      'A manually operated telescopic arrangement with a space-saving design for low to mid-rise buildings.',
  },
  {
    name: 'IFD Door (Manual Imperforated)',
    image: 'door-ifd',
    description:
      'A manual imperforated door option for residential and small commercial use.',
  },
  {
    name: 'Collapsible Door',
    image: 'door-collapsible',
    description:
      'A folding lattice-style door commonly used in residential and industrial buildings.',
  },
  {
    name: 'Swing Door',
    image: 'door-swing',
    description:
      'A simple manual swing arrangement for buildings with lower traffic and economical installation requirements.',
  },
];
export const applications = [
  {
    name: 'Residential Buildings',
    image: 'residential',
    text: 'Everyday connections for homes, apartments and residential communities.',
    product: 'home-lifts',
  },
  {
    name: 'Commercial Buildings',
    image: 'commercial',
    text: 'Practical passenger movement for workplaces and commercial spaces.',
    product: 'passenger-lifts',
  },
  {
    name: 'Hospitals',
    image: 'healthcare',
    text: 'Thoughtful lift planning for patients, staff and healthcare equipment.',
    product: 'hospital-lifts',
  },
  {
    name: 'Hotels',
    image: 'hotel',
    text: 'A welcoming journey that complements the hospitality experience.',
    product: 'capsule-panoramic-lifts',
  },
  {
    name: 'Schools & Colleges',
    image: 'education',
    text: 'Considered vertical access for educational and institutional buildings.',
    product: 'passenger-lifts',
  },
  {
    name: 'Factories & Industries',
    image: 'industrial',
    text: 'Goods movement designed around industrial building requirements.',
    product: 'goods-lifts',
  },
];
