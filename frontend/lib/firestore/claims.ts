
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    orderBy,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';
import { getFirestoreClient } from '@/lib/firebaseClient';
import { FRAClaim, ClaimStatus, ClaimType, FRARole } from '@/lib/types/fra-workflow';

const CLAIMS_COLLECTION = 'fra_claims';

// Create a new claim
export async function createClaim(claimData: Partial<FRAClaim>) {
    const db = getFirestoreClient();
    const claimsRef = collection(db, CLAIMS_COLLECTION);
    const newClaimRef = doc(claimsRef); // Auto-ID

    const timestamp = new Date().toISOString();

    const claim: any = {
        id: newClaimRef.id,
        ...claimData,
        status: 'SUBMITTED_TO_GRAM_SABHA',
        createdAt: timestamp,
        updatedAt: timestamp,
        history: [
            {
                stage: 'SUBMITTED_TO_GRAM_SABHA',
                timestamp: timestamp,
                actorId: claimData.claimantId,
                actorRole: 'TRIBAL',
                action: 'Claim Submitted',
                comments: 'Initial submission'
            }
        ]
    };

    await setDoc(newClaimRef, claim);
    return newClaimRef.id;
}

// Get claims for a specific user (Beneficiary view)
export async function getClaimsByUser(userId: string) {
    const db = getFirestoreClient();
    const claimsRef = collection(db, CLAIMS_COLLECTION);
    const q = query(claimsRef, where('claimantId', '==', userId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FRAClaim);
}

// Get claims for a specific jurisdiction (FRC/SDLC/DLC view)
// Filters based on the committee's village/block/district
export async function getClaimsByJurisdiction(
    role: string,
    location: { state?: string, district?: string, block?: string, village?: string }
) {
    const db = getFirestoreClient();
    const claimsRef = collection(db, CLAIMS_COLLECTION);

    let q;

    // Filter logic based on hierarchy
    if (role === 'FRC_MEMBER') {
        // FRC sees claims in their Village
        q = query(claimsRef,
            where('village', '==', location.village),
            where('district', '==', location.district)
        );
    } else if (role === 'SDLC_MEMBER') {
        // SDLC sees claims in their Subdivision/Block (Assuming Block for simplicity now)
        // Note: Firestore requires composite indexes for multiple fields. 
        // We might need to filter client-side if indexes aren't set up yet.
        // For now, let's query by District and filter client side if needed, or query by Status.
        q = query(claimsRef,
            where('district', '==', location.district),
            where('status', 'in', [
                'FORWARDED_TO_SDLC',
                'REMANDED_BY_DLC',
                'VERIFIED_BY_SDLC', // To show history
                'FORWARDED_TO_DLC'
            ])
        );
    } else if (role === 'DLC_MEMBER') {
        q = query(claimsRef,
            where('district', '==', location.district),
            where('status', 'in', [
                'FORWARDED_TO_DLC',
                'APPROVED_BY_DLC',
                'REJECTED',
                'TITLE_ISSUED'
            ])
        );
    } else {
        // Fallback or Admin
        q = query(claimsRef);
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FRAClaim);
}

// Update Claim Status (Forward/Approve/Reject)
export async function updateClaimStatus(
    claimId: string,
    newStatus: ClaimStatus,
    actor: { uid: string, role: string, name: string },
    comments: string,
    additionalData: any = {}
) {
    const db = getFirestoreClient();
    const claimRef = doc(db, CLAIMS_COLLECTION, claimId);

    const timestamp = new Date().toISOString();

    const historyEvent = {
        stage: newStatus,
        timestamp: timestamp,
        actorId: actor.uid,
        actorRole: actor.role as FRARole,
        action: `Status updated to ${newStatus}`,
        comments: comments
    };

    await updateDoc(claimRef, {
        status: newStatus,
        updatedAt: timestamp,
        ...additionalData,
        history: arrayUnion(historyEvent)
    });
}
