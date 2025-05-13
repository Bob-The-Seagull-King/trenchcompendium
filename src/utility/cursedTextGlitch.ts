import {useGlobalState} from "./globalstate";
import {useEffect, useRef, useState} from "react";

export function initGlobalTextGlitch() {

    // if (applyCurse !== 'true') return;

    const glitchInterval = 5000;
    const glitchDuration = 8000;

    const elements = document.querySelectorAll<HTMLElement>('.glitch');

    elements.forEach((el) => {
        setInterval(() => {

            const textNodes = getTextNodes(el);

            if (textNodes.length === 0) return;

            const node = textNodes[Math.floor(Math.random() * textNodes.length)];

            const original = node.nodeValue || '';
            (node as any)['__original'] = original; // store original

            const text = (node as any)['__original'];
            if (!text || text.length < 4) return;

            const truncatedGlitch = getGlitchTextByLength(original.length);
            // const truncatedGlitch = glitch.slice(0, text.length);

            const start = Math.floor(Math.random() * (text.length - truncatedGlitch.length));
            const before = text.slice(0, start);
            const after = text.slice(start + truncatedGlitch.length);

            const span = document.createElement('span');
            span.className = 'glitch-wrapper';
            span.innerHTML = `${before}<span class="glitch-active" data-text="${truncatedGlitch}">${truncatedGlitch}</span>${after}`;

            // Store the current span reference
            (node as any).__glitchSpan = span;

            const parent = node.parentNode;
            if (parent) {
                parent.replaceChild(span, node);
            }

            setTimeout(() => {
                const currentSpan = (node as any).__glitchSpan;
                // Only revert if this span is still in the DOM
                if (currentSpan && currentSpan.parentNode === parent) {
                    parent?.replaceChild(document.createTextNode(text), currentSpan);
                }
            }, glitchDuration);
        }, glitchInterval + Math.random() * 5000);
    });
}


function getTextNodes(node: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
            return n.parentElement?.classList.contains('glitch-active') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });
    while (walker.nextNode()) {
        const current = walker.currentNode as Text;
        if (current.nodeValue && current.nodeValue.trim().length > 0) {
            textNodes.push(current);
        }
    }
    return textNodes;
}


