// src/display/components/JSON-LD-Schema/CMCampaignJsonLDSchema.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { useCampaign } from "../../../context/CampaignContext";
import { CampaignUser } from "../../../classes/saveitems/Campaign/CampaignUser";
import { CampaignWarband } from "../../../classes/saveitems/Campaign/CampaignWarband";
import { CampaignAnnouncement } from "../../../classes/saveitems/Campaign/CampaignAnnouncement";

/** Escape for JSON-LD <script> */
function safeJsonLdStringify(obj: unknown) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}

/** Base-URL of page */
function getBaseUrl() {
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin;
    }
    return "https://trench-companion.com";
}

/** Trim helper */
function s(v: unknown): string | undefined {
    if (typeof v === "string") {
        const t = v.trim();
        return t.length ? t : undefined;
    }
    return undefined;
}

/** ISO-Date helper */
function isoDate(v: unknown): string | undefined {
    try {
        if (!v) return undefined;
        const d = new Date(v as any);
        if (isNaN(d.getTime())) return undefined;
        return d.toISOString();
    } catch {
        return undefined;
    }
}

/** Faction path helper (handles variants) */
function factionPath(slug: string | undefined) {
    if (typeof slug !== "string") return "";
    const clean = slug.trim().replace(/^\/+|\/+$/g, "");
    if (!clean) return "";
    const fvIdx = clean.indexOf("_fv_");
    if (fvIdx !== -1) {
        const base = clean.slice(0, fvIdx);
        return `${base}/${clean}`;
    }
    return `/${clean}/`;
}

