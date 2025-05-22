export const ROUTES = {
    // Super Routes //
    COMPENDIUM_ROUTE: '/compendium/*',
    WARBAND_ROUTE: '/warband/*',
    HOME_ROUTE: '*',
    LOGIN_ROUTE: '/login/*',
    PRIVACY_ROUTE: '/privacy/*',
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

    // Campaign //
    COMP_CAMPAIGN_EXPLORATION : '/explorationtable/*',
    COMP_CAMPAIGN_INJURIES : '/injury/*',
    COMP_CAMPAIGN_PATRONS : '/patron/*',
    COMP_CAMPAIGN_SKILLS : '/skills/*',

    // Warband Builder Routes //

    WBB_EDIT : '/edit/*',
    WBB_NEW : '/new/*'

}