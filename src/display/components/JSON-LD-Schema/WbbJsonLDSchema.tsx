// WbbJsonLDSchema.tsx
import React, {useEffect, useMemo, useRef} from "react";
import { useWarband } from "../../../context/WarbandContext";
import { RealWarbandPurchaseModel } from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";


function safeJsonLdStringify(obj: unknown) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}


/**
 * This creates JSON LD markup for the warband on the first render.
 * - @TODO: now only references to members and items are shown. These members should be added later.
 *
 */
const WbbJsonLDSchema: React.FC = () => {

    const {warband, updateKey, reloadDisplay} = useWarband();

    // holds the very first JSON string we generated (frozen)
    const frozenJsonRef = useRef<string | null>(null);

    if ( !warband ) {return null;}

    const UserWarband = warband.warband_data;

    // URL of the page
    const base_url = typeof window !== "undefined" ? window.location.origin : "https://trench-companion.com";

    // URL to this warband
    const wb_url = base_url + '/warband/detail/' + warband.id;

    /** Build the faction URL*/
    const faction_URL= useMemo(() => {
        if(!UserWarband.GetFaction()) {
            return '';
        }

        const faction_path = factionPath(UserWarband.GetFaction()?.ID);

        return `${base_url}/compendium/faction/${faction_path}`;
    }, []);

    /** Gets the potentially nested faction path */
    function factionPath(slug: string | undefined) {
        if (typeof slug !== 'string') return '';

        // trim and strip leading/trailing slashes
        const clean = slug.trim().replace(/^\/+|\/+$/g, '');
        if (!clean) return '';

        const fvIdx = clean.indexOf('_fv_');
        if (fvIdx !== -1) {
            // variant: base is everything before "_fv_"
            const base = clean.slice(0, fvIdx);
            return `${base}/${clean}`;
        }

        // base faction
        return `/${clean}/`;
    }

    // list of warband Members for Warband Schema
    const wb_members = UserWarband.GetFighters()
        // optional: nur aktive Member nehmen
        // .filter(m => !m.isDead)
        .map((m : RealWarbandPurchaseModel, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@id": `${wb_url}#${m.model.ID}`
            }
        }));

    // List of Locations for Warband Schema
    const wb_locations = UserWarband.GetLocations()
        .map((loc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@id": `${wb_url}#${loc.ID}`
            }
    }));

    // @TODO: Add list of modifiers to warband schema

    const wb_data = {
        '@context'      : 'https://schema.org',
        '@type'         : 'WebPage',
        '@id'           : wb_url+'#webpage',
        'url'           : wb_url,
        "inLanguage"    : "en",
        "name"          : UserWarband.GetName(),

        "mainEntity": {
            '@type'         : 'Collection',
            '@id'           : wb_url,
            'url'           : wb_url,
            "name"          : UserWarband.GetName(),
            'identifier'    : 'warband-' + warband.id,
            "mainEntityOfPage": {
                "@id": wb_url+'#webpage'
            },
            'about'         : {
                '@type'         : 'Thing',
                'name'          : UserWarband.GetFactionName(),
                'url'           : faction_URL,
            },
            ...(UserWarband.GetWarbandNotes() && { description: UserWarband.GetWarbandNotes() }),
            ...(UserWarband.GetLore() && { text: UserWarband.GetLore() }),
            "additionalProperty": [
                { "@type": "PropertyValue", "name": "Rating (Glory)",
                    "value": UserWarband.GetCostDucats(),   "unitText": "Glory"
                },
                { "@type": "PropertyValue", "name": "Rating (Ducats)",
                    "value": UserWarband.GetCostGlory(),  "unitText": "Ducats"
                },
                { "@type": "PropertyValue", "name": "Value (Ducats)",
                    "value": UserWarband.GetCostDucatsTotal(), "unitText": "Ducats"
                },
                { "@type": "PropertyValue", "name": "Value (Glory)",
                    "value": UserWarband.GetCostGloryTotal(),   "unitText": "Glory"
                },
                { "@type": "PropertyValue", "name": "Victory Points",
                    "value": UserWarband.GetVictoryPoints()
                },
                { "@type": "PropertyValue", "name": "Failed Promotions",
                    "value": UserWarband.Context.FailedPromotions
                },
                { "@type": "PropertyValue", "name": "Campaign Round",
                    "value": UserWarband.GetCampaignCycleView()
                },
                { "@type": "PropertyValue", "name": "Campaign Notes",
                    "value": UserWarband.GetCampaignNotes()
                }
            ],
            "hasPart": [
                {
                    "@type": "ItemList",
                    "name": "Members",
                    "itemListElement": wb_members
                },
                {
                    "@type": "ItemList",
                    "name": "Exploration Locations",
                    "itemListElement": wb_locations
                },
            ]
        }
    }

    /**
     * For each of the following create JSON LD Schema which is linked by the id in the warband Schema:
     * - Fighters
     * - Locations
     * - Modifiers
     */


    // compute current JSON string
    const currentJson = safeJsonLdStringify(wb_data);

    // on first pass, freeze it; after that, never change again
    useEffect(() => {
        if (frozenJsonRef.current === null) {
            frozenJsonRef.current = currentJson;
        }
    }, [currentJson]);

    // prefer the frozen first snapshot; fallback to current for the initial mount
    const jsonToRender = frozenJsonRef.current ?? currentJson;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonToRender }}
        />
    );
}
export default WbbJsonLDSchema;
