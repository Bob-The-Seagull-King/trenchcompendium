export function initGlobalTextGlitch({
         glitchInterval = 5000,
         glitchDuration = 9000
     } = {}) {
    const elements = document.querySelectorAll<HTMLElement>('.glitch');

    elements.forEach((el) => {
        const textNodes = getTextNodes(el);

        if (textNodes.length === 0) return;

        setInterval(() => {

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

            // Replace text node with span
            const parent = node.parentNode!;

            if (parent) {
                parent.replaceChild(span, node);

            }

            setTimeout(() => {
                if (parent) {
                    parent.replaceChild(document.createTextNode(text), span);
                }
            }, glitchDuration);
        }, glitchInterval);
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

function getFixedLengthGlitchFragment(glitch: string, targetLength: number): string {
    const words = glitch.split(' ');
    const candidates: string[] = [];

    // Try multiple random starting points
    for (let attempt = 0; attempt < 50; attempt++) {
        let result = '';
        let length = 0;
        const start = Math.floor(Math.random() * words.length);

        for (let i = start; i < words.length; i++) {
            const word = words[i];
            const wordWithSpace = result.length > 0 ? ' ' + word : word;

            if (length + wordWithSpace.length > targetLength) break;

            result += wordWithSpace;
            length = result.length;

            if (length === targetLength) return result;
        }
    }

    // Fallback: cut any glitch string cleanly at word boundaries
    const clean = glitch.replace(/[^a-zA-Z0-9\s]/g, '').trim(); // remove special chars
    const fallback = clean.split(' ').reduce((acc, word) => {
        if (acc.length + word.length + 1 <= targetLength) {
            return acc.length > 0 ? acc + ' ' + word : word;
        }
        return acc;
    }, '');

    // Pad if needed
    return fallback.padEnd(targetLength, '█').slice(0, targetLength);
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