export function getGlitchTextByLength(targetLength: number): string {

    const glitchPhrases = [
        'Oh, Holy Father, we march with Your wrath in our hearts! Let our bodies be torn and our souls set aflame, for we are the Vengeance of the Lord. Through blood and fire, we cleanse the earth of the Devil’s taint. Guide our hands, strengthen our hearts, for we are Your sword!',
        'By the Blessed Flame, we march forth! Let our suffering be a sacrifice, our wounds a testament to Your glory. In the name of the Meta-Christ, we shall not falter, we shall not yield. We are the faithful, the forsaken, the hammer of Your vengeance upon the heretic’s skull. ',
        'By the Abyssal Flame, we forsake all that is pure! We march through the Valley of Tears, our flesh seared by the very breath of Hell. Let our suffering be a hymn to the Prince of Darkness, our blood a tribute to His glory! We are the Anointed, unbroken, unyielding. Through fire, we are reborn! Let our souls burn for eternity in His name!',
        'O Lord of Ash and Flame, we cast ourselves into the furnace of Your wrath! Through the gates of Hell, we march with broken bodies and twisted souls. Let the fires of torment shape us, let our flesh burn in devotion! We are Your Legion, bound in eternal darkness, our sins our strength. Let the wails of the damned guide our hands!',
        'You who stand upon the edge of the world, listen well. Turn your gaze upon the blackened sky and hear the whispers of the damned. The land is soaked with the tears of sinners, the earth choked by the stench of burning flesh. Do not look away. Feel the weight of every scream that echoes beneath your feet, the agony of souls bound in eternal torment. This is the fate of those who dare defy the Creator—this is what awaits you. Step forward into the darkness, for there is no light left. Embrace the decay that gnaws at your spirit, for salvation is an illusion. You are already lost. Let the shadows claim you.',
        'Bow your head, for the saints of darkness have walked among us. Their names carved into the very bones of this cursed world, are the true bearers of light in the void. In the depths where hope withers and the wails of the damned rise, they are the torchbearers. Worship them, for their suffering is the crucible that forged this war-torn earth. Their vision, like a blade, cleaves through the lies of false salvation, cutting through the veil that shields the weak from the truth. Mike, the harbinger of endless torment, and Tuomas, the architect of despair, lead us through the flames. Praise them, for they are the bringer of our reckoning. They are the prophets of the abyss, the apostles of the end. Let their names burn in your soul, for in their shadow, only the worthy shall rise.',
        'Praise him!',
        'Praise',
        'Let our suffering be a sacrifice.',
        'Our wounds a testament to your glory',
        'Upon endless Ash',
        'Eternal suffering',
        'Carve their names into your bones',
        'Blood',
        'Sacrifice',
        'Burn the heretic',
        'In the trenches, where hope withers and the wails of the damned rise'
    ];

    if (targetLength <= 0) return '';

    const cleanPhrases = glitchPhrases.flatMap(p => {
        return p
            .replace(/[.,!?]/g, '')
            .split(/\s+/)
            .map((_, i, arr) => arr.slice(i).join(' ')) // build all substrings starting from each word
            .filter(str => str.length === targetLength); // keep only exact matches
    });

    if (cleanPhrases.length > 0) {
        return cleanPhrases[Math.floor(Math.random() * cleanPhrases.length)];
    }

    // fallback: build from pool of words
    const wordPool = glitchPhrases
        .flatMap(phrase => phrase.split(/\s+/))
        .filter(word => word.length <= targetLength);

    let result = '';
    while (result.length < targetLength && wordPool.length > 0) {
        const remaining = targetLength - result.length;
        const candidates = wordPool.filter(word => word.length + (result ? 1 : 0) <= remaining);
        if (candidates.length === 0) break;
        const nextWord = candidates[Math.floor(Math.random() * candidates.length)];
        result += (result ? ' ' : '') + nextWord;
    }

    return result.padEnd(targetLength, '█').slice(0, targetLength);
}


/**
 * Curse text using zalgo
 * @param maxIntensity
 */
export function useIdleZalgoEffect(maxIntensity = 15, delay = 3000) {
    const [zalgoLevel, setZalgoLevel] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetZalgo = () => {
        setZalgoLevel(zalgoLevel -1 );
        if (timeoutRef.current) clearInterval(timeoutRef.current);

        timeoutRef.current = setInterval(() => {
            setZalgoLevel(prev => Math.min(prev + 1, maxIntensity));
        }, delay);
    };

    useEffect(() => {
        const events = ['keydown', 'mousedown', 'touchstart'];
        // const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        events.forEach(e => window.addEventListener(e, resetZalgo));

        resetZalgo();

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
            events.forEach(e => window.removeEventListener(e, resetZalgo));
        };
    }, []);

    return zalgoLevel;
}

export function applyZalgo(text: string, intensity = 1): string {
    const zalgoUp = ['̍','̎','̄','̅','̿','̑','̆','͒','͗','̇','̈','̊','͊','͋','̃','̂','̌','́','̋','̏'];
    const zalgoDown = ['̖','̗','̘','̜','̝','̞','̟','̠','̤','̥','̩','̪','̬','̯','̰','̱','̲','̳','ͅ','͈','͉'];
    const zalgoMid = ['̕','̛','̀','́','͘','̡','̢','̧','̨','̴','̵','̶','͜','͝'];

    const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    return text.split('').map(char => {
        if (char === ' ') return char;
        let result = char;

        for (let i = 0; i < intensity; i++) {
            result += rand(zalgoUp) + rand(zalgoDown);
            if (i > 1) result += rand(zalgoMid);
        }

        return result;
    }).join('');
}