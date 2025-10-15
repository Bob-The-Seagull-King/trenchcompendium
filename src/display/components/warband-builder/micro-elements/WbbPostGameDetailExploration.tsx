import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faChevronLeft,
    faDownload,
    faExclamation,
    faGift,
    faInfoCircle,
    faPen,
    faTimes,
    faTableList,
    faXmark, faCircleNotch, faPlus
} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import AlertCustom from "../../generics/AlertCustom";
import {Button, Modal} from "react-bootstrap";
import {returnDescription} from "../../../../utility/util";
import WbbOptionSelect from "../modals/warband/WbbOptionSelect";



const WbbPostGameDetailExploration: React.FC = () => {
    const { warband } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode();

    const [selection, setSelection] = useState<"exploration" | "reinforce">("exploration");
    const [explTableselection, setExplTableSelection] = useState<"common" | "rare" | "legendary" >("common");

    const [showCommonModal, setshowCommonModal] = useState(false);
    const [showRareModal, setshowRareModal] = useState(false);
    const [showLegendaryModal, setshowLegendaryModal] = useState(false);

    const [explorationRoll, setexplorationRoll] = useState<number>(0);
    const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    if (!warband) return <div>Loading...</div>;

    return (
        <div className="WbbPostGameDetailExploration WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {"Exploration & Reinforcements"}
            </div>

            <p>
                {
                    "After your game you have the opportunity to go on exploration or reinforce your warband."
                }
            </p>

            {/* Auswahl */}
            <div className="mb-3">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        id="exploration-radio"
                        name="explore-reinforce"
                        value="exploration"
                        checked={selection === "exploration"}
                        onChange={() => setSelection("exploration")}
                    />
                    <label className="form-check-label" htmlFor="exploration-radio">
                        Exploration & Looting
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        id="reinforce-radio"
                        name="explore-reinforce"
                        value="reinforce"
                        checked={selection === "reinforce"}
                        onChange={() => setSelection("reinforce")}
                    />
                    <label className="form-check-label" htmlFor="reinforce-radio">
                        Reinforce
                    </label>
                </div>
            </div>

            {/* Content based on selection */}
            {selection === "exploration" && (
                <div className="exploration-content">
                    {/* Exploration & Looting */}
                    <div className="WbbPostGameDetail-Element-sub-headline">
                        {'Exploration & Looting'}
                    </div>

                    <div className={'mb-3'}>
                        <div className={'fw-bold mb-1'}>
                            {'Exploration Dice'}
                        </div>
                        {/* @TODO: Show exploration dice based on current round and corresponding value */}
                        <div>
                            {'Battles 3-4: '}{'4 Exploration dice'}
                        </div>
                    </div>

                    <div className={'mb-3'}>
                        <div className={'fw-bold mb-1'}>
                            {'Exploration Skills'}
                        </div>
                        {/* @TODO: Show exploration skills here */}
                        <div>{'Reroll Dice: '}{'2x'}</div>
                        <div>{'Extra Dice: '}{'1x'}</div>
                    </div>

                    <div className={'mb-3'}>
                        <div className={'fw-bold mb-1'}>
                            {'Available exploration tables'}
                        </div>
                        {/* @TODO: Show exploration locations based on current round */}
                        <div>
                            {'Battles 3-5: '}{'Common locations & Rare locations'}
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="exploration-location-common-radio"
                                name="exploration-table"
                                value="common"
                                checked={explTableselection === "common"}
                                onChange={() => setExplTableSelection("common")}
                            />
                            <label className="form-check-label" htmlFor="exploration-location-common-radio">
                                Common locations
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="exploration-location-rare-radio"
                                name="exploration-table"
                                value="rare"
                                checked={explTableselection === "rare"}
                                onChange={() => setExplTableSelection("rare")}
                            />
                            <label className="form-check-label" htmlFor="exploration-location-rare-radio">
                                Rare locations
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="exploration-location-legendary-radio"
                                name="exploration-table"
                                value="legendary"
                                checked={explTableselection === "legendary"}
                                onChange={() => setExplTableSelection("legendary")}
                            />
                            <label className="form-check-label" htmlFor="exploration-location-legendary-radio">
                                Legendary locations
                            </label>
                        </div>
                    </div>

                    {explTableselection == 'common' &&
                        <div className={'expl-location-table-link mb-3'}
                             onClick={() => setshowCommonModal(true)}
                        >
                            {'Common Exploration Locations Table'}
                            <FontAwesomeIcon icon={faTableList} className={'ms-2'}/>
                        </div>
                    }
                    {explTableselection == 'rare' &&
                        <div className={'expl-location-table-link mb-3'}
                             onClick={() => setshowRareModal(true)}
                        >
                            {'Rare Exploration Locations Table'}
                            <FontAwesomeIcon icon={faTableList} className={'ms-2'}/>
                        </div>
                    }
                    {explTableselection == 'legendary' &&
                        <div className={'expl-location-table-link mb-3'}
                             onClick={() => setshowLegendaryModal(true)}
                        >
                            {'Legendary Exploration Locations Table'}
                            <FontAwesomeIcon icon={faTableList} className={'ms-2'}/>
                        </div>
                    }

                    <div className={'mb-3'}>
                        <div className={'fw-bold mb-1'}>
                            {'Your exploration roll total'}
                        </div>

                        <div className={'exploration-roll-wrap'}>
                            <input
                                type="number"
                                className="form-control"
                                id="exploration-roll"
                                min={0}
                                step={1}
                                value={explorationRoll}
                                onChange={(e) => setexplorationRoll(Number(e.target.value))}
                                onFocus={handleFocusSelectAll}
                            />

                            <span className={'multiplier'}>{'x 10 Ducats ='}</span>

                            <span>{explorationRoll * 10}{' Ducats'}</span>
                        </div>
                    </div>

                    {/* @TODO: Add location description based on roll value here */}
                    {/* if no result -> name = 'No result & description = '''*/}
                    <div className={'location-details'}>
                        <div className={'location-name'}>
                            {'Angelic Instrument'}
                        </div>
                        <div className={'location-id'}>
                            {'Rare location - 20'}
                        </div>
                        <p className={'location-description'}>
                            {'Exploring the battlefield you discover an otherworldly instrument alongside the shattered remains of a lesser angel – fallen or divine. Add an Angelic Instrument to your Warband’s roster for free. It’s identical to a Musical Instrument (including their equipment restrictions and LIMIT), except its effect has a range of 8" instead of 4". If your Warband is at its LIMIT for Musical Instruments, it can immediately remove an existing Musical Instrument for the Angelic Instrument.'}
                        </p>
                    </div>
                </div>
            )}

            {selection === "reinforce" && (
                <div className="reinforce-content">
                    {/* Reinforce */}
                    <div className="WbbPostGameDetail-Element-sub-headline">
                        {'Reinforce'}
                    </div>

                    <AlertCustom
                        type={'warning'}
                        className={'mt-3'}
                    >
                    <div className={'fw-bold mb-2'}>
                            {'Warning'}
                        </div>
                        <p>
                            {'Choosing to reinforce will:'}
                        </p>
                        <ul>
                            <li>{'Remove all equipment in your stash'}</li>
                            <li>{'Change the paychest of ducats to match the threshold value'}</li>
                            <li>{'Remember to remove any unspent ducats after you reinforce.'}</li>
                        </ul>
                    </AlertCustom>
                </div>
            )}



            {/** Modals */}

            {/* Common exploration Locations */}
            <Modal show={showCommonModal} onHide={() => setshowCommonModal(false)} className="WbbPostGameDetailExploration-Location-Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{'Common Locations'}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowCommonModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                {/*  @TODO: Add common locations here  */}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => setshowCommonModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Rare exploration Locations */}
            <Modal show={showRareModal} onHide={() => setshowRareModal(false)} className="WbbPostGameDetailExploration-Location-Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{'Rare Locations'}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowRareModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                {/*  @TODO: Add rare locations here  */}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => setshowRareModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Legendary exploration Locations */}
            <Modal show={showLegendaryModal} onHide={() => setshowLegendaryModal(false)} className="WbbPostGameDetailExploration-Location-Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{'Legendary Locations'}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowLegendaryModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                {/*  @TODO: Add Legendary locations here  */}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => setshowLegendaryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default WbbPostGameDetailExploration;