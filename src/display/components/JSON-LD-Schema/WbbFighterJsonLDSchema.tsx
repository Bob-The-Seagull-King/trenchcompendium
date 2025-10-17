// WbbFighterJsonLDSchema.tsx
import React, { useEffect, useRef, useState } from "react";
import { useWarband } from "../../../context/WarbandContext";
import {
    RealWarbandPurchaseEquipment,
    RealWarbandPurchaseModel
} from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import { getCostType } from "../../../utility/functions";
import {WarbandProperty} from "../../../classes/saveitems/Warband/WarbandProperty";

function safeJsonLdStringify(obj: unknown) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

interface WbbFighterJsonLDSchemaProps {
    fighter: RealWarbandPurchaseModel;
}

/**
 * This creates JSON-LD markup for the fighter on first render.
 */
const WbbFighterJsonLDSchema: React.FC<WbbFighterJsonLDSchemaProps> = ({ fighter }) => {
    const { warband } = useWarband();

    // Freeze the very first JSON string we generated
    const frozenJsonRef = useRef<string | null>(null);

    // Load equipment once
    const [equip, setEquip] = useState<RealWarbandPurchaseEquipment[] | null>(null);
    useEffect(() => {
        let alive = true;
        fighter.model
            .GetAllEquipForShow()
            .then((arr: RealWarbandPurchaseEquipment[] = []) => {
                if (alive) setEquip(arr);
            })
            .catch(() => {
                if (alive) setEquip([]); // fail-safe
            });
        return () => {
            alive = false;
        };
    }, [fighter?.model?.ID]);

    // Build current JSON string (or empty while data not ready) — NO hooks below this point
    let currentJson = "";
    if (warband && equip !== null) {
        const UserWarband = warband.warband_data;

        // URL of the page
        const base_url =
            typeof window !== "undefined" ? window.location.origin : "https://trench-companion.com";

        // URL to this warband
        const wb_url = base_url + "/warband/detail/" + warband.id;

        // list of equipment
        const equipment = equip.map((e: RealWarbandPurchaseEquipment) => {
            const name = e.equipment.GetName();
            const cost = e.purchase.ItemCost;
            const costType = getCostType(e.purchase.CostType);
            const id = e?.equipment?.ID;

            return {
                "@type": "Thing",
                // @TODO: use url and ID for linking
                name: name || "Equipment",
                additionalProperty: [
                    {
                        "@type": "PropertyValue",
                        name: "Cost",
                        value: cost,
                        unitText: costType
                    }
                ]
            };
        });


        const skills = fighter.model.GetSkillsList().map((skill: WarbandProperty) => {
            const name = skill.Name;
            const id = skill.ID;
            // @TODO: add description

            return {
                "@type": "DefinedTerm",
                // @TODO: use url and ID for linking
                name: name || "Skill",
                termCode: id,
            };
        });

        const injuries = fighter.model.GetInjuriesList().map((inj: WarbandProperty) => {
            const name = inj.Name;
            const id = inj.ID;
            // @TODO: add description

            return {
                "@type": "DefinedTerm",
                // @TODO: use url and ID for linking
                name: name || "Injury",
                termCode: id,
            };
        });

        const fighter_data = {
            "@context": "https://schema.org",
            "@type": "Thing",
            "@id": `${wb_url}#${fighter.model.ID}`,
            name: fighter.model.GetFighterName(),
            isPartOf: { "@id": wb_url },
            // @TODO: show image URL here as well as "image": url

            ...(fighter.model.GetWarbandNotes() && { description: fighter.model.GetWarbandNotes() }),
            ...(fighter.model.GetLore() && { text: fighter.model.GetLore() }),

            inLanguage: "en",

            additionalProperty: [
                {
                    "@type": "PropertyValue",
                    name: "Type",
                    value: fighter.model.GetMemberType()
                },
                {
                    "@type": "PropertyValue",
                    name: "Status",
                    value: fighter.model.GetMemberState()
                },
                { "@type": "PropertyValue", name: "XP", value: fighter.model.GetExperiencePoints() },
                { "@type": "PropertyValue", name: "BattleScars", value: fighter.model.GetBattleScars() },
                {
                    "@type": "PropertyValue",
                    name: "Total Value (D)",
                    value: fighter.purchase.GetTotalDucats(),
                    unitText: "Ducats"
                },
                {
                    "@type": "PropertyValue",
                    name: "Total Value (G)",
                    value: fighter.purchase.GetTotalGlory(),
                    unitText: "Glory"
                }
            ],

            hasPart: [
                {
                    "@type": "ItemList",
                    name: "Equipment",
                    itemListElement: equipment
                },
                {
                    "@type": "ItemList",
                    name: "Advancements",
                    itemListElement: skills
                },
                {
                    "@type": "ItemList",
                    name: "Injuries",
                    itemListElement: injuries
                },
            ]
        };

        currentJson = safeJsonLdStringify(fighter_data);
    }

    // Freeze once (hook is ALWAYS called; only writes when we have a non-empty JSON)
    useEffect(() => {
        if (currentJson && frozenJsonRef.current === null) {
            frozenJsonRef.current = currentJson;
        }
    }, [currentJson]);

    // Early exits AFTER all hooks have been called
    if (!warband) return null;
    if (equip === null) return null; // wait until loaded

    const jsonToRender = frozenJsonRef.current ?? currentJson;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonToRender }}
        />
    );
};

export default WbbFighterJsonLDSchema;
