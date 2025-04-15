import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface FactionItem {
    name: string;
    faction_id: string;
    sub_factions?: FactionItem[];
}

interface WbbFactionSelectItemProps {
    item: FactionItem;
    selectedFactionId: string | null;
    onSelect: (id: string, name: string) => void;
}
const WbbFactionSelectItem: React.FC<WbbFactionSelectItemProps> = ({ item, selectedFactionId, onSelect }) => {
    const isSelected = selectedFactionId === item.faction_id;

    return (
        <div className="WbbFactionSelectItem">
            <div
                className={`faction-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(item.faction_id, item.name)}
            >
                {item.name}

                {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="icon-inline-left-l" />
                )}
            </div>

            {item.sub_factions && item.sub_factions.length > 0 &&
                item.sub_factions.map((sub_item) => (
                    <WbbFactionSelectItem
                        key={sub_item.faction_id}
                        item={sub_item}
                        selectedFactionId={selectedFactionId}
                        onSelect={onSelect}
                    />
                ))}
        </div>
    );
};

export default WbbFactionSelectItem;