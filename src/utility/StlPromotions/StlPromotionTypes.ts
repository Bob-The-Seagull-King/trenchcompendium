

// A creator for STL Promotions
export interface StlCreator {
    id: string;             // creator post id
    name: string;           // creator name
    slug: string;           // creator slug
    avatarUrl?: string;     // URL to Avatar image
    websiteUrl?: string;    // URL to vendor Website
    mmfUrl?: string;        // URL to MyMiniFactory
    patreonUrl?: string;    // URL to Patreon
    cultsUrl?: string;      // URL to Cults
}

// A singular promoted STL File
export interface StlPromotion_Model {
    id: string;                 // Post ID of promotion
    title: string;              // Title of products
    url: string;                // URL to purchase
    imageUrl?: string;          // Image
    modelId: string;            // ID of the model
    creatorId: number;          // Post ID of the Creator Post
}

// A set of multiple promotions for a single model by a creator
export interface StlPromotionSet_Model {
    modelId: string;                    // ID of the model
    promotions: StlPromotion_Model[];   // Array of promotions
}


/**
 * Next steps:
 *
 * - Create Promotion and Creator CPT in API
 * - Populate with FFI Data
 * - Create API Endpoint /wp-json/synod/v1/stl-promotions-by-model/[MODEL-ID] to get StlPromotionSet_Model_Creators
 * - Write function to get this info in StlPromotionsAPI.ts
 * - Output these as rows of elements for creators in FighterStlList including FighterSTLList_CreatorRow and FighterSTLList_STLEntry
 * - Create a Creator Page that gets /wp-json/synod/v1/creator-profile/[CREATOR-slug]
 * - Create a Creator List Page that gets /wp-json/synod/v1/creator-profiles
 * - Link StlPromotions to Creator Profile
 */