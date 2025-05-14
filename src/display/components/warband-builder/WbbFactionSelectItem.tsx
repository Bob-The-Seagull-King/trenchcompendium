import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FactionCollection } from '../../../classes/feature/faction/FactionCollection';
import { Faction } from '../../../classes/feature/faction/Faction';
import SynodFactionImage from "../../../utility/SynodFactionImage";

interface WbbFactionSelectItemProps {
    item?: FactionCollection;
    trueitem : Faction;
    selectedFaction: Faction | null;
    onSelect: (fac : Faction) => void;
}
const WbbFactionSelectItem: React.FC<WbbFactionSelectItemProps> = ({ item, trueitem, selectedFaction, onSelect }) => {
    const isSelected = (selectedFaction != null) && selectedFaction.ID === trueitem.ID;

    return (
        <div className="WbbFactionSelectItem">
            <div
                className={`faction-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(trueitem)}
            >
                <div className={'faction-name'}>
                    {trueitem.Name}
                </div>

                <div className={'faction-image-wrap'}>
                    <SynodFactionImage
                        factionSlug={trueitem.GetID()}
                        className={'faction-image'}
                    />
                </div>
            </div>

            {item != undefined &&
                <>
                    {item.SubModelsList.filter((facvar) => (facvar.var_name != "base")).length > 0 &&
                        item.SubModelsList.filter((facvar) => (facvar.var_name != "base")).map((sub_item) => (
                            <WbbFactionSelectItem
                                key={sub_item.faction.ID}
                                trueitem={sub_item.faction}
                                selectedFaction={selectedFaction}
                                onSelect={onSelect}
                            />
                    ))}
                </>
            }
        </div>
    );
};

export default WbbFactionSelectItem;