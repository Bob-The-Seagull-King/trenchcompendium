export const ROUTES = {
    // Super Routes //
    COMPENDIUM: '/compendium/',
    COMPENDIUM_ROUTE: '/compendium/*',
    WARBAND: '/warband/',
    WARBAND_ROUTE: '/warband/*',
    CAMPAIGN: '/campaigns/',
    CAMPAIGN_ROUTE: '/campaigns/*',
    HOME_ROUTE: '*',
    LOGIN_ROUTE: '/login/',
    PROFILE_VIEW_ROUTE: '/profile/:id',
    PROFILE_SETTINGS_ROUTE: '/profile/:id/settings',

    // Compendium Routes //

    // Parent Pages //

    COMP_PARENT_GAME : '/game/*',
    COMP_PARENT_CAMPAIGN : '/campaign/*',

    // Rules //
    COMP_RULES_GAMERULES : '/rules/*',
    COMP_RULES_CAMPAIGNRULES : '/campaign_rules/*',
    COMP_RULES_ERRATARULES : '/errata/*',
    COMP_RULES_KEYWORDS: '/keyword/*',
    COMP_RULES_GLOSSARY: '/glossary/*',
    
    // Warbands //
    COMP_WARBAND_FACTIONS : '/faction/*',
    COMP_WARBAND_MODELS : '/model/*',
    COMP_WARBAND_EQUIPMENT : '/armoury/*',

    // Equipment //
    COMP_EQUIP_RANGED : '/ranged/*',
    COMP_EQUIP_MELEE : '/melee/*',
    COMP_EQUIP_ARMOUR : '/armour/*',
    COMP_EQUIP_EQUIPMENT : '/equipment/*',

    // Scenarios //
    COMP_SCENARIO_SCENARIO : '/scenario/*',
    COMP_SCENARIO_GENERATOR : '/scenario/randomscenario/*',
    COMP_SCENARIO_GENRULES : '/scenario/randomscenariorules/*',

    // Campaign //
    COMP_CAMPAIGN_EXPLORATION : '/explorationtable/*',
    COMP_CAMPAIGN_INJURIES : '/injury/*',
    COMP_CAMPAIGN_PATRONS : '/patron/*',
    COMP_CAMPAIGN_SKILLS : '/skills/*',

    // Warband Builder Routes //
    WBB_NEW : '/new/*',
    WBB_VIEW : '/detail/*',

    // Static pages - legal stuff //
    PAGE_LEGAL : '/page/legal-notice',
    PAGE_PRIVCACY : '/page/privacy',
    PAGE_TERMS : '/page/terms',
    PAGE_CONTACT : '/page/contact', // information around contacting us
    PAGE_WITHDRAWAL : '/page/withdrawal',

    // Static pages - Personal Content //
    COMPANION_ABOUT : '/about',

    // Static Pages - other content //
    PAGE_MEMBERSHIP : '/page/premium-membership', // will show fluff around the membership
    PAGE_SUPPORTER_PACKS : '/page/supporter-packs', // will show fluff around the supporter packs
    PAGE_COLLABORATE: '/page/collaboration', // will show fluff and contact for B2B partners

    PAGE_PLAN_SELECTION : '/page/plan-selection', // will let users select and purchase membership plans
    PAGE_CREATOR_APPLICATION : '/page/creator-application', // will let users apply as creator

    // Blog posts
    PAGE_BLOG_BASE: '/blog',
    PAGE_BLOG_ARTICLE: '/blog/:slug',

    // Main Site URL
    MAIN : 'https://trench-companion.com'

}