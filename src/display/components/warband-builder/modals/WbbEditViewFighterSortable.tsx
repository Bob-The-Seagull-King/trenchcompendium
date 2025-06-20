import React from 'react';
import WbbEditViewFighter from '../WbbEditViewFighter';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RealWarbandPurchaseModel } from '../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';

interface WbbEditViewFighterSortableProps {
    fighter: RealWarbandPurchaseModel;
    index: number;
    onClick: () => void;
    isActive: boolean;
}

const WbbEditViewFighterSortable: React.FC<WbbEditViewFighterSortableProps> = ({
                                                                                   fighter,
                                                                                   index,
                                                                                   onClick,
                                                                                   isActive
                                                                               }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: fighter.model.ID });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'manipulation', // improves mobile drag handling
        userSelect: 'none',         // ❌ disables text selection
        WebkitUserSelect: 'none',   // ❌ disables text selection on Safari
        WebkitTouchCallout: 'none', // ❌ disables iOS system context menu
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: isDragging ? '3' : '2',
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <WbbEditViewFighter
                item={fighter}
                index={index}
                onClick={onClick}
                isActive={isActive}
            />
        </div>
    );
};

export default WbbEditViewFighterSortable;
