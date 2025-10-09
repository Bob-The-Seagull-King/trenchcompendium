// DevImport.tsx
import React, { useEffect, useRef, useState } from 'react';
import AlertCustom from "../components/generics/AlertCustom";

type AnyObj = Record<string, any>;

type WarbandData = {
    id?: string;
    name?: string;
    [k: string]: any;
};

type WarbandItem = {
    id?: string | number;
    warband_data?: WarbandData;
    [k: string]: any;
};

const STORAGE_KEY = 'userwarbanditem';
const REDIRECT_URL = '/warband';
const IMPORT_SUFFIX = ' - imported';

const isWarbandItem = (v: unknown): v is WarbandItem =>
    !!v && typeof v === 'object' && 'warband_data' in (v as AnyObj);

const normalizeArray = (input: unknown): WarbandItem[] => {
    if (Array.isArray(input)) return input as WarbandItem[];
    if (input && typeof input === 'object') return [input as WarbandItem];
    return [];
};

const safeParseJson = (raw: string): unknown => {
    try {
        return JSON.parse(raw);
    } catch {
        return undefined;
    }
};

const appendSuffixOnce = (name?: string) => {
    if (!name || typeof name !== 'string') return name;
    const trimmed = name.trimEnd();
    if (trimmed.endsWith(IMPORT_SUFFIX)) return trimmed; // already suffixed
    return `${trimmed}${IMPORT_SUFFIX}`;
};

const DevImport: React.FC = () => {
    const [text, setText] = useState('');
    const [status, setStatus] = useState<string>('');
    const triedAutoPaste = useRef(false);

    // Try to auto-paste clipboard (best effort; many browsers require a user gesture)
    useEffect(() => {
        const tryClipboard = async () => {
            if (triedAutoPaste.current) return;
            triedAutoPaste.current = true;
            if (!navigator.clipboard?.readText) return;
            try {
                const clip = await navigator.clipboard.readText();
                if (clip && !text) {
                    setText(clip);
                    setStatus('Data inserted automatically.');
                }
            } catch {
                // ignore: user gesture required or permission denied
            }
        };
        // attempt once on mount, and once when page gains focus
        tryClipboard();
        const onFocus = () => tryClipboard();
        window.addEventListener('focus', onFocus, { once: true });
        return () => window.removeEventListener('focus', onFocus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePaste = async () => {
        if (!navigator.clipboard?.readText) {
            setStatus('Automatic insert failed. Please insert manually');
            return;
        }
        try {
            const clip = await navigator.clipboard.readText();
            setText(clip);
            setStatus('Inserted from clipboard');
        } catch (e: any) {
            setStatus('Clipboard could not be read. Use manual insert.');
        }
    };

    const handleImport = () => {
        const raw = text.trim();
        if (!raw) {
            setStatus('No JSON found');
            return;
        }

        const parsed = safeParseJson(raw);
        if (!parsed) {
            setStatus('Invalid JSON');
            return;
        }

        // Incoming list (DEV)
        const incomingAll = normalizeArray(parsed).filter(isWarbandItem);

        if (!incomingAll.length) {
            setStatus('No valid warbands found');
            return;
        }

        // Load existing (LIVE)
        let existing: WarbandItem[] = [];
        try {
            const cur = localStorage.getItem(STORAGE_KEY);
            if (cur) {
                const p = safeParseJson(cur);
                if (Array.isArray(p)) existing = p as WarbandItem[];
            }
        } catch {
            // treat as empty
        }

        // Index existing by warband_data.id (fallback to item.id → finally JSON string)
        const keyOf = (it: WarbandItem) =>
            it?.warband_data?.id ??
            (it?.id != null ? String(it.id) : JSON.stringify(it));

        const index = new Map<string, WarbandItem>();
        for (const it of existing) index.set(keyOf(it), it);

        // Prepare incoming: append " - imported" to name (once), only if not already present
        const prepared: WarbandItem[] = incomingAll.map((it) => {
            const clone: WarbandItem = JSON.parse(JSON.stringify(it)); // deep-ish clone
            if (clone.warband_data) {
                clone.warband_data.name = appendSuffixOnce(clone.warband_data.name);
            }
            return clone;
        });

        // Append new ones (do NOT overwrite existing)
        let appended = 0;
        for (const it of prepared) {
            const k = keyOf(it);
            if (!index.has(k)) {
                index.set(k, it);
                appended++;
            }
        }

        const merged = Array.from(index.values());

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e: any) {
            setStatus(`Import failed: ${e?.message ?? String(e)}`);
            return;
        }

        setStatus(`Import successful. ${appended} new warbands added. redirecting ...`);
        // Redirect to /warband after a short delay
        window.setTimeout(() => {
            window.location.assign(REDIRECT_URL);
        }, 600);
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>Warband Import (DEV → LIVE)</h1>
            <p>
                {'Insert the JSON Dump from the dev site here. The import will add those warbands to your local warbands. Duplicates will not be added.'}
            </p>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="JSON from clipboard will be shown here or paste manually"
                style={{
                    width: '100%',
                    minHeight: 220,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    marginTop: 8,
                }}
            />

            <AlertCustom
                className={'my-3'}
                type={'info'}
            >
                {status}
            </AlertCustom>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <button type="button" onClick={handlePaste} className={'btn btn-primary'}>
                    Step 1: Add from clipboard
                </button>
                <br />
                <button type="button" onClick={handleImport} className={'btn btn-secondary'}>
                    Step 2: Import warbands
                </button>
            </div>


        </div>
    );
};

export default DevImport;
