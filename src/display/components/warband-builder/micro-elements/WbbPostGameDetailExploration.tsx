import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import AlertCustom from "../../generics/AlertCustom";



const WbbPostGameDetailExploration: React.FC = () => {
    const { warband } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode();

    const [selection, setSelection] = useState<"exploration" | "reinforce">("exploration");

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

            {/* Inhalt abhängig von Auswahl */}
            {selection === "exploration" && (
                <div className="exploration-content">
                    {/* Exploration & Looting */}
                    <div className="WbbPostGameDetail-Element-sub-headline">
                        {'Exploration & Looting'}
                    </div>

                    {/*  @TODO: Add Exploration here   */}
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
        </div>
    );
};

export default WbbPostGameDetailExploration;