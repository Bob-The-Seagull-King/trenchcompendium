import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import { useWarband } from '../../../../context/WarbandContext';
import { getCostType } from '../../../../utility/functions';
import SynodModelImage from "../../../../utility/SynodModelImage";
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";
import { CachedFactionModel } from '../../../../classes/saveitems/Warband/UserWarband';

interface Fighter {
    id: string;
    name: string;
}

interface WbbModalAddFighterMercenaryProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighters: FactionModelRelationship[]) => void;
}

const WbbModalAddFighterMercenary: React.FC<WbbModalAddFighterMercenaryProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<FactionModelRelationship[]>([])
    const [cache, setCache] = useState<CachedFactionModel>({});
    const [keyvar, setkevvar] = useState(0);
    

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };
        
    useEffect(() => {
        async function SetModelOptions() {
            const options = await warband?.warband_data.GetMercenaryFighterOptions()
            if (options != undefined) {
                setListofOptions(options)
                const tempcache = warband? warband.warband_data.ModelRelCache : {}
                const keys = Object.keys(tempcache)
                const fincache : CachedFactionModel = {}
                for (let i = 0; i < keys.length; i++) {
                    if ((tempcache[keys[i]].facrel.Mercenary == true)) {
                        fincache[keys[i]] = tempcache[keys[i]]
                    }
                }
                setCache(fincache)
                setkevvar(keyvar + 1)
            }
        }
    
        SetModelOptions();
    }, [show]);


    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (selectedId) {
            const selected = listofoptions.filter((f) => f.ID === selectedId);
            onSubmit(selected);
            setSelectedId(null); // clear selection
            onClose();
        }
    });

    return (
        <Modal show={show} onHide={onClose} className={'WbbModalAddItem WbbModalAddFighter WbbModalAddFighterMercenary'} centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Mercenary</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {Object.keys(cache).map((item, index) => (
                    <div
                        key={cache[item].facrel.ID}
                        className={`select-item ${selectedId === cache[item].facrel.ID ? 'selected' : ''} ${listofoptions.includes(cache[item].facrel)? '' : 'disabled'}`}
                        onClick={() => {
                            if (listofoptions.includes(cache[item].facrel)) {
                                setSelectedId(cache[item].facrel.ID)
                            }
                        }}
                    >
                        <div className={'model-image-wrap'}>
                            <SynodModelImage
                                modelSlug={cache[item].facrel.GetSlug()}
                                size="small"
                                className={'model-image'}
                            />
                        </div>
                        <span className={'item-name'}>
                            {cache[item].facrel.Model.GetName()}
                        </span>
                        <span className={'item-cost'}>
                            {cache[item].facrel.Cost + " " + getCostType(cache[item].facrel.CostType)}
                        </span>
                    </div>
                ))}
                {
                    /** TODO Handle Style */
                }
                <div className="rules-card ">
                    <div className={'rules-card-content form-text'}>
                        {'Trench Dogs and their variants are considered Exploration-Items, not regular mercenaries.'}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add Mercenary'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddFighterMercenary;
