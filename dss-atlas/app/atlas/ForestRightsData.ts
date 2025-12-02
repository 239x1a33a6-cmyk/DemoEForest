// Forest Rights Act (FRA) Data for all 21 States/UTs
// Data as of July 31, 2025

export interface ForestRightsData {
  state: string;
  stateCode: string;
  claimsReceived: {
    individual: number;
    community: number;
    total: number;
  };
  claimsApproved: {
    individual: number;
    community: number;
    total: number;
  };
  claimsRejected: {
    individual: number;
    community: number;
    total: number;
  };
  titlesDistributed: {
    individual: number;
    community: number;
    total: number;
  };
  forestLandArea: {
    individual: number; // in acres
    community: number; // in acres
    total: number; // in acres
  };
  totalClaimsDisposed: number;
  claimsDisposedPercentage: number;
  claimsApprovedPercentage: number;
  claimsRejectedPercentage: number;
  titlesDistributedPercentage: number;
  forestRightsTypes: {
    ifr: number; // Individual Forest Rights
    cfr: number; // Community Forest Rights
    cr: number;  // Community Forest Resources
  };
  nodalOfficerAppointed: {
    sdlc: boolean;
    dlc: boolean;
    slmc: boolean;
  };
  committeeFormation: {
    translationActRules: boolean;
    awarenessActRules: boolean;
    trainingOfficials: boolean;
    constitutionFRCs: boolean;
  };
  claimsFiledAtGS: {
    individual: number;
    community: number;
    total: number;
  };
  claimsRecommendedToSDLC: {
    individual: number | 'NA';
    community: number | 'NA';
    total: number | 'NA';
  };
  claimsRecommendedToDLC: {
    individual: number | 'NA';
    community: number | 'NA';
    total: number | 'NA';
  };
  dlcApprovedClaims: {
    individual: number | 'NA';
    community: number | 'NA';
    total: number | 'NA';
  };
  forestLandGiven: {
    individual: number | 'NA'; // in hectares
    community: number | 'NA'; // in hectares
    total: number | 'NA'; // in hectares
  };
}

