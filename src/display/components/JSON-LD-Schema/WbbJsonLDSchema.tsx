// WbbJsonLDSchema.tsx
import React, { useMemo } from "react";
import { useWarband } from "../../../context/WarbandContext";
import {RealWarbandPurchaseModel, WarbandPurchase} from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";

/**
 * Hilfsfunktion: JSON-LD sicher serialisieren.
 * (verhindert </script>-Breakout & < in Strings)
 */
function safeJsonLdStringify(obj: unknown) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

/** Kleine Typ-Skizze – passe sie an deine echten Typen an */
type SumWarband = {
    id: number | string;
    // häufig bei dir: warband.warband_data
    warband_data?: any;
    // Falls du Name/Notes/Images auch top-level hast:
    name?: string;
    notes?: string;
    imageUrl?: string;
    // Timestamps für dateCreated/Modified (ISO)
    createdAt?: string;
    updatedAt?: string;
};

const WbbJsonLDSchema: React.FC = () => {
    const { warband }:{ warband: SumWarband | null } = useWarband();

    // Früher Return, wenn nichts da ist
    if (!warband) return null;

    // ---------- URL/IDs bestimmen ----------

    const factionBaseURL= useMemo(() => {
        // Falls du den Pfad anders hast, hier anpassen:
        const base = typeof window !== "undefined" ? window.location.origin : "https://trench-companion.com";
        return `${base}/compendium/faction/`;
    }, []);

    // Baue dir hier deine kanonische Detail-URL:
    const canonicalUrl = useMemo(() => {
        // Falls du den Pfad anders hast, hier anpassen:
        const base = typeof window !== "undefined" ? window.location.origin : "https://trench-companion.com";
        return `${base}/warband/detail/${warband.id}`;
    }, [warband?.id]);

    const lang = "en"; // oder aus Settings ableiten

    // ---------- MAPPER: Warband-Grunddaten ----------
    const wbName =
        warband?.name ??
        warband?.warband_data?.Name ??
        `Warband #${warband.id}`;

    const wbNotes =
        warband?.notes ??
        warband?.warband_data?.Notes ??
        undefined;

    const wbImage =
        warband?.imageUrl ??
        warband?.warband_data?.Image ??
        undefined;

    const dateCreated =
        warband?.createdAt ??
        warband?.warband_data?.DateCreated ??
        undefined;

    const dateModified =
        warband?.updatedAt ??
        warband?.warband_data?.DateModified ??
        undefined;

    // ---------- MAPPER: Faction ----------
    const factionName =
        warband?.warband_data?.Faction?.MyFaction?.Name ??
        warband?.warband_data?.Faction?.Name ??
        undefined;

    const factionUrl =
        warband?.warband_data?.Faction?.MyFaction?.ID
            ? `${factionBaseURL}${warband.warband_data.Faction.MyFaction.ID}`
            : undefined;

    // ---------- MAPPER: Stash ----------
    const stashItems: Array<{ name: string; qty?: number; unit?: string }> =
        (warband?.warband_data?.Stash?.Items || []).map((it: any) => ({
            name: it?.Name ?? it?.name ?? "Item",
            qty: it?.Quantity ?? it?.qty ?? undefined,
            unit: it?.Unit ?? undefined,
        }));

    const stashValueD = warband?.warband_data?.Stash?.TotalD ?? undefined;
    const stashValueG = warband?.warband_data?.Stash?.TotalG ?? undefined;

    // ---------- MAPPER: Exploration ----------
    const explorationLocations: Array<{ name: string }> =
        (warband?.warband_data?.Exploration?.Locations || []).map((l: any) => ({
            name: l?.Name ?? l?.name ?? "Location",
        }));

    // ---------- MAPPER: Models ----------
    type ModelForLd = {
        id?: string | number;
        name?: string;
        displayName?: string;
        image?: string;
        notes?: string;
        type?: "Elite" | "Troop" | "Mercenary" | string;
        xp?: number;
        battleScars?: number;
        totalD?: number;
        totalG?: number;
        equipment?: Array<{ name: string }>;
        advancements?: Array<{ name: string }>;
        injuries?: Array<{ name: string }>;
        options?: Array<{ name: string }>;
    };

    // kleine Helper, damit es robust ist, egal ob das Model unter `model` oder `HeldObject` hängt
    const getModelObj = (p: any) => p?.model ?? p?.HeldObject ?? p;
    const getPurchaseObj = (p: any) => p?.purchase ?? p;

    const models: ModelForLd[] = (
        (warband?.warband_data?.Models ?? []) as RealWarbandPurchaseModel[]
    ).map((purchaseItem, index) => {
        const model = getModelObj(purchaseItem);
        const purchase = getPurchaseObj(purchaseItem);

        return {
            id: model?.ID ?? `model-${index}`,
            name:
                model?.GetModelName?.() ??
                model?.ModelName ??
                model?.Name ??
                "Model",
            displayName:
                model?.GetFighterName?.() ??
                model?.FighterName ??
                undefined,
            image: model?.Image ?? undefined,
            notes: model?.Notes ?? undefined,
            type: model?.IsElite?.()
                ? "Elite"
                : model?.IsMercenary?.()
                    ? "Mercenary"
                    : "Troop",
            xp: model?.GetExperiencePoints?.() ?? model?.XP ?? 0,
            battleScars: model?.GetBattleScars?.() ?? model?.BattleScars ?? 0,
            totalD: purchase?.GetTotalDucats?.() ?? model?.TotalD ?? undefined,
            totalG: purchase?.GetTotalGlory?.() ?? model?.TotalG ?? undefined,

            // Je nach Struktur deiner Klassen ggf. anpassen:
            equipment: (model?.ModelEquipments ?? []).map((e: any) => ({
                name:
                    e?.MyEquipment?.SelfDynamicProperty?.OptionChoice?.Name ??
                    e?.Name ??
                    "Equipment",
            })),
            advancements:
                (model?.GetSkillsList?.() ?? model?.Skills ?? []).map((a: any) => ({
                    name: a?.Name ?? "Advancement",
                })),
            injuries:
                (model?.GetInjuriesList?.() ?? model?.Injuries ?? []).map((i: any) => ({
                    name: i?.Name ?? "Injury",
                })),
            options: (model?.Options ?? []).map((o: any) => ({
                name: o?.Name ?? "Option",
            })),
        };
    });

    // ---------- JSON-LD Objekt zusammenbauen (Collection) ----------
    const jsonLd = useMemo(() => {
        // Hilfsbuilder für PropertyValue
        const pv = (name: string, value: unknown, unitText?: string) =>
            value === undefined || value === null
                ? null
                : ({
                    "@type": "PropertyValue",
                    name,
                    value,
                    ...(unitText ? { unitText } : {}),
                });

        // Stash als ItemList
        const stashList =
            stashItems.length > 0
                ? {
                    "@type": "ItemList",
                    name: "Stash",
                    itemListElement: stashItems.map((it) => ({
                        "@type": "Product",
                        name: it.name,
                        ...(it.qty
                            ? {
                                additionalProperty: [
                                    {
                                        "@type": "PropertyValue",
                                        name: "quantity",
                                        value: it.qty,
                                        ...(it.unit ? { unitText: it.unit } : {}),
                                    },
                                ],
                            }
                            : {}),
                    })),
                }
                : null;

        // Exploration als ItemList
        const explorationList =
            explorationLocations.length > 0
                ? {
                    "@type": "ItemList",
                    name: "Exploration Locations",
                    itemListElement: explorationLocations.map((l) => ({
                        "@type": "Place",
                        name: l.name,
                    })),
                }
                : null;

        // Models als ItemList
        const modelsList =
            models.length > 0
                ? {
                    "@type": "ItemList",
                    name: "Models",
                    itemListElement: models.map((m) => {
                        const additionalProperty = [
                            pv("Type", m.type),
                            pv("XP", m.xp),
                            pv("BattleScars", m.battleScars),
                            pv("Total Value (D)", m.totalD, "Ducats"),
                            pv("Total Value (G)", m.totalG, "Glory"),
                        ].filter(Boolean);

                        const partLists = [
                            m.equipment?.length
                                ? {
                                    "@type": "ItemList",
                                    name: "Equipment",
                                    itemListElement: m.equipment.map((e) => ({
                                        "@type": "Product",
                                        name: e.name,
                                    })),
                                }
                                : null,
                            m.advancements?.length
                                ? {
                                    "@type": "ItemList",
                                    name: "Advancements",
                                    itemListElement: m.advancements.map((a) => ({
                                        "@type": "Thing",
                                        name: a.name,
                                    })),
                                }
                                : null,
                            m.injuries?.length
                                ? {
                                    "@type": "ItemList",
                                    name: "Injuries",
                                    itemListElement: m.injuries.map((i) => ({
                                        "@type": "Thing",
                                        name: i.name,
                                    })),
                                }
                                : null,
                            m.options?.length
                                ? {
                                    "@type": "ItemList",
                                    name: "Weitere Optionen",
                                    itemListElement: m.options.map((o) => ({
                                        "@type": "Thing",
                                        name: o.name,
                                    })),
                                }
                                : null,
                        ].filter(Boolean);

                        return {
                            "@type": "Thing",
                            "@id": m.id ? `${canonicalUrl}#model-${m.id}` : undefined,
                            name: m.displayName || m.name || "Model",
                            ...(m.image ? { image: m.image } : {}),
                            ...(m.notes ? { text: m.notes } : {}),
                            ...(additionalProperty.length ? { additionalProperty } : {}),
                            ...(partLists.length ? { hasPart: partLists } : {}),
                        };
                    }),
                }
                : null;

        // Top-Level: WebPage mit mainEntity = Collection
        const mainEntity: any = {
            "@type": "Collection",
            "@id": canonicalUrl,
            url: canonicalUrl,
            name: wbName,
            ...(wbNotes ? { description: wbNotes } : {}),
            ...(wbImage ? { image: wbImage } : {}),
            identifier: `warband-${warband.id}`,
            ...(dateCreated ? { dateCreated } : {}),
            ...(dateModified ? { dateModified } : {}),
            ...(factionName
                ? {
                    about: {
                        "@type": "Thing",
                        name: factionName,
                        ...(factionUrl ? { url: factionUrl } : {}),
                    },
                }
                : {}),
        };

        // additionalProperty am Warband-Top-Level
        const topProps = [pv("Stash Value (D)", stashValueD, "Ducats"), pv("Stash Value (G)", stashValueG, "Glory")].filter(
            Boolean
        );
        if (topProps.length) (mainEntity as any).additionalProperty = topProps;

        // hasPart zusammenbauen
        const parts = [stashList, explorationList, modelsList].filter(Boolean);
        if (parts.length) (mainEntity as any).hasPart = parts;

        // WebPage-Wrapper (empfohlen)
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            inLanguage: lang,
            name: `Warband: ${wbName}`,
            mainEntity,
        };
    }, [
        canonicalUrl,
        dateCreated,
        dateModified,
        explorationLocations,
        factionName,
        factionUrl,
        lang,
        models,
        stashItems,
        stashValueD,
        stashValueG,
        wbImage,
        wbName,
        wbNotes,
        warband?.id,
    ]);

    return (
        <script
            type="application/ld+json"
            // Kein pretty print in Prod; safeJson gegen </script>-Breakout
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
        />
    );
};

export default WbbJsonLDSchema;