const CMCampaignJsonLDSchema: React.FC = () => {
    const { campaign } = useCampaign();

    const baseUrl = getBaseUrl();
    const pageUrl =
        (typeof window !== "undefined" ? window.location.href : `${baseUrl}/campaigns`) ||
        `${baseUrl}/campaigns`;

    /** Freeze first working JSON */
    const frozenJsonRef = useRef<string | null>(null);

    /** Pull primitives/arrays from campaign safely */
    const { campaignName, campaignDescription, players, warbands, announcements } = useMemo(() => {
        if (!campaign) {
            return {
                campaignName: undefined as string | undefined,
                campaignDescription: undefined as string | undefined,
                players: [] as CampaignUser[],
                warbands: [] as CampaignWarband[],
                announcements: [] as CampaignAnnouncement[],
            };
        }
        return {
            campaignName: campaign.GetName(),
            campaignDescription: campaign.GetDescription(),
            players: (campaign.GetPlayers() ?? []) as CampaignUser[],
            warbands: (campaign.GetWarbands() ?? []) as CampaignWarband[],
            announcements: (campaign.GetAnnouncements() ?? []) as CampaignAnnouncement[],
        };
    }, [campaign]);

    /** Player entities (Person) */
    const playerEntities = useMemo(() => {
        return players.map((p) => {
            const id = p.Id;
            const name = p.Name;
            const profileUrl = p.ProfileUrl;
            const statusText = p.IsPremium ? "premium member" : "free member";
            const pid = profileUrl ?? (id != null ? `${pageUrl}#player-${id}` : undefined);

            const person: any = {
                "@type": "Person",
                ...(pid && { "@id": pid, url: pid }),
                ...(name && { name }),
                ...(id != null && { identifier: `player-${id}` }),
            };

            if (statusText) {
                person.additionalProperty = [
                    { "@type": "PropertyValue", name: "Member Status", value: statusText },
                ];
            }

            return person;
        });
    }, [players, pageUrl]);

    /** ItemList for players */
    const playersList = useMemo(
        () => ({
            "@type": "ItemList",
            name: "Players",
            itemListElement: playerEntities.map((person, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: person["@id"] ? { "@id": person["@id"] } : person,
            })),
        }),
        [playerEntities]
    );

    /** Warband entities */
    const warbandEntities = useMemo(() => {
        return warbands.map((wb) => {
            const id = wb.Id;
            const wbUrl = wb.WarbandUrl;
            const name = wb.WarbandName;

            const factionName = wb.FactionName;
            const faction_path = factionPath(wb.FactionSlug);
            // Wichtig: kein doppelter Slash
            const factionUrl = `${baseUrl}/compendium/faction${faction_path}`;

            const valDucats = wb.RatingDucats;
            const valGlory = wb.RatingGlory;
            const victoryPts = wb.VictoryPoints;

            const wbObj: any = {
                "@type": "Thing",
                ...(wbUrl && { "@id": wbUrl, url: wbUrl }),
                ...(name && { name }),
                ...(id != null && { identifier: `warband-${id}` }),
            };

            if (factionName || factionUrl) {
                wbObj.about = {
                    "@type": "Thing",
                    ...(factionName && { name: factionName }),
                    ...(factionUrl && { url: factionUrl }),
                };
            }

            type PropertyVal = {
                "@type": "PropertyValue";
                name: string;
                value: string | number;
                unitText?: string;
            };

            const additionalProps = [
                ...(typeof valDucats === "number"
                    ? [{ "@type": "PropertyValue", name: "Value (Ducats)", value: valDucats, unitText: "Ducats" } as const]
                    : []),
                ...(typeof valGlory === "number"
                    ? [{ "@type": "PropertyValue", name: "Value (Glory)", value: valGlory, unitText: "Glory" } as const]
                    : []),
                ...(typeof victoryPts === "number"
                    ? [{ "@type": "PropertyValue", name: "Victory Points", value: victoryPts } as const]
                    : []),
            ] satisfies PropertyVal[];

            wbObj.additionalProperty = additionalProps;

            return wbObj;
        });
    }, [warbands, baseUrl]);

    /** ItemList for warbands */
    const warbandsList = useMemo(
        () => ({
            "@type": "ItemList",
            name: "Warbands",
            itemListElement: warbandEntities.map((wb, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: wb["@id"] ? { "@id": wb["@id"] } : wb,
            })),
        }),
        [warbandEntities]
    );

    /**
     * Index: mehrere Schlüssel → ein @id (URL)
     *  - ProfileUrl
     *  - String(Id) und "player-<Id>"
     *  - Nickname / Name
     */
    const playerIdIndex = useMemo(() => {
        const map = new Map<string, string>();
        players.forEach((p) => {
            const id = p.Id;
            const pid = p.ProfileUrl ?? (id != null ? `${pageUrl}#player-${id}` : undefined);
            if (!pid) return;

            // immer URL → URL
            map.set(pid, pid);

            if (id != null) {
                map.set(String(id), pid);
                map.set(`player-${id}`, pid);
            }
            if (p.Nickname) map.set(p.Nickname, pid);
            if (p.Name) map.set(p.Name, pid);
        });
        return map;
    }, [players, pageUrl]);

    /** Announcement list */
    const announcementsList = useMemo(() => {
        const items = (announcements || []).map((a, i) => {
            const id = a.Id;
            const title = s(a.Title);
            const body = s(a.Html);
            const date = isoDate(a.Date);

            // Author (CampaignUser)
            const authorObj = a.Author;
            let authorIdUrl: string | undefined;

            if (authorObj) {
                const aid = authorObj.Id;
                const aurl = authorObj.ProfileUrl;
                const anick = authorObj.Nickname;
                const aname = (authorObj as any).Name as string | undefined;

                authorIdUrl =
                    (aurl && playerIdIndex.get(aurl)) ||
                    (aid != null && playerIdIndex.get(String(aid))) ||
                    (aid != null && playerIdIndex.get(`player-${aid}`)) ||
                    (anick && playerIdIndex.get(anick)) ||
                    (aname && playerIdIndex.get(aname)) ||
                    undefined;
            }

            const annId = `${pageUrl}#announcement-${id}`;
            const item: any = {
                "@type": "Article",
                "@id": annId,
                ...(title && { headline: title }),
                ...(date && { datePublished: date }),
                ...(body && { articleBody: body }),
            };
            if (authorIdUrl) {
                item.author = { "@id": authorIdUrl };
            }

            return {
                "@type": "ListItem",
                position: i + 1,
                item,
            };
        });

        return {
            "@type": "ItemList",
            name: "Announcements",
            itemListElement: items,
        };
    }, [announcements, pageUrl, playerIdIndex]);

    /** Whole JSON-LD */
    const currentJson = useMemo(() => {
        const webPage: any = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            inLanguage: "en",
            ...(campaignName && { name: `Campaign: ${campaignName}` }),
        };

        if (!campaign) {
            return safeJsonLdStringify(webPage);
        }

        const mainEntity: any = {
            "@type": "Collection",
            "@id": pageUrl,
            url: pageUrl,
            ...(campaignName && { name: campaignName }),
            ...(campaignDescription && { description: campaignDescription }),
            mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
            hasPart: [playersList, warbandsList, announcementsList],
        };

        const schema = {
            ...webPage,
            mainEntity,
        };

        return safeJsonLdStringify(schema);
    }, [campaign, campaignName, campaignDescription, pageUrl, playersList, warbandsList, announcementsList]);

    // Freeze first valid JSON when campaign exists
    useEffect(() => {
        if (frozenJsonRef.current === null && campaign) {
            frozenJsonRef.current = currentJson;
        }
    }, [currentJson, campaign]);

    const jsonToRender = frozenJsonRef.current ?? (campaign ? currentJson : null);
    if (!campaign || !jsonToRender) return null;

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonToRender }} />;
};

export default CMCampaignJsonLDSchema;
