// DevGuard.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import AlertCustom from "./AlertCustom";

export interface DevGuardProps {
    /** Optional: override the dev host check (defaults to 'dev.trench-companion.com') */
    devHost?: string;
    /** Optional: password to unlock; if not provided, falls back to REACT_APP_DEV_GUARD_PASSWORD */
    expectedPassword?: string;
    /** Optional: where to persist the unlock flag; default 'session' */
    storage?: 'session' | 'local';
    /** Optional: storage key name; default 'DEV_GUARD_UNLOCKED' */
    storageKey?: string;
}

const DEFAULT_DEV_HOST = 'dev.trench-companion.com';
const DEFAULT_STORAGE_KEY = 'DEV_GUARD_UNLOCKED'; // change this to re-trigger the popup

const LIVE_IMPORT_URL = 'https://trench-companion.com/dev-import/'; // Zielseite auf LIVE
const STORAGE_KEY = 'userwarbanditem';

const DevGuard: React.FC<DevGuardProps> = ({
                                               devHost = DEFAULT_DEV_HOST,
                                               expectedPassword,
                                               storage = 'session',
                                               storageKey = DEFAULT_STORAGE_KEY,
                                           }) => {
    // Determine if we are on the dev host
    const isDevHost = typeof window !== 'undefined' && window.location.hostname === devHost;
    // const isDevHost = true;


    // If not on dev host, render nothing
    if (!isDevHost) return null;

    const expected = useMemo(() => {
        // Prefer prop, else env, else empty
        const fromEnv = (process.env.REACT_APP_DEV_GUARD_PASSWORD || '').trim();
        return (expectedPassword ?? fromEnv).trim();
    }, [expectedPassword]);

    // Storage helpers
    const store = storage === 'local' ? window.localStorage : window.sessionStorage;
    const isUnlockedInitially =
        typeof window !== 'undefined' && store.getItem(storageKey) === '1';

    const [isOpen, setIsOpen] = useState(!isUnlockedInitially);
    const [pwd, setPwd] = useState('');
    const [touched, setTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isCorrect = expected.length > 0 && pwd === expected;

    // Prevent background scroll when open; focus input
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // Focus input shortly after mount
        const t = setTimeout(() => inputRef.current?.focus(), 0);

        // Block ESC from closing anything outside
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        window.addEventListener('keydown', onKeyDown, { capture: true });

        return () => {
            document.body.style.overflow = prevOverflow;
            clearTimeout(t);
            window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
        };
    }, [isOpen]);

    // If password is missing, show a warning (but keep modal — so man merkt es)
    const showConfigWarning = isOpen && expected.length === 0;

    const handleUnlock = () => {
        setTouched(true);
        if (!isCorrect) return;
        store.setItem(storageKey, '1');
        setIsOpen(false);
    };

    // Stop clicks from closing the modal (no outside click close)
    const stop = (e: React.MouseEvent) => {
        e.stopPropagation();           // default nicht verhindern!
    };

    const handleImportClick = async () => {
        const text = localStorage.getItem(STORAGE_KEY) ?? '[]';

        // 1) In die Zwischenablage kopieren (Best-Effort)
        try {
            await navigator.clipboard.writeText(text);
            // Optionales Feedback:
            // alert('Warbands in Zwischenablage kopiert. Importseite wird geöffnet …');
        } catch (e) {
            // Fallback: Datei-Download, falls Clipboard blockiert ist.
            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'warbands.dev.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('Copy was blocked – JSON-file has been downloaded. Open the import page.');
        }

        // 2) LIVE-Importseite öffnen (neuer Tab)
        window.open(LIVE_IMPORT_URL, '_blank', 'noopener,noreferrer');
    };

    if (!isOpen) return null;

    return (
        <div
            className="DevGuard-Overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="devguard-title"
            onMouseDown={stop}
            onClick={stop}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <div
                className="DevGuard-Modal"
                style={{
                    width: 'min(520px, 92vw)',
                    background: '#111',
                    color: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                    padding: '24px 20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <h2 id="devguard-title" style={{ margin: 0, fontSize: 28, lineHeight: 1.3 }}>
                    Development Environment
                </h2>
                <p style={{ margin: '10px 0 18px', opacity: 0.9 }}>
                    You are on <strong>{devHost}</strong>. Please enter the dev password to continue.
                </p>

                <a href={"https://trench-companion.com"}
                    className={'btn btn-primary w-100 my-3'}
                >
                    Go to live site
                    <FontAwesomeIcon icon={faChevronRight} />
                </a>

                <AlertCustom
                    type={'info'}
                    className={'mb-3'}
                >
                    <h4>
                        {'Missing your warbands?'}
                    </h4>
                    <p>
                        {'If you have been using this dev site without creating an account, your warbands have been stored in the local storage of this site and are not available on the live site.'}
                        <br />
                        <br />
                        {'Click the button below to copy your local warband data and paste it on the migration page for the import.'}
                    </p>
                    <button type={'button'} onClick={handleImportClick}
                        className={'btn btn-secondary w-100'}
                    >
                        {'Migrate warbands to live site'}
                    </button>

                </AlertCustom>

                {showConfigWarning && (
                    <div
                        style={{
                            marginBottom: 12,
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: 'rgba(255,193,7,0.12)',
                            color: '#ffc107',
                            fontSize: 13,
                        }}
                    >
                        <strong>Warning:</strong> No password configured. Set
                        {' '}
                        <code>REACT_APP_DEV_GUARD_PASSWORD</code>
                        {' '}
                        in your environment, or pass <code>expectedPassword</code> to <code>{'<DevGuard />'}</code>.
                    </div>
                )}

                <label htmlFor="devguard-password" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>
                    Dev password
                </label>
                <input
                    id="devguard-password"
                    ref={inputRef}
                    type="password"
                    autoComplete="off"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    onBlur={() => setTouched(true)}
                    style={{
                        width: '100%',
                        padding: '5px 10px',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: '#191919',
                        color: '#fff',
                        outline: 'none',
                        marginBottom: 10,
                    }}
                />

                {touched && !isCorrect && expected.length > 0 && (
                    <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 8 }}>
                        Incorrect password.
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={!isCorrect}
                    className={'btn btn-secondary w-100 my-2'}
                >
                    Continue
                </button>

                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
                    Unlock is remembered for this tab (session).
                </div>
            </div>
        </div>
    );
};

export default DevGuard;
