import { CampaignFactory } from "../../../factories/warband/CampaignFactory";
import { ICampaignUser, CampaignUser } from "./CampaignUser";


export interface ICampaignAnnouncement {
    announcement_id: number;
    announcement_title: string;
    announcement_content: string;       // HTML
    announcement_date: number;          // unix ts (seconds)
    announcement_author: ICampaignUser;
}

// ---------- Domain: Announcement ----------
export class CampaignAnnouncement {
    private _id = 0;
    private _title = "";
    private _html = "";
    private _dateTs = 0;
    private _author!: CampaignUser;

    public constructor(dto: ICampaignAnnouncement) {
        this._id = dto.announcement_id;
        this._title = dto.announcement_title;
        this._html = dto.announcement_content ?? "";
        this._dateTs = dto.announcement_date ?? 0;
    }

    public async BuildUser(data : ICampaignAnnouncement) {

        const NewPlayer = await CampaignFactory.CreateCampaignUser(data.announcement_author);
        this._author = (NewPlayer);
    }

    get Id() { return this._id; }
    get Title() { return this._title; }

    /**
     * Gets the HTML as Markdown as it is saved in the DB
     * @constructor
     */
    get Html() { return this._html; }

    /**
     * Gets the HTML as rendered and safe HTML
     * @constructor
     */
    get MarkupHtml () {
        return CampaignAnnouncement.renderMiniMarkdown(this._html);
    }
    get Date() { return new Date(this._dateTs * 1000); }

    // Return data as readable string
    get DateStr() {
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',   // 'long' → "August"
            year: 'numeric',
        }).format(this.Date);
    }
    get Author() { return this._author; }


    // ---------------------------------------------
    // Markdown -> safe HTML (small Subset)
    // Supports: **bold**, *italic*, [Text](https://url)
    // ---------------------------------------------
    static renderMiniMarkdown(md: string): string {
        const escapeHtml = (s: string) =>
            s
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");

        const sanitizeUrl = (url: string): string | null => {
            try {
                const u = new URL(url);
                if (u.protocol === "http:" || u.protocol === "https:") {
                    return u.toString();
                }
            } catch (_) { /* noop */ }
            return null;
        };

        // Emphasis only for already escaped Text
        const applyEmphasis = (escaped: string) => {
            // **bold**
            escaped = escaped.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");

            // *italic*  (vermeidet **…**)
            escaped = escaped.replace(
                /(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g,
                "$1<em>$2</em>"
            );

            return escaped;
        };

        // escape complete html
        let text = escapeHtml(md || "");

        // Extract links and replace with placeholder
        //    Supports Bold/Italic in Link-Label
        const linkHTML: string[] = [];
        text = text.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            (_m, label: string, href: string) => {
                const safe = sanitizeUrl(href);
                if (!safe) {
                    // Ungültige URL -> nur Label ausgeben (mit Emphasis möglich)
                    return applyEmphasis(escapeHtml(label));
                }
                const labelEscaped = escapeHtml(label);
                const labelWithEmphasis = applyEmphasis(labelEscaped);

                const html =
                    `<a href="${safe}" target="_blank" rel="nofollow noopener">` +
                    `${labelWithEmphasis}</a>`;

                const token = `@@L${linkHTML.length}@@`;
                linkHTML.push(html);
                return token;
            }
        );

        // Emphasis remaining Text
        text = applyEmphasis(text);

        // Reset link Placeholder
        text = text.replace(/@@L(\d+)@@/g, (_m, i: string) => linkHTML[+i] || "");

        return text;
    }
}
