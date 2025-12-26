// Exact dashboard replication from DashboardModule
export const fraStateData: any = {
    "Madhya Pradesh": {
        ifr: {
            claims: 585326,
            titles: 267000,
            forestLand: 9.04
        },
        cfr: {
            claims: 42187,
            titles: 28000,
            forestLand: 14.64
        },
        claimsStatus: {
            approved: 294877,
            pending: 10229,
            rejected: 322407
        },
        coverageTrend: [
            { month: "Jan", value: 40 },
            { month: "Feb", value: 50 },
            { month: "Mar", value: 55 },
            { month: "Apr", value: 65 },
            { month: "May", value: 70 },
        ],
        assets: {
            agriculturalLand: { count: 12450, area: 450.5, confidence: 92 },
            waterBodies: { count: 320, area: 45.2, confidence: 96 },
            homesteads: { count: 8500, area: 12.5, confidence: 88 },
            forestResources: { count: 1540, area: 850.0, confidence: 90 }
        }
    },

    "Odisha": {
        ifr: {
            claims: 701148,
            titles: 462067,
            forestLand: 6.75
        },
        cfr: {
            claims: 35024,
            titles: 9832,
            forestLand: 7.43
        },
        claimsStatus: {
            approved: 470899,
            pending: 120637,
            rejected: 144636
        },
        coverageTrend: [
            { month: "Jan", value: 50 },
            { month: "Feb", value: 55 },
            { month: "Mar", value: 60 },
            { month: "Apr", value: 75 },
            { month: "May", value: 80 },
        ],
        assets: {
            agriculturalLand: { count: 15200, area: 520.8, confidence: 94 },
            waterBodies: { count: 450, area: 62.4, confidence: 97 },
            homesteads: { count: 9100, area: 14.2, confidence: 89 },
            forestResources: { count: 1800, area: 920.5, confidence: 91 }
        }
    },

    "Telangana": {
        ifr: {
            claims: 651822,
            titles: 231000,
            forestLand: 6.70
        },
        cfr: {
            claims: 3427,
            titles: 721,
            forestLand: 4.58
        },
        claimsStatus: {
            approved: 231456,
            pending: 329367,
            rejected: 94426
        },
        coverageTrend: [
            { month: "Jan", value: 30 },
            { month: "Feb", value: 35 },
            { month: "Mar", value: 40 },
            { month: "Apr", value: 50 },
            { month: "May", value: 55 },
        ],
        assets: {
            agriculturalLand: { count: 11800, area: 410.2, confidence: 91 },
            waterBodies: { count: 280, area: 38.5, confidence: 95 },
            homesteads: { count: 7800, area: 11.8, confidence: 87 },
            forestResources: { count: 1350, area: 780.2, confidence: 89 }
        }
    },

    "Tripura": {
        ifr: {
            claims: 200557,
            titles: 127931,
            forestLand: 4.65
        },
        cfr: {
            claims: 164,
            titles: 101,
            forestLand: 0.01
        },
        claimsStatus: {
            approved: 128032,
            pending: 3841,
            rejected: 68848
        },
        coverageTrend: [
            { month: "Jan", value: 20 },
            { month: "Feb", value: 25 },
            { month: "Mar", value: 30 },
            { month: "Apr", value: 35 },
            { month: "May", value: 40 },
        ],
        assets: {
            agriculturalLand: { count: 4500, area: 150.5, confidence: 93 },
            waterBodies: { count: 120, area: 18.2, confidence: 98 },
            homesteads: { count: 3200, area: 5.5, confidence: 90 },
            forestResources: { count: 650, area: 320.0, confidence: 92 }
        }
    }
};
