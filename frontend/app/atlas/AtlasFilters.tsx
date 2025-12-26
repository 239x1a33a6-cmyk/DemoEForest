
'use client';

import { useState, useEffect } from 'react';
import { forestRightsData } from './ForestRightsData';

interface AtlasFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function AtlasFilters({ onFilterChange }: AtlasFiltersProps) {
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    village: '',
    tribalGroup: '',
    claimStatus: '',
  });

  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Create statesData from forestRightsData
  const statesData = forestRightsData.reduce((acc, stateData) => {
    acc[stateData.stateCode] = {
      name: stateData.state,
      districts: getDistrictsForState(stateData.stateCode),
      villages: getVillagesForState(stateData.stateCode),
      districtTribalGroups: getDistrictTribalGroupsForState(stateData.stateCode),
      tribalGroups: getTribalGroupsForState(stateData.stateCode)
    };
    return acc;
  }, {} as any);

  // Helper functions to get district, village, and tribal group data
  function getDistrictsForState(stateCode: string): string[] {
    const districtMap: { [key: string]: string[] } = {
      'jh': ['Ranchi', 'East Singhbhum', 'West Singhbhum', 'Bokaro', 'Deoghar', 'Dumka', 'Giridih', 'Godda', 'Hazaribagh', 'Dhanbad', 'Chatra', 'Garhwa', 'Gumla', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega'],
      'mp': ['Dindori', 'Mandla', 'Jhabua', 'Balaghat', 'Betul', 'Chhindwara', 'Seoni', 'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Barwani', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Katni', 'Khandwa', 'Khargone', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'],
      'or': ['Mayurbhanj', 'Sundargarh', 'Koraput', 'Kandhamal', 'Kalahandi', 'Rayagada', 'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kendrapara', 'Kendujhar', 'Khordha', 'Malkangiri', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Sambalpur', 'Subarnapur'],
      'tr': ['West Tripura', 'North Tripura', 'South Tripura', 'Dhalai', 'Gomati', 'Khowai', 'Sepahijala', 'Unakoti'],
      'tg': ['Adilabad', 'Khammam', 'Mulugu', 'Bhadradri Kothagudem', 'Jayashankar Bhupalpally', 'Mahabubabad', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Komaram Bheem Asifabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'],
      'ap': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
      'as': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metro', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
      'br': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
      'cg': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'],
      'ga': ['North Goa', 'South Goa'],
      'gj': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
      'hp': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
      'ka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
      'kl': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
      'mh': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
      'rj': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
      'tn': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
      'up': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
      'uk': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
      'wb': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
      'jk': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur']
    };
    return districtMap[stateCode] || [];
  }

  function getVillagesForState(stateCode: string): { [key: string]: string[] } {
    // For now, return empty villages for all states except the original 5
    // This can be expanded later with actual village data
    const villageMap: { [key: string]: { [key: string]: string[] } } = {
      'jh': {
        'Ranchi': ['Angara', 'Bero', 'Bundu', 'Chanho', 'Kanke', 'Lapung', 'Mandar', 'Namkum', 'Ormanjhi', 'Rania', 'Sonahatu', 'Tamar'],
        'East Singhbhum': ['Baharagora', 'Chakulia', 'Dhalbhumgarh', 'Ghatshila', 'Gurabandha', 'Jamshedpur', 'Musabani', 'Patamda', 'Potka'],
        'West Singhbhum': ['Chakradharpur', 'Chaibasa', 'Goilkera', 'Hatgamharia', 'Jagannathpur', 'Jhinkpani', 'Khuntpani', 'Kumardungi', 'Majhgaon', 'Manjhari', 'Noamundi', 'Sonua', 'Tonto', 'Tulin'],
        'Bokaro': ['Bermo', 'Chandankiyari', 'Jaridih', 'Kasmar', 'Petarwar', 'Pirtand'],
        'Deoghar': ['Deoghar', 'Madhupur', 'Mohanpur', 'Palojori', 'Sarwan', 'Sonaraithari'],
        'Dumka': ['Dumka', 'Gopikander', 'Jama', 'Jarmundi', 'Kathikund', 'Masalia', 'Ramgarh', 'Ranishwar', 'Shikaripara'],
        'Giridih': ['Giridih', 'Bengabad', 'Birni', 'Deori', 'Dhanwar', 'Dumri', 'Gandey', 'Gawan', 'Jamua', 'Pirtand'],
        'Godda': ['Godda', 'Boarijor', 'Mahagama', 'Meherma', 'Pathargama', 'Poreyahat', 'Sundarpahari', 'Thakurgangti'],
        'Hazaribagh': ['Hazaribagh', 'Barhi', 'Churchu', 'Ichak', 'Katkamsandi', 'Padma', 'Bishnugarh', 'Keredari'],
        'Dhanbad': ['Dhanbad', 'Jharia', 'Baghmara', 'Baliapur', 'Govindpur', 'Nirsa', 'Topchanchi']
      },
      'mp': {
        'Dindori': ['Amarpur', 'Bajag', 'Karanjia', 'Mehandwani', 'Samnapur', 'Shahpura'],
        'Mandla': ['Bichhiya', 'Ghughri', 'Narayanganj', 'Nainpur', 'Narayanpur'],
        'Jhabua': ['Alirajpur', 'Jobat', 'Kathiwara', 'Meghnagar', 'Petlawad', 'Ranapur', 'Thandla'],
        'Balaghat': ['Balaghat', 'Baihar', 'Birsa', 'Katangi', 'Khairlanji', 'Lalbarra', 'Lanji', 'Paraswada', 'Waraseoni'],
        'Betul': ['Betul', 'Amla', 'Bhainsdehi', 'Chicholi', 'Ghoradongri', 'Multai', 'Prabhat Pattan', 'Shahpur'],
        'Chhindwara': ['Chhindwara', 'Amarwara', 'Bichhiya', 'Chaurai', 'Harrai', 'Junnardeo', 'Mohkhed', 'Pandhurna', 'Parasia', 'Sausar', 'Tamia'],
        'Seoni': ['Seoni', 'Barghat', 'Dhuma', 'Ghansour', 'Keolari', 'Kurai', 'Lakhnadon']
      },
      'or': {
        'Mayurbhanj': ['Badasahi', 'Bangriposi', 'Baripada', 'Betanoti', 'Bijatala', 'Bisoi', 'Gopabandhunagar', 'Jashipur', 'Karanjia', 'Khunta', 'Kuliana', 'Kusumi', 'Moroda', 'Rairangpur', 'Raruan', 'Samakhunta', 'Suliapada', 'Thakurmunda', 'Tiring', 'Udala'],
        'Sundargarh': ['Balisankara', 'Bargaon', 'Bisra', 'Bonai', 'Gurundia', 'Hemgir', 'Koida', 'Kuanrmunda', 'Kutra', 'Lahunipara', 'Lathikata', 'Lefripada', 'Nuagaon', 'Rajgangpur', 'Subdega', 'Tangarpali'],
        'Koraput': ['Bandhugaon', 'Borigumma', 'Dasmantpur', 'Jeypore', 'Kotpad', 'Kundra', 'Lamtaput', 'Laxmipur', 'Narayanpatna', 'Nandapur', 'Pottangi', 'Semiliguda'],
        'Kandhamal': ['Baliguda', 'Chakapad', 'Daringbadi', 'G Udayagiri', 'Khajuripada', 'Kotagarh', 'Nuagaon', 'Phiringia', 'Phulbani', 'Raikia', 'Tikabali', 'Tumudibandha'],
        'Kalahandi': ['Bhawanipatna', 'Dharamgarh', 'Golamunda', 'Jaipatna', 'Junagarh', 'Kalampur', 'Karlamunda', 'Kesinga', 'Koksara', 'Lanjigarh', 'M Rampur', 'Narla', 'Thuamul Rampur'],
        'Rayagada': ['Rayagada', 'Ambadola', 'Bisam Cuttack', 'Chandrapur', 'Gunupur', 'Gudari', 'Kalyani Singhpur', 'Kolnara', 'Muniguda', 'Padmapur', 'Ramanaguda']
      },
      'tr': {
        'West Tripura': ['Agartala', 'Bishalgarh', 'Boxanagar', 'Jirania', 'Khayerpur', 'Mandwi', 'Mohanpur', 'Old Agartala', 'Ranirbazar', 'Sidhai'],
        'North Tripura': ['Dharmanagar', 'Kailashahar', 'Kadamtala', 'Panisagar', 'Kumarghat'],
        'South Tripura': ['Belonia', 'Rajnagar', 'Rupaichhari', 'Sabroom', 'Satchand', 'Udaipur'],
        'Dhalai': ['Ambassa', 'Kamalpur', 'Salema', 'Dumburnagar', 'Chhamanu', 'Manu', 'Longtharai Valley', 'Gandacherra'],
        'Gomati': ['Udaipur', 'Amarpur', 'Karbook', 'Matabari', 'Kakraban', 'Rupaichhari', 'Rajnagar', 'Ompi'],
        'Khowai': ['Khowai', 'Kalyanpur', 'Teliamura', 'Mungiakami', 'Padmabil', 'Champaknagar'],
        'Sepahijala': ['Bishramganj', 'Melaghar', 'Sonamura', 'Boxanagar', 'Kathalia', 'Nalchar'],
        'Unakoti': ['Kailashahar', 'Kumarghat', 'Pecharthal', 'Fatikroy', 'Chandipur', 'Gournagar']
      },
      'tg': {
        'Adilabad': ['Asifabad', 'Bela', 'Boath', 'Gudihathnoor', 'Ichoda', 'Jainoor', 'Kerameri', 'Kubeer', 'Mudhole', 'Narnoor', 'Tamsi', 'Talamadugu', 'Utnoor', 'Wankidi'],
        'Khammam': ['Aswaraopeta', 'Bhadrachalam', 'Burgampahad', 'Chintoor', 'Dummugudem', 'Gundala', 'Julurpad', 'Kukunoor', 'Kunavaram', 'Madhira', 'Mudigonda', 'Nelakondapalli', 'Penuballi', 'Pinapaka', 'Raghunathapalem', 'Singareni', 'Sujathanagar', 'Thirumalayapalem', 'Tirumalayapalem', 'Velairpadu', 'Wyra', 'Yellandu'],
        'Mulugu': ['Eturnagaram', 'Govindaraopet', 'Mangapet', 'Mulugu', 'Tadvai', 'Venkatapuram', 'Wazeedu'],
        'Bhadradri Kothagudem': ['Kothagudem', 'Aswapuram', 'Bhadrachalam', 'Burgampahad', 'Chandrugonda', 'Chintoor', 'Dummugudem', 'Julurpad'],
        'Jayashankar Bhupalpally': ['Bhupalpally', 'Eturnagaram', 'Jayashankar', 'Kataram', 'Mahabubabad', 'Mulugu', 'Regonda', 'Tekumatla', 'Venkatapuram'],
        'Mahabubabad': ['Mahabubabad', 'Bayyaram', 'Dornakal', 'Garla', 'Kesamudram', 'Kuravi', 'Nellikudur', 'Thorrur']
      }
    };
    return villageMap[stateCode] || {};
  }

  function getDistrictTribalGroupsForState(stateCode: string): { [key: string]: string[] } {
    const tribalGroupMap: { [key: string]: { [key: string]: string[] } } = {
      'jh': {
        'Ranchi': ['Oraon', 'Munda', 'Kharia', 'Chero'],
        'East Singhbhum': ['Ho', 'Santhal', 'Bhumij', 'Mahali'],
        'West Singhbhum': ['Ho', 'Munda', 'Santhal', 'Bhumij'],
        'Bokaro': ['Santhal', 'Oraon', 'Munda'],
        'Deoghar': ['Santhal', 'Paharia', 'Mal Paharia'],
        'Dumka': ['Santhal', 'Paharia', 'Mal Paharia'],
        'Giridih': ['Santhal', 'Oraon', 'Munda'],
        'Godda': ['Santhal', 'Paharia', 'Mal Paharia'],
        'Hazaribagh': ['Oraon', 'Chero', 'Kharwar'],
        'Dhanbad': ['Santhal', 'Oraon', 'Munda']
      },
      'mp': {
        'Dindori': ['Gond', 'Baiga', 'Agaria'],
        'Mandla': ['Gond', 'Baiga', 'Bhariya'],
        'Jhabua': ['Bhil', 'Bhilala', 'Barela'],
        'Balaghat': ['Gond', 'Baiga', 'Halba'],
        'Betul': ['Gond', 'Korku', 'Nihal'],
        'Chhindwara': ['Gond', 'Korku', 'Baiga'],
        'Seoni': ['Gond', 'Baiga', 'Agaria']
      },
      'or': {
        'Mayurbhanj': ['Santhal', 'Ho', 'Bhumij', 'Bathudi', 'Bhuyan'],
        'Sundargarh': ['Oraon', 'Munda', 'Kharia', 'Kisan'],
        'Koraput': ['Kondh', 'Paroja', 'Gadaba', 'Bonda'],
        'Kandhamal': ['Kondh', 'Soura', 'Paroja'],
        'Kalahandi': ['Kondh', 'Gond', 'Mirdha'],
        'Rayagada': ['Kondh', 'Soura', 'Jatapu']
      },
      'tr': {
        'West Tripura': ['Tripuri', 'Reang', 'Jamatia'],
        'North Tripura': ['Tripuri', 'Reang', 'Halam'],
        'South Tripura': ['Tripuri', 'Reang', 'Jamatia'],
        'Dhalai': ['Tripuri', 'Reang', 'Halam', 'Chakma'],
        'Gomati': ['Tripuri', 'Reang', 'Jamatia'],
        'Khowai': ['Tripuri', 'Reang', 'Halam'],
        'Sepahijala': ['Tripuri', 'Reang', 'Jamatia'],
        'Unakoti': ['Tripuri', 'Reang', 'Halam']
      },
      'tg': {
        'Adilabad': ['Gond', 'Kolam', 'Pradhan', 'Thoti'],
        'Khammam': ['Koya', 'Gond', 'Lambada'],
        'Mulugu': ['Gond', 'Koya', 'Lambada'],
        'Bhadradri Kothagudem': ['Koya', 'Gond', 'Lambada'],
        'Jayashankar Bhupalpally': ['Gond', 'Koya', 'Lambada'],
        'Mahabubabad': ['Gond', 'Koya', 'Lambada']
      }
    };
    return tribalGroupMap[stateCode] || {};
  }

  function getTribalGroupsForState(stateCode: string): string[] {
    const tribalGroupsMap: { [key: string]: string[] } = {
      'jh': ['Santhal', 'Oraon', 'Munda', 'Ho', 'Kharia', 'Mahali', 'Bhumij', 'Kharwar', 'Chero', 'Gond', 'Paharia', 'Mal Paharia'],
      'mp': ['Bhil', 'Gond', 'Kol', 'Korku', 'Baiga', 'Sahariya', 'Bhariya', 'Halba', 'Kamar', 'Bhilala', 'Barela', 'Agaria', 'Nihal'],
      'or': ['Santhal', 'Kol', 'Bhumij', 'Bathudi', 'Bhuyan', 'Gond', 'Ho', 'Kharia', 'Kisan', 'Koya', 'Munda', 'Oraon', 'Paroja', 'Saora', 'Kondh', 'Soura', 'Gadaba', 'Bonda', 'Jatapu', 'Mirdha'],
      'tr': ['Tripuri', 'Reang', 'Jamatia', 'Chakma', 'Halam', 'Mog', 'Munda', 'Kuki', 'Garo', 'Lushai'],
      'tg': ['Gond', 'Koya', 'Pradhan', 'Lambada', 'Yerukala', 'Chenchu', 'Kolam', 'Thoti', 'Bagata', 'Gadaba'],
      'ap': ['Chenchu', 'Koya', 'Kondareddy', 'Savara', 'Bagata', 'Gadaba', 'Porja', 'Khond', 'Konda Dora', 'Valmiki'],
      'as': ['Bodo', 'Karbi', 'Mising', 'Rabha', 'Sonowal Kachari', 'Tiwa', 'Deori', 'Dimasa', 'Garo', 'Hajong', 'Hmar', 'Kuki', 'Lalung', 'Mech', 'Mikir', 'Singpho'],
      'br': ['Santhal', 'Oraon', 'Munda', 'Kharia', 'Mahali', 'Bhumij', 'Kharwar', 'Chero', 'Gond', 'Paharia', 'Mal Paharia'],
      'cg': ['Gond', 'Halba', 'Kamara', 'Kawar', 'Korku', 'Munda', 'Oraon', 'Santhal', 'Bhatra', 'Binjhwar', 'Bhumij', 'Bhuiya', 'Dhanwar', 'Gadaba', 'Ganda', 'Kol', 'Kondh', 'Koya', 'Maria', 'Muria', 'Paroja', 'Sora'],
      'ga': ['Gowda', 'Kunbi', 'Velip', 'Dhodia', 'Dubla', 'Naikda', 'Siddi', 'Varli'],
      'gj': ['Bhil', 'Gond', 'Kol', 'Korku', 'Baiga', 'Sahariya', 'Bhariya', 'Halba', 'Kamar', 'Bhilala', 'Barela', 'Agaria', 'Nihal'],
      'hp': ['Gaddi', 'Gujjar', 'Lahaula', 'Kinnauri', 'Pangwala', 'Swangla', 'Bhot', 'Bodh'],
      'ka': ['Solaniga', 'Jenu Kuruba', 'Kadu Kuruba', 'Yerava', 'Koraga', 'Korava', 'Hakki Pikki', 'Lambani', 'Beda', 'Chenchu', 'Iruliga', 'Sholiga', 'Malekudiya', 'Medara', 'Kaniyan', 'Kudiya', 'Kuruba', 'Korama', 'Valmiki'],
      'kl': ['Paniya', 'Kurichiya', 'Kuruma', 'Mannan', 'Malai Arayan', 'Malai Pandaram', 'Malai Vedan', 'Malasar', 'Malayarayan', 'Mannan', 'Muthuvan', 'Paliyan', 'Pulayan', 'Urali', 'Vetta Kuruman', 'Wayanad Kadar'],
      'mh': ['Bhil', 'Gond', 'Kol', 'Korku', 'Baiga', 'Sahariya', 'Bhariya', 'Halba', 'Kamar', 'Bhilala', 'Barela', 'Agaria', 'Nihal', 'Warli', 'Katkari', 'Thakur', 'Mahadeo Koli', 'Malhar Koli', 'Tokre Koli', 'Vasave', 'Pardhi', 'Kaikadi', 'Phase Pardhi', 'Phase Pardhi', 'Phase Pardhi'],
      'rj': ['Bhil', 'Gond', 'Kol', 'Korku', 'Baiga', 'Sahariya', 'Bhariya', 'Halba', 'Kamar', 'Bhilala', 'Barela', 'Agaria', 'Nihal', 'Meena', 'Garasia', 'Damor', 'Kathodi', 'Naikda', 'Patelia', 'Seharia', 'Bhil Mina', 'Bhil Meena'],
      'tn': ['Toda', 'Kota', 'Kurumba', 'Irula', 'Paniyan', 'Kadar', 'Malasar', 'Malai Arayan', 'Malai Pandaram', 'Malai Vedan', 'Malasar', 'Malayarayan', 'Mannan', 'Muthuvan', 'Paliyan', 'Pulayan', 'Urali', 'Vetta Kuruman', 'Wayanad Kadar'],
      'up': ['Tharu', 'Buxa', 'Jaunsari', 'Rajwar', 'Kol', 'Kharwar', 'Chero', 'Gond', 'Korwa', 'Baiga', 'Agaria', 'Paharia', 'Mal Paharia'],
      'uk': ['Tharu', 'Buxa', 'Jaunsari', 'Rajwar', 'Kol', 'Kharwar', 'Chero', 'Gond', 'Korwa', 'Baiga', 'Agaria', 'Paharia', 'Mal Paharia'],
      'wb': ['Santal', 'Oraon', 'Munda', 'Ho', 'Kharia', 'Mahali', 'Bhumij', 'Kharwar', 'Chero', 'Gond', 'Paharia', 'Mal Paharia', 'Lodha', 'Kheria', 'Sabar', 'Birhor', 'Asur', 'Korwa', 'Mal Paharia'],
      'jk': ['Gujjar', 'Bakerwal', 'Gaddi', 'Sippi', 'Chamang', 'Dard', 'Shin', 'Brokpa', 'Balti', 'Purigpa', 'Drokpa', 'Changpa', 'Beda', 'Garra', 'Mon', 'Boto', 'Doma', 'Han', 'Ladakhi', 'Purigpa', 'Shin', 'Balti', 'Dard', 'Brokpa', 'Changpa', 'Beda', 'Garra', 'Mon', 'Boto', 'Doma', 'Han', 'Ladakhi']
    };
    return tribalGroupsMap[stateCode] || [];
  }

  const claimStatuses = [
    'Pending', 'Under Review', 'Approved', 'Rejected', 'Title Distributed'
  ];

  const availableDistricts = filters.state ? statesData[filters.state]?.districts || [] : [];
  const availableVillages = filters.state && filters.district ?
    statesData[filters.state]?.villages[filters.district] || [] : [];
  const availableTribalGroups = filters.state && filters.district ?
    statesData[filters.state]?.districtTribalGroups[filters.district] || [] :
    (filters.state ? statesData[filters.state]?.tribalGroups || [] : []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };

    // Reset dependent filters when parent changes
    if (key === 'state') {
      newFilters.district = '';
      newFilters.village = '';
      newFilters.tribalGroup = '';
    } else if (key === 'district') {
      newFilters.village = '';
      newFilters.tribalGroup = '';
    }

    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setIsApplying(true);

    // Simulate processing time
    setTimeout(() => {
      setIsApplying(false);
      setShowSuccess(true);
      onFilterChange(filters);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      state: '',
      district: '',
      village: '',
      tribalGroup: '',
      claimStatus: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8"
            >
              <option value="">Select State</option>
              {Object.entries(statesData).map(([key, state]: [string, any]) => (
                <option key={key} value={key}>{state.name}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              disabled={!filters.state}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {availableDistricts.map((district: string) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
          <div className="relative">
            <select
              value={filters.village}
              onChange={(e) => handleFilterChange('village', e.target.value)}
              disabled={!filters.district}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Village</option>
              {availableVillages.map((village: string) => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tribal Group</label>
          <div className="relative">
            <select
              value={filters.tribalGroup}
              onChange={(e) => handleFilterChange('tribalGroup', e.target.value)}
              disabled={!filters.state}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Tribal Group</option>
              {availableTribalGroups.map((group: string) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Claim Status</label>
          <div className="relative">
            <select
              value={filters.claimStatus}
              onChange={(e) => handleFilterChange('claimStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-8"
            >
              <option value="">All Statuses</option>
              {claimStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-check-line text-green-600"></i>
              </div>
              <span className="text-sm text-green-800 font-medium">Filters applied successfully!</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApplyFilters}
            disabled={isApplying}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin"></i>
                </div>
                Applying...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-filter-3-line"></i>
                </div>
                Apply Filters
              </div>
            )}
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-close-line"></i>
              </div>
              Clear
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
