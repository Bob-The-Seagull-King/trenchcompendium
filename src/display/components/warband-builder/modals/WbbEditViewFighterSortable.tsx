import WbbEditViewFighter from "../WbbEditViewFighter";
import {useSortable} from "@dnd-kit/sortable";
import {RealWarbandPurchaseModel} from "../../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import { CSS } from '@dnd-kit/utilities';
function WbbEditViewFighterSortable({
                             fighter,
                             index,
                             onClick,
                             isActive
                         }: {
    fighter: RealWarbandPurchaseModel;
    index: number;
    onClick: () => void;
    isActive: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: fighter.model.ID,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'manipulation', // for better mobile drag
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
}

export default WbbEditViewFighterSortable;