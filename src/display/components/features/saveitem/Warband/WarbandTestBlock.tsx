import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import 'react-toastify/dist/ReactToastify.css';

// Font Awesome
import { Button } from 'react-bootstrap';
import { WarbandManager } from '../../../../../classes/saveitems/Warband/WarbandManager';
import { UserWarband } from '../../../../../classes/saveitems/Warband/UserWarband';

const WarbandTestBlock = (prop: any) => {


    const [warbandproperty, setvwarbandproperty] = useState<UserWarband | null>(null)
    const [_keyvar, setkeyvar] = useState(0);

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with SaveWarbandDisplay.tsx</div>}>
            
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default WarbandTestBlock