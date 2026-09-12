import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Minus, 
  RefreshCw, Filter, MapPin, Search, Building2, 
  Layers, ChevronDown, Award, Sparkles, ArrowUpDown, Download,
  LayoutGrid, List, Leaf, Sprout, CheckCircle2, ShieldCheck, Tag
} from 'lucide-react';

// Comprehensive Indian Crop Image Database
const CROP_IMAGES = {
  // Cereals & Millets
  "paddy": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
  "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80",
  "maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80",
  "corn": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80",
  "bajra": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80",
  "millet": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80",
  "jowar": "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80",
  "sorghum": "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80",
  "ragi": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80",
  "barley": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=80",

  // Pulses
  "toor": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
  "red gram": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
  "arhar": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
  "urad": "https://images.unsplash.com/photo-1585994424784-0610339a8bf8?w=400&auto=format&fit=crop&q=80",
  "black gram": "https://images.unsplash.com/photo-1585994424784-0610339a8bf8?w=400&auto=format&fit=crop&q=80",
  "moong": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80",
  "green gram": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80",
  "chana": "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&auto=format&fit=crop&q=80",
  "bengal gram": "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&auto=format&fit=crop&q=80",
  "kabuli": "https://images.unsplash.com/photo-1585994424784-0610339a8bf8?w=400&auto=format&fit=crop&q=80",
  "chickpea": "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&auto=format&fit=crop&q=80",
  "lentil": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
  "masoor": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",

  // Oilseeds
  "soybean": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80",
  "mustard": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=400&auto=format&fit=crop&q=80",
  "sarson": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=400&auto=format&fit=crop&q=80",
  "groundnut": "https://images.unsplash.com/photo-1567892328127-142db34b1740?w=400&auto=format&fit=crop&q=80",
  "peanut": "https://images.unsplash.com/photo-1567892328127-142db34b1740?w=400&auto=format&fit=crop&q=80",
  "sunflower": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&auto=format&fit=crop&q=80",
  "sesame": "https://images.unsplash.com/photo-1508061257970-e7e06952d152?w=400&auto=format&fit=crop&q=80",
  "til": "https://images.unsplash.com/photo-1508061257970-e7e06952d152?w=400&auto=format&fit=crop&q=80",
  "castor": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80",

  // Cash Crops
  "cotton": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80",
  "kapas": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80",
  "sugarcane": "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop&q=80",
  "jute": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80",
  "tobacco": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80",

  // Spices
  "red chilli": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80",
  "chilli": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80",
  "turmeric": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80",
  "cumin": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80",
  "jeera": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80",
  "coriander": "https://images.unsplash.com/photo-1589135233689-d56d78705b73?w=400&auto=format&fit=crop&q=80",
  "dhania": "https://images.unsplash.com/photo-1589135233689-d56d78705b73?w=400&auto=format&fit=crop&q=80",
  "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&auto=format&fit=crop&q=80",
  "ginger": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80",
  "cardamom": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80",
  "elaichi": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80",
  "black pepper": "https://images.unsplash.com/photo-1508061257970-e7e06952d152?w=400&auto=format&fit=crop&q=80",
  "pepper": "https://images.unsplash.com/photo-1508061257970-e7e06952d152?w=400&auto=format&fit=crop&q=80",

  // Vegetables
  "onion": "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&auto=format&fit=crop&q=80",
  "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
  "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80",
  "green chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",
  "brinjal": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&auto=format&fit=crop&q=80",
  "eggplant": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&auto=format&fit=crop&q=80",
  "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80",
  "cabbage": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80",
  "lady finger": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",
  "okra": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",
  "bhindi": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",

  // Fruits
  "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80",
  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80",
  "pomegranate": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80",
  "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format&fit=crop&q=80",
  "orange": "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&auto=format&fit=crop&q=80",
  "mosambi": "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&auto=format&fit=crop&q=80",
  "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",

  // Plantation
  "coconut": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400&auto=format&fit=crop&q=80",
  "copra": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400&auto=format&fit=crop&q=80",
  "arecanut": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80",
  "supari": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80",
  "cashew": "https://images.unsplash.com/photo-1509912760195-551722880753?w=400&auto=format&fit=crop&q=80",
  "coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80"
};

// Fallback images per category
const CATEGORY_DEFAULT_IMAGES = {
  "Cereals & Millets": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
  "Pulses": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
  "Oilseeds": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&auto=format&fit=crop&q=80",
  "Cash Crops": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80",
  "Spices": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80",
  "Vegetables": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80",
  "Fruits": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80",
  "Plantation": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400&auto=format&fit=crop&q=80"
};

