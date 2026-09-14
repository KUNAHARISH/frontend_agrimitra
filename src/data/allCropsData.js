// Comprehensive ICAR-Certified Indian Agricultural Crops Database
export const ALL_CROPS_DIRECTORY = [
  {
    id: 'paddy',
    name: "Paddy / Rice (धान / వరి)",
    scientificName: "Oryza sativa",
    category: "Cereals & Grains",
    season: "Kharif (Main) / Rabi (Summer)",
    duration: "120 - 145 Days",
    yield: "25 - 32 Quintals / Acre",
    benchmarkPrice: "₹2,300 / Q (Common MSP), ₹2,320 / Q (Grade A)",
    tag: "Primary Staple",
    iconColor: "#16a34a",
    popularVarieties: [
      "BPT 5204 (Samba Mahsuri)",
      "Pusa Basmati 1121 / 1509",
      "MTU 1010 (Cottondora Sannalu)",
      "Swarna (MTU 7029)",
      "PR 126 / PR 131",
      "IR 64 / RNR 15048 (Telangana Sona)"
    ],
    soil: "Clay loam, heavy silty clay, rich alluvial soils with high water retention capacity. Ideal soil pH is 5.5 to 7.2.",
    climate: "Warm and humid climate. Mean temperature 22°C - 35°C with 1000-1500mm water requirement throughout growth.",
    seedRate: "20-25 kg/acre (Transplanting) or 10-12 kg/acre (Direct Seeded Rice / Drum Seeder). Space seedlings at 20cm × 15cm (2-3 seedlings/hill).",
    fertilizer: "NPK 120:60:40 kg/ha. Basal dose: 50% N + 100% P + 50% K; First top-dress (tillering): 25% N; Second top-dress (panicle initiation): 25% N + 50% K. Apply Zinc Sulphate @ 10 kg/acre.",
    irrigation: "Maintain 2-5 cm standing water during tillering and panicle development. Adopt Alternate Wetting and Drying (AWD) to conserve up to 30% water and reduce methane emissions.",
    pestsAndDiseases: [
      {
        name: "Yellow Stem Borer",
        symptom: "Dead hearts in vegetative stage and white ears at flowering.",
        remedy: "Apply Chlorantraniliprole 0.4% G @ 4 kg/acre or Spray Cartap Hydrochloride 50% SP @ 2g/L."
      },
      {
        name: "Blast (Leaf / Neck Blast)",
        symptom: "Spindle-shaped lesions with grey center and brown margins on leaves.",
        remedy: "Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L."
      },
      {
        name: "Brown Planthopper (BPH)",
        symptom: "Hopper burn: Circular yellowing and drying patches in field center.",
        remedy: "Spray Pymetrozine 50% WDG @ 120g/acre or Triflumezopyrim 10% SC @ 94ml/acre."
      }
    ],
    harvestingTip: "Harvest when 80-85% of grains in the panicles turn golden yellow. Moisture content in grain should be 18-20% at harvest and dried to 12-14% for storage."
  },
  {
    id: 'wheat',
    name: "Wheat (गेहूं / గోధుమలు)",
    scientificName: "Triticum aestivum",
    category: "Cereals & Grains",
    season: "Rabi (November - April)",
    duration: "115 - 130 Days",
    yield: "20 - 26 Quintals / Acre",
    benchmarkPrice: "₹2,275 / Q (Govt MSP)",
    tag: "Winter Staple",
    iconColor: "#d97706",
    popularVarieties: [
      "HD 3086 (Pusa Gautami)",
      "HD 2967",
      "Sharbati (Sehore C-306)",
      "Lokwan / GW 322",
      "PBW 550 / DBW 187 (Karan Vandana)"
    ],
    soil: "Well-drained medium loam to clay-loam alluvial soils with good humus content. pH 6.0 - 7.5.",
    climate: "Cool dry climate during vegetative phase (15°C - 20°C) and warm sunny weather during grain ripening (25°C - 30°C).",
    seedRate: "40-45 kg/acre (Broadcast/Drill sowing). Row spacing: 20-22.5cm with depth 4-5cm.",
    fertilizer: "NPK 120:60:40 kg/ha. Full P & K + 1/3 N as basal; 1/3 N at Crown Root Initiation (21 days); 1/3 N at flowering.",
    irrigation: "5 to 6 irrigations at critical growth stages: Crown Root Initiation (CRI - 21 DAS), Tillering (40-45 DAS), Jointing (60-65 DAS), Flowering (80-85 DAS), and Milking stage (100-105 DAS).",
    pestsAndDiseases: [
      {
        name: "Yellow Rust (Stripe Rust)",
        symptom: "Yellow pustules arranged in linear stripes on upper leaf surface.",
        remedy: "Spray Propiconazole 25% EC (Tilt) @ 1ml/L immediately on first symptom appearance."
      },
      {
        name: "Termites & Root Aphids",
        symptom: "Drying of seedlings and root chewing.",
        remedy: "Seed treatment with Chlorpyrifos 20% EC @ 4ml/kg seed or Thiamethoxam 30% FS."
      }
    ],
    harvestingTip: "Harvest when straw turns golden yellow and grains become hard with less than 15% moisture to prevent shatter loss."
  },
  {
    id: 'cotton',
    name: "Cotton (कपास / పత్తి)",
    scientificName: "Gossypium hirsutum",
    category: "Cash Crops & Fiber",
    season: "Kharif (June - December)",
    duration: "150 - 180 Days",
    yield: "10 - 16 Quintals / Acre (Seed Cotton)",
    benchmarkPrice: "₹7,121 / Q (Medium), ₹7,521 / Q (Long Staple)",
    tag: "White Gold",
    iconColor: "#0284c7",
    popularVarieties: [
      "Bollgard II Bt Hybrids",
      "RCH 659 / RCH 2",
      "Mallika / Bunny Bt",
      "Shankar 6 (Gujarat)",
      "Suraj / DCH 32"
    ],
    soil: "Deep black cotton soils (Vertisols) with high water-holding capacity and fertile alluvial loam. pH 6.5 - 8.5.",
    climate: "Tropical and subtropical climates with plenty of sunshine. Requires minimum 21°C during germination and 27°C - 35°C during boll formation.",
    seedRate: "1.5 - 2 packets (900g) per acre. Spacing: 90cm × 60cm or 120cm × 45cm.",
    fertilizer: "NPK 120:60:60 kg/ha in 3 split doses + 10 kg Zinc Sulphate + 5 kg Borax/acre. Foliar spray 2% DAP at peak flowering.",
    irrigation: "Drip irrigation at 4-6 days interval. Critical stages: Square formation, flowering, and boll development.",
    pestsAndDiseases: [
      {
        name: "Pink Bollworm (PBW)",
        symptom: "Rosetted flowers, bored bolls, stained lint.",
        remedy: "Install Pheromone traps @ 8/acre. Spray Emamectin Benzoate 5% SG @ 80g/acre or Chlorantraniliprole 18.5% SC @ 60ml/acre."
      },
      {
        name: "Sucking Pests (Thrips, Whitefly, Jassids)",
        symptom: "Upward/downward leaf curling, yellowing, honeydew excretion.",
        remedy: "Spray Diafenthiuron 50% WP @ 250g/acre or Flonicamid 50% WG @ 80g/acre."
      }
    ],
    harvestingTip: "Pick fully opened bolls during dry morning hours. Store clean cotton free of leaf trash in moisture-proof godowns."
  },
  {
    id: 'chilli',
    name: "Red Chilli (लाल मिर्च / మిరప)",
    scientificName: "Capsicum annuum",
    category: "Spices & Condiments",
    season: "Kharif / Late Kharif (August - February)",
    duration: "150 - 180 Days (Multiple Pickings)",
    yield: "18 - 25 Quintals / Acre (Dry Chilli)",
    benchmarkPrice: "₹13,500 – ₹18,000 / Q (Mandi Rate)",
    tag: "High Value Spice",
    iconColor: "#dc2626",
    popularVarieties: [
      "Guntur Teja (S10 / 334)",
      "Byadgi (Dabbi / Kaddi)",
      "G4 (Bhagyalakshmi)",
      "Devanur Deluxe",
      "Arka Meghana (F1)"
    ],
    soil: "Well-drained rich sandy loam to clay loam with high organic matter. pH 6.0 - 7.5.",
    climate: "Warm and humid climate. Temperature 20°C - 30°C. Excessive rain leads to flower drop.",
    seedRate: "200-250g seeds/acre for nursery bed raising. Transplant 30-35 days old seedlings at 60cm × 45cm spacing.",
    fertilizer: "NPK 150:80:80 kg/ha. Apply 25 tonnes FYM + Neem cake 100kg/acre. Top dress N in 4 splits.",
    irrigation: "Light and frequent irrigation. Drip fertigation with 19:19:19 and Calcium Nitrate gives 40% higher fruit set.",
    pestsAndDiseases: [
      {
        name: "Black Thrips (Thrips parvispinus)",
        symptom: "Severe leaf scraping, upward curling, flower drop, deformed pods.",
        remedy: "Install 25 Blue sticky traps/acre. Spray Spinetoram 11.7% SC @ 160ml/acre or Broflanilide 300 SC @ 20ml/acre."
      },
      {
        name: "Fruit Rot / Anthracnose",
        symptom: "Sunken dark spots with concentric rings on ripe red pods.",
        remedy: "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 200ml/acre or Mancozeb 75% WP @ 2.5g/L."
      }
    ],
    harvestingTip: "Pick ripe red fruits periodically. Dry on clean polythene tarpaulins for 10-15 days until moisture reduces to 10%."
  },
  {
    id: 'maize',
    name: "Maize / Corn (मक्का / మొక్కజొన్న)",
    scientificName: "Zea mays",
    category: "Cereals & Grains",
    season: "Kharif, Rabi & Spring",
    duration: "95 - 115 Days",
    yield: "28 - 36 Quintals / Acre",
    benchmarkPrice: "₹2,090 / Q (Govt MSP)",
    tag: "Queen of Cereals",
    iconColor: "#eab308",
    popularVarieties: [
      "Pioneer P3396 / P3501",
      "DKC 9108 / 9144",
      "Ganga 11 / HQPM 1 (Protein Rich)",
      "Bio 9681",
      "NK 6240"
    ],
    soil: "Deep, fertile sandy loam to silty clay loam with excellent surface drainage. pH 5.8 - 7.5.",
    climate: "Warm sunny weather with 22°C - 32°C. Very sensitive to water stagnation at seedling stage.",
    seedRate: "7-8 kg/acre. Spacing: 60cm between rows × 20cm between plants.",
    fertilizer: "NPK 120:60:40 kg/ha. Apply Zinc Sulphate @ 10 kg/acre basal. Top dress N at knee-high and tasseling stages.",
    irrigation: "Critical moisture stages: Knee-high stage, Tasseling, Silking, and Grain filling stage.",
    pestsAndDiseases: [
      {
        name: "Fall Armyworm (FAW)",
        symptom: "Ragged leaf holes, heavy frass in whorls, chewed cob silk.",
        remedy: "Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L or Spinetoram 11.7% SC @ 0.5ml/L directed into leaf whorls."
      }
    ],
    harvestingTip: "Harvest when cob sheath dries up to papery white and the black layer forms at the grain base."
  },
  {
    id: 'soybean',
    name: "Soybean (सोयाबीन / సోయాబీన్)",
    scientificName: "Glycine max",
    category: "Oilseeds & Pulses",
    season: "Kharif (June - October)",
    duration: "90 - 105 Days",
    yield: "10 - 14 Quintals / Acre",
    benchmarkPrice: "₹4,892 / Q (Govt MSP)",
    tag: "Golden Bean",
    iconColor: "#65a30d",
    popularVarieties: [
      "JS 9560",
      "JS 335",
      "NRC 37 / NRC 127",
      "DSb 21",
      "MACS 1407"
    ],
    soil: "Well-drained medium to deep black soil with good organic carbon. pH 6.5 - 7.5.",
    climate: "25°C - 32°C temperature with 600-800mm rainfall well-distributed during vegetative and pod-filling stages.",
    seedRate: "25-30 kg/acre. Seed treatment with Rhizobium japonicum + Trichoderma viride @ 5g/kg seed.",
    fertilizer: "NPK 20:60:40:20 (N:P:K:S) kg/ha. Being a legume, soybean fixes atmospheric nitrogen.",
    irrigation: "Mainly rainfed; supplemental irrigation required if dry spells occur during flowering and pod development.",
    pestsAndDiseases: [
      {
        name: "Girdle Beetle & Stem Fly",
        symptom: "Girdling cuts on petiole/stem causing wilting above the cut.",
        remedy: "Spray Thiamethoxam 12.6% + Lambda Cyhalothrin 9.5% ZC @ 60ml/acre."
      },
      {
        name: "Yellow Mosaic Virus (YMV)",
        symptom: "Alternate green and yellow patches on leaves transmitted by whiteflies.",
        remedy: "Control whitefly vectors using Acetamiprid 20% SP @ 50g/acre or Spiromesifen 22.9% SC."
      }
    ],
    harvestingTip: "Harvest when leaves turn yellow and drop off, and pods produce rattling sound upon shaking."
  },
  {
    id: 'groundnut',
    name: "Groundnut / Peanut (मूंगफली / వేరుశనగ)",
    scientificName: "Arachis hypogaea",
    category: "Oilseeds",
    season: "Kharif (Rainfed) / Rabi-Summer (Irrigated)",
    duration: "105 - 120 Days",
    yield: "14 - 20 Quintals / Acre (Pods)",
    benchmarkPrice: "₹6,783 / Q (Govt MSP)",
    tag: "Rich Protein Oilseed",
    iconColor: "#b45309",
    popularVarieties: [
      "Kadiri 6 (K6) / Kadiri 9",
      "TMV 2 / TMV 7",
      "JL 24 (Phule Pragati)",
      "TAG 24",
      "GG 20 (Gujarat Groundnut)"
    ],
    soil: "Light, well-drained sandy loam or red sandy loam rich in calcium. pH 6.0 - 7.0.",
    climate: "Warm sunny climate (25°C - 32°C). High sunshine during pod development accelerates oil synthesis.",
    seedRate: "40-50 kg kernels/acre. Spacing: 30cm × 10cm.",
    fertilizer: "NPK 20:40:40 kg/ha + Gypsum @ 200 kg/acre applied at pegging stage (40-45 DAS) for superior pod development.",
    irrigation: "Critical stages: Flowering, Peg penetration, and Pod formation. Avoid waterlogging.",
    pestsAndDiseases: [
      {
        name: "Tikka Leaf Spot",
        symptom: "Small dark circular spots on leaves surrounded by yellow halos.",
        remedy: "Spray Hexaconazole 5% EC @ 2ml/L or Tebuconazole 25.9% EC @ 1ml/L."
      }
    ],
    harvestingTip: "Harvest when inner shell turns dark brown / blackish and kernel seed coat turns typical pink."
  },
  {
    id: 'turmeric',
    name: "Turmeric (हल्दी / పసుపు)",
    scientificName: "Curcuma longa",
    category: "Spices & Condiments",
    season: "Kharif Planting (May - July) → Feb - April Harvest",
    duration: "240 - 270 Days (8 - 9 Months)",
    yield: "25 - 32 Quintals / Acre (Cured Dry)",
    benchmarkPrice: "₹12,800 – ₹16,500 / Q (Market Rate)",
    tag: "Golden Spice",
    iconColor: "#f59e0b",
    popularVarieties: [
      "Salem",
      "Nizamabad Local / Armoor",
      "Erode Finger (GI Tagged)",
      "Pratibha (High Curcumin)",
      "Duggirala Red",
      "IISR Alleppey Supreme"
    ],
    soil: "Well-drained rich friable loam, clay loam, or red loam with high organic humus. pH 5.5 - 7.5.",
    climate: "Warm and humid tropical climate (20°C - 35°C) with copious rain or assured irrigation.",
    seedRate: "800 - 1000 kg mother / finger rhizomes per acre. Spacing: 45cm × 15cm on raised beds with mulch.",
    fertilizer: "NPK 120:60:120 kg/ha + 10 tonnes FYM + 200 kg Neem cake per acre.",
    irrigation: "Irrigate every 7-10 days. Organic mulching with green leaves (5 tonnes/acre) is essential.",
    pestsAndDiseases: [
      {
        name: "Rhizome Rot / Soft Rot",
        symptom: "Yellowing leaves, rotten foul-smelling rhizomes at base.",
        remedy: "Seed rhizome treatment with Metalaxyl + Mancozeb (Ridomil MZ) @ 2.5g/L and soil drenching."
      }
    ],
    harvestingTip: "Harvest when leaves turn yellow and dry completely. Boil rhizomes in clean water for 45-60 min and sun-dry for 10-15 days."
  },
  {
    id: 'tomato',
    name: "Tomato (टमाटर / టమోటా)",
    scientificName: "Solanum lycopersicum",
    category: "Vegetables",
    season: "Kharif, Rabi & Summer (Year-Round)",
    duration: "90 - 120 Days",
    yield: "220 - 320 Quintals (Crates) / Acre",
    benchmarkPrice: "₹1,200 – ₹2,400 / Q (Dynamic)",
    tag: "High Turnover Vegetable",
    iconColor: "#ef4444",
    popularVarieties: [
      "Arka Rakshak (Triple Disease Resistant)",
      "Abhinav (Syngenta)",
      "US 440",
      "Shivam (Namdhari)",
      "Heemsohna"
    ],
    soil: "Well-drained fertile sandy loam to clay loam rich in organic matter. pH 6.0 - 7.0.",
    climate: "18°C - 28°C moderate warm temperature. Night temperatures below 13°C cause poor fruit set.",
    seedRate: "60-80g seeds/acre. Transplant 25-day old seedlings on raised beds with drip irrigation and silver mulch.",
    fertilizer: "NPK 150:100:120 kg/ha with weekly fertigation (19:19:19 and 0:0:50).",
    irrigation: "Daily drip irrigation for 1-2 hours depending on weather.",
    pestsAndDiseases: [
      {
        name: "Early & Late Blight",
        symptom: "Concentric dark brown rings on lower leaves; water-soaked fruit spots.",
        remedy: "Spray Mancozeb 75% WP @ 2g/L or Dimethomorph 50% WP @ 1g/L."
      },
      {
        name: "Tomato Leaf Curl Virus (TLCV)",
        symptom: "Severe stunting, puckering, and upward leaf curling spread by whiteflies.",
        remedy: "Yellow sticky traps @ 20/acre + Spray Diafenthiuron 50% WP @ 250g/acre."
      }
    ],
    harvestingTip: "Harvest at breaker/pink stage for distant markets or full red ripe stage for local mandi."
  },
  {
    id: 'onion',
    name: "Onion (प्याज / ఉల్లిపాయ)",
    scientificName: "Allium cepa",
    category: "Vegetables",
    season: "Kharif (June-Oct), Late Kharif (Sept-Feb), Rabi (Nov-April)",
    duration: "110 - 130 Days",
    yield: "110 - 150 Quintals / Acre",
    benchmarkPrice: "₹1,800 – ₹2,800 / Q (APMC Rate)",
    tag: "Essential Bulb Crop",
    iconColor: "#ec4899",
    popularVarieties: [
      "Bhima Super / Bhima Dark Red",
      "N-53 (Niphad 53)",
      "Agrifound Dark Red",
      "Bellary Red",
      "Arka Kalyan"
    ],
    soil: "Deep, friable, well-drained loamy soil with rich humus content. pH 6.5 - 7.8.",
    climate: "Mild cool weather during early vegetative growth and warm dry weather for bulb maturity and curing.",
    seedRate: "3.5 - 4 kg seeds/acre for nursery seedling production. Spacing: 15cm × 10cm.",
    fertilizer: "NPK 100:50:80 kg/ha + Sulphur @ 30 kg/acre (essential for pungent taste and storage durability).",
    irrigation: "Light irrigation every 5-7 days. Stop irrigation 10-15 days prior to harvest.",
    pestsAndDiseases: [
      {
        name: "Onion Thrips (Thrips tabaci)",
        symptom: "Silvery white blotches and blotched twisted leaves.",
        remedy: "Spray Fipronil 5% SC @ 30ml/15L water or Spinetoram 11.7% SC."
      },
      {
        name: "Purple Blotch",
        symptom: "Purple sunken lesions on leaves and seed stalks.",
        remedy: "Spray Tebuconazole 25.9% EC @ 1ml/L or Mancozeb @ 2.5g/L."
      }
    ],
    harvestingTip: "Harvest when 50% of the tops fall over (neck fall). Cure bulbs in shade with foliage for 5-7 days before clipping tops."
  },
  {
    id: 'potato',
    name: "Potato (आलू / బంగాళాదుంప)",
    scientificName: "Solanum tuberosum",
    category: "Vegetables & Tubers",
    season: "Rabi (October - February)",
    duration: "90 - 110 Days",
    yield: "120 - 180 Quintals / Acre",
    benchmarkPrice: "₹1,200 – ₹1,800 / Q (Govt Rate)",
    tag: "King of Vegetables",
    iconColor: "#ca8a04",
    popularVarieties: [
      "Kufri Jyoti",
      "Kufri Pukhraj",
      "Kufri Bahar (3797)",
      "Kufri Chipsona 1 / 3 (Processing)",
      "Kufri Mohan"
    ],
    soil: "Well-drained, loose friable sandy loam rich in organic matter. pH 5.2 - 6.8.",
    climate: "Cool climate with 15°C - 20°C daytime and 12°C - 15°C night temperature for optimal tuberization.",
    seedRate: "12 - 15 Quintals of certified seed tubers (30-40g each) per acre. Spacing: 60cm × 20cm.",
    fertilizer: "NPK 150:100:120 kg/ha. Apply full P, K and 50% N at planting; 50% N at earthing up (30 DAS).",
    irrigation: "Light and frequent irrigations. Avoid flooding over ridge crests.",
    pestsAndDiseases: [
      {
        name: "Late Blight (Phytophthora infestans)",
        symptom: "Rapidly spreading water-soaked black lesions on leaves with white mould underneath in foggy humid weather.",
        remedy: "Preventive: Mancozeb 75% WP @ 2.5g/L; Curative: Cymoxanil 8% + Mancozeb 64% WP @ 2g/L."
      }
    ],
    harvestingTip: "Dehaulm (cut tops) 10-12 days before digging to harden tuber skins for long cold-storage life."
  },
  {
    id: 'sugarcane',
    name: "Sugarcane (गन्ना / చెరకు)",
    scientificName: "Saccharum officinarum",
    category: "Cash Crops",
    season: "Autumn / Spring / Adsali",
    duration: "10 - 12 Months",
    yield: "45 - 60 Tonnes / Acre",
    benchmarkPrice: "₹340 / Q (Govt FRP)",
    tag: "High Biomass Crop",
    iconColor: "#15803d",
    popularVarieties: [
      "Co 0238 (Karan 4)",
      "Co 86032 (Nayana)",
      "Co 0118",
      "CoLk 94184",
      "Co 86032"
    ],
    soil: "Deep, rich clay loam, heavy alluvial soil with high water retention and good drainage. pH 6.5 - 8.0.",
    climate: "Tropical warm sunny climate (28°C - 38°C) with abundant water availability.",
    seedRate: "12,000 two-budded setts per acre. Setts treated in Carbendazim solution before planting.",
    fertilizer: "NPK 250:100:120 kg/ha in split doses up to 90 days after planting.",
    irrigation: "15 to 20 irrigations. Drip irrigation with trash mulching saves 45% water.",
    pestsAndDiseases: [
      {
        name: "Early Shoot Borer & Top Borer",
        symptom: "Dead hearts in young shoots; dead bunchy tops in mature cane.",
        remedy: "Soil application of Chlorantraniliprole 0.4% G @ 7.5 kg/acre or Fipronil 0.3% G."
      },
      {
        name: "Red Rot",
        symptom: "Reddish internal stalk discoloration with white transverse bands and sour alcoholic smell.",
        remedy: "Plant certified disease-free setts; dip setts in Trichoderma viride @ 10g/L."
      }
    ],
    harvestingTip: "Harvest at peak sucrose maturity (Brix reading > 18°). Cut canes flush with ground level."
  }
];
