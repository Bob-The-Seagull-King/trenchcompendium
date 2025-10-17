// WbbJsonLDSchema.tsx
import React, { useEffect, useMemo } from "react";
import { useWarband } from "../../../context/WarbandContext";
import { RealWarbandPurchaseModel } from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";


function safeJsonLdStringify(obj: unknown) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

const WbbJsonLDSchema: React.FC = () => {

    const {warband, updateKey, reloadDisplay} = useWarband();

    if ( !warband ) {return null;}

    const UserWarband = warband.warband_data;

    const base_url = typeof window !== "undefined" ? window.location.origin : "https://trench-companion.com";
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

    const wb_data = {
        '@context'      : 'https://schema.org',
        '@type'         : 'WebPage',
        '@id'           : wb_url,
        'url'           : wb_url,
        "inLanguage"    : "en",
        "name"          : UserWarband.GetName(),
        'identifier'    : 'warband-' + warband.id,

        'about'         : {
            '@type'         : 'Thing',
            'name'          : UserWarband.GetFactionName(),
            'url'           : faction_URL,
        },
        'description'   : UserWarband.GetWarbandNotes(),
        'text'          : UserWarband.GetLore(),
    }

    return (
        <script
            type="application/ld+json"
            // Kein pretty print in Prod; safeJson gegen </script>-Breakout
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(wb_data) }}
        />
    );
}
export default WbbJsonLDSchema;