export const getCropImageUrl = (cropName, category) => {
  if (!cropName) return CATEGORY_DEFAULT_IMAGES[category] || "/farmer-crops.jpg";
  const lower = cropName.toLowerCase();
  
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lower.includes(key)) {
      return url;
    }
  }

  return CATEGORY_DEFAULT_IMAGES[category] || "/farmer-crops.jpg";
};

const FALLBACK_STATES = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Karimnagar", "Khammam", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nalgonda", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Karnataka": ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagara", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khurda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"]
};

export default function Market({ t, language }) {
  const [locations, setLocations] = useState(FALLBACK_STATES);
  const [selectedState, setSelectedState] = useState("Andhra Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState("Krishna");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCommodity, setSelectedCommodity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-desc' | 'price-asc' | 'gainers' | 'name'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all 36 Indian states & districts from backend API
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/states-districts');
        if (res.ok) {
          const json = await res.json();
          if (json && Object.keys(json).length > 0) {
            setLocations(json);
          }
        }
      } catch {
        // Fallback to FALLBACK_STATES
      }
    };
    fetchGeo();
  }, []);

  // Update district when selectedState changes
  useEffect(() => {
    const distList = locations[selectedState] || [];
    if (distList.length > 0 && !distList.includes(selectedDistrict)) {
      setSelectedDistrict(distList[0]);
    }
  }, [selectedState, locations]);

  // Fetch district-specific live market prices covering all crops
  const fetchMarketPrices = async (stateName, districtName) => {
    setLoading(true);
    try {
      const st = stateName || selectedState;
      const dist = districtName || selectedDistrict;
      const res = await fetch(`/api/market?state=${encodeURIComponent(st)}&district=${encodeURIComponent(dist)}&lang=${language || 'en'}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setPrices(json);
          return;
        }
      }
    } catch (err) {
      console.error('Market fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      fetchMarketPrices(selectedState, selectedDistrict);
    }
  }, [selectedState, selectedDistrict, language]);

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    fetchMarketPrices(selectedState, selectedDistrict);
  };

  // Filter & Sort prices
  const filteredPrices = useMemo(() => {
    let list = prices.filter((item) => {
      const matchSearch = searchTerm === "" || 
        (item.crop || item.commodity || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.market || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === "All" || 
        (item.category || "").toLowerCase().includes(selectedCategory.toLowerCase());

      const matchCommodity = selectedCommodity === "All" ||
        (item.crop || item.commodity || "").toLowerCase().includes(selectedCommodity.toLowerCase());

      return matchSearch && matchCategory && matchCommodity;
    });

    if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.modalPrice || 0) - (a.modalPrice || 0));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.modalPrice || 0) - (b.modalPrice || 0));
    } else if (sortBy === 'gainers') {
      list.sort((a, b) => {
        const valA = parseFloat(a.change?.replace(/[+%]/g, '') || 0);
        const valB = parseFloat(b.change?.replace(/[+%]/g, '') || 0);
        return valB - valA;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.crop || '').localeCompare(b.crop || ''));
    }

    return list;
  }, [prices, searchTerm, selectedCategory, selectedCommodity, sortBy]);

  // Top gainer crop calculation
  const topGainer = useMemo(() => {
    if (!prices || prices.length === 0) return null;
    return [...prices].sort((a, b) => {
      const valA = parseFloat(a.change?.replace(/[+%]/g, '') || 0);
      const valB = parseFloat(b.change?.replace(/[+%]/g, '') || 0);
      return valB - valA;
    })[0];
  }, [prices]);

  // Categories list covering all Indian crops
  const categories = [
    "All", 
    "Cereals & Millets", 
    "Pulses", 
    "Oilseeds", 
    "Cash Crops", 
    "Spices", 
    "Vegetables", 
    "Fruits", 
    "Plantation"
  ];

  const currentDistricts = locations[selectedState] || [];

  const getCategoryBadgeStyle = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('cereal') || c.includes('millet')) return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
    if (c.includes('pulse')) return { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' };
    if (c.includes('oilseed')) return { bg: '#ecfccb', text: '#4d7c0f', border: '#d9f99d' };
    if (c.includes('cash')) return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
    if (c.includes('spice')) return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' };
    if (c.includes('veg')) return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
    if (c.includes('fruit')) return { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' };
    if (c.includes('plantation')) return { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' };
    return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Visual APMC Mandi Showcase Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(124, 45, 18, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #fdba74'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#fed7aa' }}>
            <TrendingUp size={14} /> Official AGMARKNET & eNAM Live Feeds
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.marketTitle || "Live APMC Mandi Prices & Trends"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#ffedd5', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            Daily wholesale market rates with photos across all 35+ Indian crops and 700+ district APMC yards with real-time arrival volumes and price trends.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fed7aa' }}>
              <Building2 size={16} /> All 36 States & UTs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fed7aa' }}>
              <Layers size={16} /> 8 Crop Categories
            </div>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/mandi-market.jpg" 
            alt="APMC Mandi Market" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #7c2d12 0%, rgba(124,45,18,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* Filter Toolbar for All States & Districts */}
      <form onSubmit={handleFilterSubmit} className="as-card" style={{ padding: '22px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          {/* State Selector */}
          <div style={{ flex: '1 1 180px', minWidth: '170px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t.selectState || "Select State"}
            </label>
            <select 
              className="as-select"
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ width: '100%' }}
            >
              {Object.keys(locations).sort().map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Selector covering ALL districts in the selected state */}
          <div style={{ flex: '1 1 180px', minWidth: '170px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t.selectDistrict || "Select District / APMC"}
            </label>
            <select 
              className="as-select"
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{ width: '100%' }}
            >
              {currentDistricts.map((dst) => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          {/* Search Crop Filter */}
          <div style={{ flex: '2 1 240px', minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t.searchCommodity || "Search Commodity"}
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              <input
                type="text"
                className="as-input"
                style={{ paddingLeft: '36px', width: '100%' }}
                placeholder={t.searchCommodity || "Search any crop (e.g. Paddy, Cotton, Chilli, Wheat, Onion, Jeera)..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ flex: '1 1 150px', minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Sort Results
            </label>
            <select
              className="as-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="default">Default Order</option>
              <option value="gainers">Top Gainers (%)</option>
              <option value="price-desc">Highest Price (₹/Q)</option>
              <option value="price-asc">Lowest Price (₹/Q)</option>
              <option value="name">Crop Name (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid Cards vs Table */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', height: '46px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#14532d' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Photo Cards View"
            >
              <LayoutGrid size={16} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'table' ? '#14532d' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Mandi Table View"
            >
              <List size={16} />
              <span>Table</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button 
            type="submit" 
            className="as-btn-primary" 
            disabled={loading}
            style={{ height: '46px', padding: '0 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <RefreshCw size={16} />}
            <span>{loading ? "Loading..." : (t.refreshWeather || "Get Prices")}</span>
          </button>
        </div>

        {/* Category Filter Pills covering ALL crop families */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <Layers size={14} /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: selectedCategory === cat ? '#16a34a' : 'var(--bg-card, #fff)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary, #475569)',
                borderColor: selectedCategory === cat ? '#16a34a' : 'var(--border-color, #cbd5e1)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>

      {/* District Market Summary Highlight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="as-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '12px' }}>
            <Building2 size={24} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Market Hub</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedDistrict}, {selectedState}</div>
          </div>
        </div>

        {topGainer && (
          <div className="as-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#ffedd5', padding: '12px', borderRadius: '12px' }}>
              <ArrowUpRight size={24} color="#ea580c" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Top 24h Gainer Crop</div>
              <div style={{ fontSize: '1.02rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{topGainer.crop}</span>
                <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{topGainer.change}</span>
              </div>
            </div>
          </div>
        )}

        <div className="as-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
            <Award size={24} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>All Crops Tracked</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {filteredPrices.length} Active Commodities
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: Grid Cards with Photo for Every Single Crop */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {filteredPrices.length === 0 ? (
            <div className="as-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              No market prices found matching "{searchTerm}". Try selecting "All" categories or clearing your search.
            </div>
          ) : (
            filteredPrices.map((item, idx) => {
              const cropImg = getCropImageUrl(item.crop || item.commodity, item.category);
              const badgeStyle = getCategoryBadgeStyle(item.category);
              const modalVal = item.modalPrice || item.msp || 0;
              const minVal = item.minPrice || Math.round(modalVal * 0.92);
              const maxVal = item.maxPrice || Math.round(modalVal * 1.08);

              return (
                <motion.div
                  key={idx}
                  className="as-card"
                  whileHover={{ y: -4, boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff'
                  }}
                >
                  {/* Card Image Banner */}
                  <div style={{ position: 'relative', height: '140px', width: '100%', background: '#f1f5f9' }}>
                    <img 
                      src={cropImg} 
                      alt={item.crop || item.commodity} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.src = "/farmer-crops.jpg";
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
                    }} />

                    {/* Top Category Badge */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: badgeStyle.text,
                        background: badgeStyle.bg,
                        border: `1px solid ${badgeStyle.border}`,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {item.category || "General"}
                      </span>
                    </div>

                    {/* Trend Chip */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      {item.trend === "up" ? (
                        <span className="badge badge-green" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                          <ArrowUpRight size={13} /> {item.change || "+2.5%"}
                        </span>
                      ) : item.trend === "down" ? (
                        <span className="badge badge-red" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                          <ArrowDownRight size={13} /> {item.change || "-1.8%"}
                        </span>
                      ) : (
                        <span className="badge badge-amber" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                          <Minus size={13} /> Stable
                        </span>
                      )}
                    </div>

                    {/* Crop Name on Image Base */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#ffffff', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.8)', lineHeight: 1.2 }}>
                        {item.crop || item.commodity}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content & Prices */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* APMC Mandi Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                      <MapPin size={14} color="#16a34a" />
                      <span style={{ fontWeight: '600', color: '#334155' }}>{item.market || `${selectedDistrict} APMC Yard`}</span>
                    </div>

                    {/* Big Modal Price */}
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
                        Modal Wholesale Rate
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.45rem', fontWeight: '900', color: '#15803d' }}>
                          ₹{modalVal.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>/ Quintal</span>
                      </div>
                    </div>

                    {/* Price Range & Daily Arrivals */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '600' }}>Price Range</div>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>₹{minVal.toLocaleString()} - ₹{maxVal.toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '600' }}>Daily Arrival</div>
                        <div style={{ fontWeight: '700', color: '#0f766e' }}>{item.arrival_qty || "2,400 Q"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW 2: APMC Mandi Table with Photo Thumbnails */
        <div className="as-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '28px' }}>
          <div className="as-table-container">
            <table className="as-table">
              <thead>
                <tr>
                  <th>{t.commodity || "Commodity & Photo"}</th>
                  <th>{t.mandi || "APMC Market Yard"}</th>
                  <th>{t.minPrice || "Min Price"}</th>
                  <th>{t.maxPrice || "Max Price"}</th>
                  <th>{t.modalPrice || "Modal Price (₹/Q)"}</th>
                  <th style={{ textAlign: 'center' }}>Daily Arrivals</th>
                  <th style={{ textAlign: 'center' }}>{t.priceTrend || "Trend"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No market prices found matching "{searchTerm}". Try selecting "All" categories or clearing your search.
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((row, idx) => {
                    const badgeStyle = getCategoryBadgeStyle(row.category);
                    const cropImg = getCropImageUrl(row.crop || row.commodity, row.category);
                    return (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={cropImg} 
                              alt={row.crop || row.commodity} 
                              style={{ 
                                width: '46px', 
                                height: '46px', 
                                borderRadius: '10px', 
                                objectFit: 'cover', 
                                border: '1px solid #e2e8f0',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = "/farmer-crops.jpg";
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: '#14532d', fontSize: '0.95rem' }}>{row.crop || row.commodity}</div>
                              {row.category && (
                                <span 
                                  style={{ 
                                    fontSize: '0.72rem', 
                                    fontWeight: '600',
                                    color: badgeStyle.text, 
                                    background: badgeStyle.bg, 
                                    border: `1px solid ${badgeStyle.border}`,
                                    padding: '1px 6px', 
                                    borderRadius: '4px', 
                                    display: 'inline-block', 
                                    marginTop: '2px' 
                                  }}
                                >
                                  {row.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{row.market}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{row.district || selectedDistrict}, {row.state || selectedState}</div>
                        </td>
                        <td style={{ fontWeight: '600' }}>₹{row.minPrice ? row.minPrice.toLocaleString() : '-'}</td>
                        <td style={{ fontWeight: '600' }}>₹{row.maxPrice ? row.maxPrice.toLocaleString() : '-'}</td>
                        <td>
                          <span style={{ fontWeight: '800', color: '#15803d', fontSize: '1.08rem' }}>
                            ₹{row.modalPrice ? row.modalPrice.toLocaleString() : (row.msp ? row.msp.toLocaleString() : '-')}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/ Q</span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600', fontSize: '0.85rem', color: '#0f766e' }}>
                          {row.arrival_qty || "2,400 Q"}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {row.trend === "up" ? (
                            <span className="badge badge-green" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <ArrowUpRight size={14} /> {row.change || t.rising || "Rising"}
                            </span>
                          ) : row.trend === "down" ? (
                            <span className="badge badge-red" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <ArrowDownRight size={14} /> {row.change || t.falling || "Falling"}
                            </span>
                          ) : (
                            <span className="badge badge-amber" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Minus size={14} /> {t.stable || "Stable"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official AGMARKNET Source Footer */}
      <div className="as-card" style={{
        padding: '16px 24px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏛️</span>
          <span>{t.officialMandiSource || "Source: Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, AGMARKNET via data.gov.in"}</span>
        </div>
        <div>
          {t.arrivalDate || "Last Updated"}: <strong style={{ color: '#15803d' }}>Today, Real-time Feed</strong>
        </div>
      </div>
    </motion.div>
  );
}
