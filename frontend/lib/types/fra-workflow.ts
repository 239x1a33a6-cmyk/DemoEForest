
export type FRARole =
    | 'TRIBAL'          // Benificiary / Claimant
    | 'FRC_MEMBER'      // Forest Rights Committee Member (Gram Sabha)
    | 'SDLC_MEMBER'     // Sub-Divisional Level Committee
    | 'DLC_MEMBER'      // District Level Committee
    | 'SLMC_MEMBER';    // State Level Monitoring Committee / Admin

export interface FRAUser {
    uid: string;
    displayName: string;
    email: string;
    phone?: string;
    role: FRARole;
    // Jurisdiction details
    state?: string;
    district?: string;
    subdivision?: string;
    block?: string;
    village?: string;
    walletAddress?: string; // Optional for future extensions
}

export type ClaimType = 'IFR' | 'CR' | 'CFR';

export type ClaimStatus =
    | 'DRAFT'
    | 'SUBMITTED_TO_GRAM_SABHA'
    | 'UNDER_FRC_VERIFICATION'
    | 'GRAM_SABHA_RESOLUTION_PASSED'
    | 'FORWARDED_TO_SDLC'
    | 'REMANDED_BY_SDLC' // Sent back to Gram Sabha
    | 'VERIFIED_BY_SDLC'
    | 'FORWARDED_TO_DLC'
    | 'REMANDED_BY_DLC' // Sent back to SDLC
    | 'APPROVED_BY_DLC'
    | 'REJECTED'
    | 'TITLE_ISSUED';

export interface DocumentAttachment {
    id: string;
    type: 'ID_PROOF' | 'RESIDENCE_PROOF' | 'CASTE_CERT' | 'EVIDENCE_OF_OCCUPATION' | 'MAP_SKETCH' | 'OTHER';
    name: string;
    url: string;
    uploadedAt: string; // ISO Date
}

export interface ClaimHistoryEvent {
    stage: ClaimStatus;
    timestamp: string;
    actorId: string;
    actorRole: FRARole;
    action: string; // e.g., "Submitted", "Verified", "Forwarded"
    comments?: string;
}

export interface FRAClaim {
    id: string; // Auto-generated
    claimantId: string;
    claimantName: string; // Denormalized for easy listing

    // Location
    state: string;
    district: string;
    block: string;
    village: string;

    type: ClaimType;
    status: ClaimStatus;

    // Form Data (Flexible structure based on Form A/B/C)
    formData: {
        // Common fields
        fatherName?: string;
        spouseName?: string;
        age?: number;
        caste?: string;
        address?: string;

        // Land details
        surveyNumbers?: string[];
        areaClaimed?: string; // in acres/hectares
        boundaryDescription?: string;

        // CR/CFR specific
        communityName?: string;
        natureOfRight?: string; // e.g. "Grazing", "Collection of minor forest produce"
    };

    // GIS Data
    boundary?: any; // GeoJSON Polygon

    // Documents
    documents: DocumentAttachment[];

    // Verification Data
    frcVerification?: {
        verificationDate: string;
        verifiedBy: string[]; // Member names
        siteInspectionNotes: string;
        claimantPresent: boolean;
        boundaryVerified: boolean;
        evidenceValid: boolean;
    };

    gramSabhaResolution?: {
        meetingDate: string;
        resolutionNumber: string;
        quorumPresent: boolean;
        decision: 'APPROVE' | 'REJECT' | 'MODIFY';
        resolutionCopyUrl?: string; // Scanned PDF
    };

    sdlcReview?: {
        reviewDate: string;
        reviewerId: string;
        decision: 'FORWARD' | 'REMAND';
        remarks: string;
    };

    dlcReview?: {
        reviewDate: string;
        decisionDate: string;
        finalDecision: 'APPROVE' | 'REJECT';
        titleinfo?: {
            titleNumber: string;
            issueDate: string;
            extentApproved: string;
        };
    };

    // Audit
    history: ClaimHistoryEvent[];
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    link?: string; // e.g. /claims/<id>
    read: boolean;
    createdAt: string;
}
