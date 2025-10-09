// AppVersionChecker.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {SYNOD} from "../../../resources/api-constants";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateRight, faXmark} from "@fortawesome/free-solid-svg-icons";
import AlertCustom from "./AlertCustom";

/**
 * Keeps a SPA fresh by comparing a server-provided version string with a value
 * stored in localStorage under the key "app-version".
 *
 * LocalStorage shape:
 *   key: "app-version"
 *   value: { version: string; time: number }   // time = ms since epoch of last successful check
 *
 * Mount behavior:
 *   - Always fetch the remote version once.
 *   - Write the remote version + current timestamp to localStorage (initial alignment).
 *   - Never set `versionMismatch` on mount.
 *
 * Periodic behavior:
 *   - Consider checking every `checkIntervalMinutes`.
 *   - Only fetch if the last successful check is older than `maxAgeMinutes`.
 *   - If the fetched version differs from the stored version, set `versionMismatch = true`
 *     and keep the stored version (only refresh its timestamp), so the banner remains until user reloads.
 */

/** LocalStorage key + shape */
const LS_KEY = 'app-version';
type StoredVersion = { version: string; time: number };

/** API response shape */
type ApiVersionResponse = { version?: string };

export type AppVersionCheckerProps = {
    /** Optional override for the API endpoint; defaults to `${SYNOD.URL}/wp-json/synod/v1/app/version`. */
    endpoint?: string;
    /** Consider checking every N minutes (the freshness window still applies). Default: 20. */
    checkIntervalMinutes?: number;
    /** Freshness window in minutes; only fetch when last check is older than this. Default: 60. */
    maxAgeMinutes?: number;
    /** Skip background checks while the tab is hidden. Default: true. */
    onlyWhenVisible?: boolean;
};

/** Safe read from localStorage */
function readStored(): StoredVersion | null {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (!obj || typeof obj.version !== 'string' || typeof obj.time !== 'number') return null;
        return obj as StoredVersion;
    } catch {
        return null;
    }
}

/** Write a new version with a fresh timestamp */
function writeStored(version: string): StoredVersion | null {
    const payload: StoredVersion = { version, time: Date.now() };
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
        return payload;
    } catch {
        return null;
    }
}

/** Refresh timestamp for the currently stored version without changing it */
function touchStored(): StoredVersion | null {
    const cur = readStored();
    if (!cur) return null;
    return writeStored(cur.version);
}

/** Fetch remote version with cache-busting */
async function fetchRemoteVersion(endpoint: string): Promise<string | null> {
    try {
        const url = endpoint.includes('?') ? `${endpoint}&t=${Date.now()}` : `${endpoint}?t=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = (await res.json()) as ApiVersionResponse;
        const v = (json.version || '').trim();
        return v || null;
    } catch {
        return null;
    }
}

/** Default hard reload; customize if a softer UX is desired */
function performReload() {
    window.location.replace(window.location.href);
}

export default function AppVersionChecker({
                                              endpoint,
                                              checkIntervalMinutes = 1,
                                              maxAgeMinutes = 2,
                                              onlyWhenVisible = true,
                                          }: AppVersionCheckerProps) {
    const [versionMismatch, setVersionMismatch] = useState(false);

    /** Build the API endpoint from SYNOD.URL if none is provided */
    const apiEndpoint = useMemo(() => {
        return `${SYNOD.URL}/wp-json/synod/v1/app/version`;
    }, [endpoint]);

    const checkingRef = useRef(false);
    const intervalRef = useRef<number | null>(null);

    /** Core routine: fetch if due, compare, and update state/storage accordingly */
    const checkOnce = async (forceFetch = false, { isMount }: { isMount: boolean }) => {

        if (checkingRef.current) return;
        checkingRef.current = true;

        try {
            if (onlyWhenVisible && document.visibilityState !== 'visible' && !forceFetch) {
                return;
            }

            const local = readStored();
            const now = Date.now();
            const age = local ? now - local.time : Number.POSITIVE_INFINITY;
            const due = forceFetch || age >= maxAgeMinutes * 60_000;



            if (!due) return;

            const remote = await fetchRemoteVersion(apiEndpoint);
            if (!remote) return;

            if (isMount) {
                // Initial alignment: write whatever the server says and never show a mismatch on mount
                writeStored(remote);
                setVersionMismatch(false);
                return;
            }

            // Periodic comparisons after mount
            if (!local) {
                // No local state yet: align to remote and make sure the prompt is hidden
                writeStored(remote);
                setVersionMismatch(false);
                return;
            }

            if (remote !== local.version) {
                // Mismatch: show prompt and keep the stored version so the prompt persists
                setVersionMismatch(true);
                touchStored(); // refresh timestamp to avoid immediate re-fetch loops
                return;
            }

            // Match: refresh timestamp and ensure prompt is hidden
            writeStored(remote);
            setVersionMismatch(false);
        } finally {
            checkingRef.current = false;
        }
    };

    useEffect(() => {
        // Mount: always fetch once, align local storage, never flag mismatch
        checkOnce(true, { isMount: true });

        // Periodic: consider checks every N minutes; the routine fetches only if past freshness window
        const intervalMs = Math.max(1, checkIntervalMinutes) * 60_000;
        intervalRef.current = window.setInterval(() => {
            checkOnce(false, { isMount: false });
        }, intervalMs);

        // Be responsive when returning to the tab or regaining network
        const onVis = () => {
            if (document.visibilityState === 'visible') checkOnce(false, { isMount: false });
        };
        const onOnline = () => checkOnce(false, { isMount: false });

        document.addEventListener('visibilitychange', onVis);
        window.addEventListener('online', onOnline);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', onVis);
            window.removeEventListener('online', onOnline);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiEndpoint, checkIntervalMinutes, maxAgeMinutes, onlyWhenVisible]);


    const [debug_show, setdebug_show] = useState(true);


    // Minimal inline UI for mismatch; replace with your design system as needed
    if (versionMismatch) {
        return (
            <Modal show={true} className="WbbModalAddItem" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Update</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={'p-3'}>

                        <AlertCustom
                            type={'info'}
                            className={'mb-3'}
                        >
                            <h4>
                                {'New version available'}
                            </h4>
                            <p>
                                {'A new version of the app is available. Please reload the app to use the new version.'}
                                <br/>
                                {'If you have added the app to your home screen, you might need to kill the app and open it again.'}
                            </p>
                        </AlertCustom>

                        <button
                            onClick={performReload}
                            className={'btn btn-primary w-100 p-3'}
                        >
                            <FontAwesomeIcon icon={faRotateRight} className={'me-2'} />
                            Reload now
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return null;
}