export const forestRightsData: ForestRightsData[] = [
  {
    state: 'Andhra Pradesh',
    stateCode: 'ap',
    claimsReceived: { individual: 285098, community: 3294, total: 288392 },
    claimsApproved: { individual: 228473, community: 1822, total: 230295 },
    claimsRejected: { individual: 56625, community: 1472, total: 58097 },
    titlesDistributed: { individual: 226651, community: 1822, total: 228473 },
    forestLandArea: { individual: 981160.00, community: 0, total: 981160.00 },
    totalClaimsDisposed: 286883,
    claimsDisposedPercentage: 99.48,
    claimsApprovedPercentage: 79.85,
    claimsRejectedPercentage: 20.15,
    titlesDistributedPercentage: 79.22,
    forestRightsTypes: { ifr: 226651, cfr: 1822, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 285098, community: 3294, total: 288392 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Assam',
    stateCode: 'as',
    claimsReceived: { individual: 148965, community: 6046, total: 155011 },
    claimsApproved: { individual: 58802, community: 1477, total: 60279 },
    claimsRejected: { individual: 90163, community: 4569, total: 94732 },
    titlesDistributed: { individual: 57325, community: 1477, total: 58802 },
    forestLandArea: { individual: 0, community: 0, total: 0 }, // NA/NR
    totalClaimsDisposed: 155011,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 38.89,
    claimsRejectedPercentage: 61.11,
    titlesDistributedPercentage: 37.94,
    forestRightsTypes: { ifr: 57325, cfr: 1477, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 148965, community: 6046, total: 155011 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Bihar',
    stateCode: 'br',
    claimsReceived: { individual: 4696, community: 0, total: 4696 },
    claimsApproved: { individual: 191, community: 0, total: 191 },
    claimsRejected: { individual: 4505, community: 0, total: 4505 },
    titlesDistributed: { individual: 191, community: 0, total: 191 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 4696,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 4.07,
    claimsRejectedPercentage: 95.93,
    titlesDistributedPercentage: 4.07,
    forestRightsTypes: { ifr: 191, cfr: 0, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 4696, community: 0, total: 4696 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Chhattisgarh',
    stateCode: 'cg',
    claimsReceived: { individual: 890220, community: 57259, total: 947479 },
    claimsApproved: { individual: 534068, community: 52636, total: 586704 },
    claimsRejected: { individual: 356152, community: 4623, total: 360775 },
    titlesDistributed: { individual: 481432, community: 52636, total: 534068 },
    forestLandArea: { individual: 10052728.38, community: 0, total: 10052728.38 },
    totalClaimsDisposed: 947479,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 61.92,
    claimsRejectedPercentage: 38.08,
    titlesDistributedPercentage: 56.37,
    forestRightsTypes: { ifr: 481432, cfr: 52636, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 890220, community: 57259, total: 947479 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Goa',
    stateCode: 'ga',
    claimsReceived: { individual: 9757, community: 379, total: 10136 },
    titlesDistributed: { individual: 856, community: 15, total: 871 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 9757, community: 379, total: 10136 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Gujarat',
    stateCode: 'gj',
    claimsReceived: { individual: 183055, community: 7187, total: 190242 },
    titlesDistributed: { individual: 98732, community: 4792, total: 103524 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 183055, community: 7187, total: 190242 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Himachal Pradesh',
    stateCode: 'hp',
    claimsReceived: { individual: 4981, community: 683, total: 5664 },
    titlesDistributed: { individual: 755, community: 146, total: 901 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 4981, community: 683, total: 5664 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Jharkhand',
    stateCode: 'jh',
    claimsReceived: { individual: 107032, community: 3724, total: 110756 },
    claimsApproved: { individual: 61970, community: 2104, total: 64074 },
    claimsRejected: { individual: 45062, community: 1620, total: 46682 },
    titlesDistributed: { individual: 59866, community: 2104, total: 61970 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 110756,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 57.85,
    claimsRejectedPercentage: 42.15,
    titlesDistributedPercentage: 55.95,
    forestRightsTypes: { ifr: 59866, cfr: 2104, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 107032, community: 3724, total: 110756 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Karnataka',
    stateCode: 'ka',
    claimsReceived: { individual: 289236, community: 5940, total: 295176 },
    titlesDistributed: { individual: 15355, community: 1345, total: 16700 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 289236, community: 5940, total: 295176 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Kerala',
    stateCode: 'kl',
    claimsReceived: { individual: 44455, community: 1014, total: 45469 },
    titlesDistributed: { individual: 29422, community: 282, total: 29704 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 44455, community: 1014, total: 45469 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Madhya Pradesh',
    stateCode: 'mp',
    claimsReceived: { individual: 585326, community: 42187, total: 627513 },
    claimsApproved: { individual: 294877, community: 27976, total: 322853 },
    claimsRejected: { individual: 290449, community: 14211, total: 304660 },
    titlesDistributed: { individual: 266901, community: 27976, total: 294877 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 627513,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 51.45,
    claimsRejectedPercentage: 48.55,
    titlesDistributedPercentage: 46.99,
    forestRightsTypes: { ifr: 266901, cfr: 27976, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 585326, community: 42187, total: 627513 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Maharashtra',
    stateCode: 'mh',
    claimsReceived: { individual: 397897, community: 11259, total: 409156 },
    titlesDistributed: { individual: 199667, community: 8668, total: 208335 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 397897, community: 11259, total: 409156 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Odisha',
    stateCode: 'or',
    claimsReceived: { individual: 732530, community: 35843, total: 768373 },
    claimsApproved: { individual: 472119, community: 8990, total: 481109 },
    claimsRejected: { individual: 260411, community: 26853, total: 287264 },
    titlesDistributed: { individual: 463129, community: 8990, total: 472119 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 768373,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 62.64,
    claimsRejectedPercentage: 37.36,
    titlesDistributedPercentage: 61.46,
    forestRightsTypes: { ifr: 463129, cfr: 8990, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 732530, community: 35843, total: 768373 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Rajasthan',
    stateCode: 'rj',
    claimsReceived: { individual: 113162, community: 5213, total: 118375 },
    titlesDistributed: { individual: 49215, community: 2551, total: 51766 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 113162, community: 5213, total: 118375 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Tamil Nadu',
    stateCode: 'tn',
    claimsReceived: { individual: 33119, community: 1548, total: 34667 },
    titlesDistributed: { individual: 15442, community: 1066, total: 16508 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 33119, community: 1548, total: 34667 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Telangana',
    stateCode: 'tg',
    claimsReceived: { individual: 651822, community: 3427, total: 655249 },
    claimsApproved: { individual: 231456, community: 721, total: 232177 },
    claimsRejected: { individual: 420366, community: 2706, total: 423072 },
    titlesDistributed: { individual: 230735, community: 721, total: 231456 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 655249,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 35.44,
    claimsRejectedPercentage: 64.56,
    titlesDistributedPercentage: 35.33,
    forestRightsTypes: { ifr: 230735, cfr: 721, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 651822, community: 3427, total: 655249 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Tripura',
    stateCode: 'tr',
    claimsReceived: { individual: 200557, community: 164, total: 200721 },
    claimsApproved: { individual: 128032, community: 101, total: 128133 },
    claimsRejected: { individual: 72525, community: 63, total: 72588 },
    titlesDistributed: { individual: 127931, community: 101, total: 128032 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    totalClaimsDisposed: 200721,
    claimsDisposedPercentage: 100.00,
    claimsApprovedPercentage: 63.84,
    claimsRejectedPercentage: 36.16,
    titlesDistributedPercentage: 63.79,
    forestRightsTypes: { ifr: 127931, cfr: 101, cr: 0 },
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 200557, community: 164, total: 200721 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Uttar Pradesh',
    stateCode: 'up',
    claimsReceived: { individual: 92972, community: 1194, total: 94166 },
    titlesDistributed: { individual: 22537, community: 893, total: 23430 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 92972, community: 1194, total: 94166 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Uttarakhand',
    stateCode: 'uk',
    claimsReceived: { individual: 3587, community: 3091, total: 6678 },
    titlesDistributed: { individual: 184, community: 1, total: 185 },
    forestLandArea: { individual: 0, community: 0, total: 0 }, // NA/NR
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 3587, community: 3091, total: 6678 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'West Bengal',
    stateCode: 'wb',
    claimsReceived: { individual: 131962, community: 10119, total: 142081 },
    titlesDistributed: { individual: 44444, community: 686, total: 45130 },
    forestLandArea: { individual: 0, community: 0, total: 0 },
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 131962, community: 10119, total: 142081 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  },
  {
    state: 'Jammu & Kashmir',
    stateCode: 'jk',
    claimsReceived: { individual: 33233, community: 12857, total: 46090 },
    titlesDistributed: { individual: 429, community: 5591, total: 6020 },
    forestLandArea: { individual: 0, community: 0, total: 0 }, // NA/NR
    claimsRejected: 0,
    totalClaimsDisposed: 0,
    claimsDisposedPercentage: 0,
    titlesDistributedPercentage: 0,
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: { individual: 33233, community: 12857, total: 46090 },
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  }
];

// Helper functions
export const getStateData = (stateCode: string): ForestRightsData | undefined => {
  return forestRightsData.find(state => state.stateCode === stateCode);
};

export const getAllStates = (): ForestRightsData[] => {
  return forestRightsData;
};

export const getTotalData = () => {
  const totals = forestRightsData.reduce((acc, state) => {
    acc.claimsReceived.individual += state.claimsReceived.individual;
    acc.claimsReceived.community += state.claimsReceived.community;
    acc.claimsReceived.total += state.claimsReceived.total;
    acc.titlesDistributed.individual += state.titlesDistributed.individual;
    acc.titlesDistributed.community += state.titlesDistributed.community;
    acc.titlesDistributed.total += state.titlesDistributed.total;
    acc.forestLandArea.individual += state.forestLandArea.individual;
    acc.forestLandArea.community += state.forestLandArea.community;
    acc.forestLandArea.total += state.forestLandArea.total;
    return acc;
  }, {
    claimsReceived: { individual: 0, community: 0, total: 0 },
    titlesDistributed: { individual: 0, community: 0, total: 0 },
    forestLandArea: { individual: 0, community: 0, total: 0 }
  });

  return {
    state: 'TOTAL (All States/UTs)',
    stateCode: 'total',
    ...totals,
    claimsRejected: 1873374, // From the image data
    totalClaimsDisposed: 4386436, // From the image data
    claimsDisposedPercentage: 85.08, // Calculated
    titlesDistributedPercentage: 48.73, // Calculated
    nodalOfficerAppointed: { sdlc: true, dlc: true, slmc: true },
    committeeFormation: { translationActRules: true, awarenessActRules: true, trainingOfficials: true, constitutionFRCs: true },
    claimsFiledAtGS: totals.claimsReceived,
    claimsRecommendedToSDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    claimsRecommendedToDLC: { individual: 'NA', community: 'NA', total: 'NA' },
    dlcApprovedClaims: { individual: 'NA', community: 'NA', total: 'NA' },
    forestLandGiven: { individual: 'NA', community: 'NA', total: 'NA' }
  };
};
