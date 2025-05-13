import React from 'react';
import {applyZalgo, useIdleZalgoEffect} from "./cursedTextGlitch";

const CursedText: React.FC<{ children: string }> = ({ children }) => {
    const zalgoLevel = useIdleZalgoEffect();

    return <span className="zalgo-text">{applyZalgo(children, zalgoLevel)}</span>;
};

export default CursedText;

