'use client';

import { useState } from 'react';
import PattaHoldersList from './PattaHoldersList';

interface VillagePattaNavigatorProps {
  onViewPattaHolderOnMap: (pattaHolder: any) => void;
}

export default function VillagePattaNavigator({ onViewPattaHolderOnMap }: VillagePattaNavigatorProps) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [showPattaHolders, setShowPattaHolders] = useState(false);

  const statesData = {
    'Jharkhand': {
      districts: {
        'East Singhbhum': ['Jamshedpur', 'Ghatshila', 'Potka', 'Dhalbhumgarh', 'Musabani', 'Patamda', 'Baharagora'],
        'West Singhbhum': ['Chaibasa', 'Chakradharpur', 'Manoharpur', 'Jagannathpur', 'Anandpur', 'Goilkera', 'Hatgamharia'],
        'Ranchi': ['Ranchi', 'Bundu', 'Tamar', 'Ratu', 'Silli', 'Sonahatu', 'Angara', 'Burmu', 'Lapung', 'Mandar'],
        'Hazaribagh': ['Hazaribagh', 'Barhi', 'Churchu', 'Ichak', 'Katkamsandi', 'Padma', 'Bishnugarh', 'Keredari'],
        'Dhanbad': ['Dhanbad', 'Jharia', 'Baghmara', 'Baliapur', 'Govindpur', 'Nirsa', 'Topchanchi'],
        'Bokaro': ['Bermo', 'Chandankiyari', 'Jaridih', 'Kasmar', 'Petarwar', 'Pirtand'],
        'Deoghar': ['Deoghar', 'Madhupur', 'Mohanpur', 'Palojori', 'Sarwan', 'Sonaraithari'],
        'Dumka': ['Dumka', 'Gopikander', 'Jama', 'Jarmundi', 'Kathikund', 'Masalia', 'Ramgarh', 'Ranishwar', 'Shikaripara'],
        'Giridih': ['Giridih', 'Bengabad', 'Birni', 'Deori', 'Dhanwar', 'Dumri', 'Gandey', 'Gawan', 'Jamua', 'Pirtand'],
        'Godda': ['Godda', 'Boarijor', 'Mahagama', 'Meherma', 'Pathargama', 'Poreyahat', 'Sundarpahari', 'Thakurgangti']
      }
    },
    'Telangana': {
      districts: {
        'Adilabad': ['Adilabad', 'Boath', 'Gadiguda', 'Gudihathnoor', 'Ichoda', 'Jainath', 'Kerameri', 'Kubeer', 'Lasoor', 'Mamda'],
        'Bhadradri Kothagudem': ['Kothagudem', 'Aswapuram', 'Bhadrachalam', 'Burgampahad', 'Chandrugonda', 'Chintoor', 'Dummugudem', 'Julurpad'],
        'Hyderabad': ['Hyderabad', 'Secunderabad', 'Cyberabad', 'Charminar', 'Golconda', 'Kukatpally', 'LB Nagar', 'Serilingampally'],
        'Jagtial': ['Jagtial', 'Dharmapuri', 'Gollapalli', 'Ibrahimpatnam', 'Kathlapur', 'Korutla', 'Mallapur', 'Metpalli', 'Pegadapalli', 'Raikal'],
        'Jangaon': ['Jangaon', 'Bachannapet', 'Chityal', 'Devaruppula', 'Ghanpur', 'Kodakandla', 'Lingalaghanpur', 'Nallabelly', 'Palakurthi', 'Raghunathpalle'],
        'Jayashankar Bhupalpally': ['Bhupalpally', 'Eturnagaram', 'Jayashankar', 'Kataram', 'Mahabubabad', 'Mulugu', 'Regonda', 'Tekumatla', 'Venkatapuram'],
        'Jogulamba Gadwal': ['Gadwal', 'Alampur', 'Aiza', 'Dharur', 'Ghattu', 'Ieeja', 'Maldakal', 'Rajoli', 'Undavalli', 'Waddepally'],
        'Kamareddy': ['Kamareddy', 'Bichkunda', 'Bhiknoor', 'Domakonda', 'Jukkal', 'Machareddy', 'Madnoor', 'Nizamsagar', 'Pedda Kodapgal', 'Pitlam'],
        'Karimnagar': ['Karimnagar', 'Boinpally', 'Choppadandi', 'Ellanthakunta', 'Gangadhara', 'Huzurabad', 'Jammikunta', 'Kaman', 'Kataram', 'Koheda'],
        'Khammam': ['Khammam', 'Aswaraopeta', 'Bonakal', 'Chintakani', 'Enkoor', 'Kallur', 'Konijerla', 'Kusumanchi', 'Madhira', 'Mudigonda']
      }
    },
    'Tripura': {
      districts: {
        'West Tripura': ['Agartala', 'Mohanpur', 'Hezamara', 'Jirania', 'Mandwi', 'Bishalgarh', 'Boxanagar', 'Melaghar', 'Sonamura', 'Udaipur'],
        'South Tripura': ['Udaipur', 'Amarpur', 'Karbook', 'Matabari', 'Kakraban', 'Rupaichhari', 'Rajnagar', 'Shantir Bazar', 'Belonia', 'Satchand'],
        'Dhalai': ['Ambassa', 'Kamalpur', 'Salema', 'Dumburnagar', 'Chhamanu', 'Manu', 'Longtharai Valley', 'Gandacherra', 'Dhalai', 'Durga Chowmuhani'],
        'North Tripura': ['Dharmanagar', 'Kanchanpur', 'Panisagar', 'Dasda', 'Pencharthal', 'Kadamtala', 'Kumarghat', 'Jubarajnagar', 'Churaibari', 'Damcherra'],
        'Gomati': ['Udaipur', 'Amarpur', 'Karbook', 'Matabari', 'Kakraban', 'Rupaichhari', 'Rajnagar', 'Ompi', 'Silachari', 'Poangbari'],
        'Khowai': ['Khowai', 'Kalyanpur', 'Teliamura', 'Mungiakami', 'Padmabil', 'Champaknagar', 'Tulashikhar', 'Lakshmipur', 'Maharani', 'Ashrambari'],
        'Sepahijala': ['Bishramganj', 'Melaghar', 'Sonamura', 'Boxanagar', 'Kathalia', 'Nalchar', 'Rajnagar', 'Jampuijala', 'Bishalgarh', 'Mandwi'],
        'Unakoti': ['Kailashahar', 'Kumarghat', 'Pecharthal', 'Fatikroy', 'Chandipur', 'Gournagar', 'Jubarajnagar', 'Laljuri', 'Rajnagar', 'Churaibari']
      }
    },
    'Madhya Pradesh': {
      districts: {
        'Bhopal': ['Bhopal', 'Berasia', 'Phanda', 'Huzur', 'Govindpura', 'Shahpura', 'Ashta', 'Ichhawar', 'Sehore', 'Nasrullaganj'],
        'Indore': ['Indore', 'Depalpur', 'Hatod', 'Gautampura', 'Sanwer', 'Sawer', 'Mhow', 'Rau', 'Simrol', 'Khudel'],
        'Gwalior': ['Gwalior', 'Bhitarwar', 'Dabra', 'Morar', 'Murar', 'Pichhore', 'Bilaua', 'Ghatigaon', 'Bhander', 'Chinor'],
        'Jabalpur': ['Jabalpur', 'Kundam', 'Majholi', 'Panagar', 'Patan', 'Shahpura', 'Sihora', 'Barela', 'Chargawan', 'Ghunsaur'],
        'Ujjain': ['Ujjain', 'Badnagar', 'Barnagar', 'Ghatiya', 'Khachrod', 'Mahidpur', 'Nagda', 'Tarana', 'Unhel', 'Makdon'],
        'Sagar': ['Sagar', 'Banda', 'Bina', 'Deori', 'Garhakota', 'Jaisinagar', 'Kesli', 'Khurai', 'Malthone', 'Rahatgarh'],
        'Dewas': ['Dewas', 'Bagli', 'Hatpipalya', 'Khategaon', 'Satwas', 'Sonkatch', 'Tonk Khurd', 'Kannod', 'Bagali', 'Dewas Rural'],
        'Satna': ['Satna', 'Amarpatan', 'Kotar', 'Maihar', 'Nagod', 'Raghurajnagar', 'Ramnagar', 'Unchehara', 'Sohawal', 'Birsinghpur'],
        'Ratna': ['Ratna', 'Alot', 'Bajna', 'Jaora', 'Piploda', 'Sailana', 'Tal', 'Ratna Rural', 'Namli', 'Dhamnod'],
        'Rewa': ['Rewa', 'Gurh', 'Hanumana', 'Huzur', 'Jawa', 'Mauganj', 'Naigarhi', 'Raipur Karchuliyan', 'Sirmour', 'Teonthar']
      }
    },
    'Odisha': {
      districts: {
        'Angul': ['Angul', 'Athamallik', 'Banarpal', 'Chhendipada', 'Kaniha', 'Kishorenagar', 'Pallahara', 'Talcher', 'Colliery', 'Handapa'],
        'Balangir': ['Balangir', 'Agalpur', 'Bangomunda', 'Belpada', 'Deogaon', 'Gudvela', 'Khaprakhol', 'Loisinga', 'Muribahal', 'Patnagarh'],
        'Balasore': ['Balasore', 'Basta', 'Bhograi', 'Jaleswar', 'Khaira', 'Nilagiri', 'Oupada', 'Remuna', 'Sadar', 'Simulia'],
        'Bargarh': ['Bargarh', 'Ambabhona', 'Attabira', 'Barpali', 'Bheden', 'Bhatli', 'Bijepur', 'Gaisilet', 'Jharbandh', 'Padampur'],
        'Bhadrak': ['Bhadrak', 'Basudevpur', 'Bonth', 'Chandbali', 'Dhamnagar', 'Tihidi', 'Bhandaripokhari', 'Agarpada', 'Bhadrak Sadar', 'Puruna Katak'],
        'Boudh': ['Boudh', 'Kantamal', 'Harbhanga', 'Manamunda', 'Purunakatak', 'Baunsuni', 'Charichhak', 'Luhagaon', 'Ranapur', 'Tikabali'],
        'Cuttack': ['Cuttack', 'Athagarh', 'Badamba', 'Banki', 'Baranga', 'Dampara', 'Kantapada', 'Kisannagar', 'Mahanga', 'Narasinghpur'],
        'Deogarh': ['Deogarh', 'Barkote', 'Reamal', 'Tileibani', 'Bamra', 'Laikera', 'Riamal', 'Deogarh Sadar', 'Barkot', 'Kundheigola'],
        'Dhenkanal': ['Dhenkanal', 'Bhuban', 'Gondia', 'Hindol', 'Kamakshyanagar', 'Kankadahad', 'Odapada', 'Parjang', 'Sadar', 'Motanga'],
        'Gajapati': ['Paralakhemundi', 'Gumma', 'Kasinagar', 'Mohana', 'Nuagada', 'Rayagada', 'R Udayagiri', 'Serango', 'Adaba', 'Chandragiri']
      }
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedVillage('');
    setShowPattaHolders(false);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedVillage('');
    setShowPattaHolders(false);
  };

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    setShowPattaHolders(true);
  };

  const getDistricts = () => {
    return selectedState ? Object.keys((statesData as any)[selectedState]?.districts || {}) : [];
  };

  const getVillages = () => {
    return selectedState && selectedDistrict 
      ? (statesData as any)[selectedState]?.districts[selectedDistrict] || []
      : [];
  };

  return (
    <div className="space-y-6">
      {/* Village Selection */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Village to View Patta Holders</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select 
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="">Select State</option>
              {Object.keys(statesData).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedState}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {getDistricts().map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
            <select 
              value={selectedVillage}
              onChange={(e) => handleVillageChange(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Village</option>
              {getVillages().map((village: string) => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedVillage && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-map-pin-line text-green-600"></i>
              </div>
              <div>
                <div className="font-medium text-green-900">Village Selected</div>
                <div className="text-sm text-green-700">
                  {selectedVillage}, {selectedDistrict}, {selectedState}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patta Holders List */}
      {showPattaHolders && selectedVillage && (
        <PattaHoldersList 
          onViewOnMap={onViewPattaHolderOnMap}
          selectedVillage={selectedVillage}
          selectedDistrict={selectedDistrict}
          selectedState={selectedState}
        />
      )}
    </div>
  );
}
