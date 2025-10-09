import React, {useState, useEffect} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes, faChartSimple, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";
import WbbEditVictoryPointsModal from "./modals/warband/WbbEditVictoryPointsModal";
import WbbEditPatronSelectionModal from "./modals/warband/WbbEditPatronSelectionModal";
import WbbEditCampaignCycleModal from "./modals/warband/WbbEditCampaignCycleModal";
import { Patron } from '../../../classes/feature/skillgroup/Patron';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import WbbEditFailedPromotionsModal from './modals/warband/WbbEditFailedPromotionsModal';
import {useWbbMode} from "../../../context/WbbModeContext";
import WbbOptionSelect from "./modals/warband/WbbOptionSelect";
import WbbDetailViewCollapse from "./WbbDetailViewCollapse";
import {toast} from "react-toastify";
import AlertCustom from "../generics/AlertCustom";

interface WbbCampaignDetailViewProps {
    onClose: () => void;
    openGameReporter: () => void;
    openPostGame: () => void;
}

const FEATURE_FLAG_HISTORY = false;
const FEATURE_FLAG_REPORTING = false;

const WbbCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose, openGameReporter, openPostGame }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    /** Victory Points */
    const [victoryPoints, setVictoryPoints] = useState<number>(warband.warband_data.GetVictoryPoints());
    const [ducatlimit, setducatlimit] = useState<number>(700);
    const [showVictoryPointsModal, setshowVictoryPointsModal] = useState(false);
    const [keyvar, setKeyvar] = useState(0);
    const handleVictoryPointsUpdate = ( newVP: number ) => {
        setVictoryPoints(newVP)
        warband?.warband_data.SetVP(newVP);
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {
        setPatron(warband? warband?.warband_data.GetPatron() : null)
        reloadDisplay()
        setKeyvar(keyvar + 1)})
    }

    /** Patron */
    const [patron, setPatron] = useState<Patron | null>(warband? warband?.warband_data.GetPatron() : null);
    const [showPatronModal, setshowPatronModal] = useState(false);
    const handlePatronUpdate = ( newPatron: string ) => {
        warband?.warband_data.UpdateSelfPatron(newPatron).then(() =>
            {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {
            setPatron(warband? warband?.warband_data.GetPatron() : null)
            reloadDisplay()
            setKeyvar(keyvar + 1)})
        })
    }

    const [campaigntext, setcampaigntext] = useState(warband? warband?.warband_data.GetCampaignNotes() : "");

    useEffect(() => {
        async function RunDucatCheck() {
           const threshhold = await warband?.warband_data.GetCampaignTresholdValue()
           if (threshhold != undefined) {
            setducatlimit(threshhold)
           }
           setKeyvar(keyvar + 1)
        }

        RunDucatCheck();
    }, [updateKey])

    /** Campaign Cycle */
    const [campaignCycle, setCampaignCycle] = useState<number>(warband.warband_data.GetCampaignCycleView());
    const [campaignCycleMax, setCampaignCycleMax] = useState<number>(warband.warband_data.GetCampaignCycleMax());
    const [showCampaignCycleModal, setshowCampaignCycleModal] = useState(false);
    const handleCampaignCycleUpdate = ( newCycle: number, newCycleMax: number ) => {


        setCampaignCycle(newCycle)
        setCampaignCycleMax(newCycleMax)
        warband?.warband_data.SetCurrentCycle(newCycle);
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {
        reloadDisplay()
        setKeyvar(keyvar + 1)})
    }

    const [failedpromotions, setfailedpromotions] = useState<number>(warband.warband_data.Context.FailedPromotions);
    const [showFailedPromotionsModal, setshowFailedPromotionsModal] = useState(false);
    const handleFailedpromotionsUpdate = ( newCycle: number ) => {
        setfailedpromotions(newCycle)
        warband?.warband_data.SetCurrentFailedPromotions(newCycle);
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {
        reloadDisplay()
        setKeyvar(keyvar + 1)})
    }

    /** Threshold values */
    // @TODO use warband object to get and set the values
    const [thresholds, setThresholds] = useState<number[]>(
        Array.from({ length: 12 }, (_, i) => 700 + i * 100)
    );

    // are the threshold values editable? Based on view mode or maybe they're set via the campaign
    const [thresholdsEditable, setthresholdsEditable] = useState(true);

    if( !edit_mode ) { // can only be edited in edit mode
        setthresholdsEditable(false);
    } // @TODO disable editable threshold if they are set via the campaign


    const handleSave = () => {
        // validate thresholds: each value must be greater than the previous
        for (let i = 1; i < thresholds.length; i++) {
            if (thresholds[i] <= thresholds[i - 1]) {
                toast.error(
                    `Threshold for Round ${i + 1} must be greater than Round ${i}`
                );
                return;
            }
        }
        toast.success("Thresholds saved successfully!");
        console.log("Saved thresholds:", thresholds);

        //@TODO: set new warband thresholds
    };



    return (
        <div className="WbbDetailView WbbCampaignDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Campaign'}
                </div>
            </div>

            <div className={'detail-view-content'} key={setKeyvar.toString() + "_" + updateKey.toString()}>
                <div className={'detail-section-title'}>
                    {'Campaign Details'}
                </div>

                <div className={'detail-section-text-element'}>
                    <strong>
                        {'Campaign Round: '}
                    </strong>
                    {warband.warband_data.GetCampaignCycleView()}
                </div>

                <div className={'detail-section-text-element'}>
                    <strong>
                        {'Threshold Value: '}
                    </strong>
                    {ducatlimit}
                </div>

                <div className={'detail-section-text-element'}>
                    <strong>
                        {'Max field strength: '}
                    </strong>
                    {warband.warband_data.GetCampaignMaxFieldStrength()}
                </div>

                {/* Show if campaign Invite exists */}
                {edit_mode &&
                    <AlertCustom
                        className={'my-3'}
                        type={'info'}
                    >
                        <h4>{'Capmaign Invite'}</h4>
                        <div>
                            {'You have been invited to a campaign'}
                        </div>
                        <div className={'fw-bold mb-3'}>
                            {'Campaign Name'}{' by '}{'Admin Name'}
                        </div>

                        {/* @TODO: handle campaign invite accept / decline */}
                        <div className={'btn btn-primary me-2'}>
                            <FontAwesomeIcon icon={faCheck} className={'me-2'} />
                            {'Accept Invite'}
                        </div>
                        <div className={'btn btn-secondary'}>
                            <FontAwesomeIcon icon={faTimes} className={'me-2'} />
                            {'Decline Invite'}
                        </div>
                    </AlertCustom>
                }

                {/* Patron */}
                <WbbOptionBox
                    title={'Patron'}
                    value={patron ? patron.GetTrueName() : ""}
                    onClick={() => setshowPatronModal(true)}
                />
                <WbbEditPatronSelectionModal
                    show={showPatronModal}
                    onClose={() => setshowPatronModal(false)}
                    currentPatron={patron}
                    onSubmit={handlePatronUpdate}
                />

                {/* Victory Points */}
                <WbbOptionBox
                    title={'Victory Points'}
                    value={victoryPoints}
                    onClick={() => setshowVictoryPointsModal(true)}
                />
                <WbbEditVictoryPointsModal
                    show={showVictoryPointsModal}
                    onClose={() => setshowVictoryPointsModal(false)}
                    currentVP={victoryPoints}
                    onSubmit={handleVictoryPointsUpdate}
                />


                {/* Campaign Cycle */}
                <WbbOptionBox
                    title={'Campaign Round'}
                    value={campaignCycle}
                    onClick={() => setshowCampaignCycleModal(true)}
                />
                <WbbEditCampaignCycleModal
                    show={showCampaignCycleModal}
                    onClose={() => setshowCampaignCycleModal(false)}
                    currentCampaignCycle={campaignCycle}
                    currentCampaignCycleMax={campaignCycleMax}
                    onSubmit={handleCampaignCycleUpdate}
                />

                {/* Failed Promotions */}
                <div className={'WbbFighterDetailView'}>
                    <div className="WbbOptionBox">
                        <div className="WbbOptionBox-title">
                            {'Failed Promotions'}
                        </div>
                    </div>
                    <div className={'failed-promo'}>
                        {edit_mode &&
                            <div className={'btn btn-primary btn-sm edit-btn'}
                                 onClick={() => setshowFailedPromotionsModal(true)}>
                                <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                {'Edit'}
                            </div>
                        }

                        <div className="failed-promo-boxes"
                             onClick={edit_mode ? () => setshowFailedPromotionsModal(true) : undefined}
                        >
                            {Array.from({length: 6}, (_, i) => {
                                const index = i + 1;
                                const isChecked = index <= failedpromotions;
                                const isSkull = index === 6;

                                return (
                                    <div key={index} className="failed-promo-box">
                                        {isSkull &&
                                            <FontAwesomeIcon icon={faGift} className={'final-icon'}/>
                                        }
                                        {isChecked &&
                                            <FontAwesomeIcon icon={faCheck}/>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {edit_mode &&
                    <WbbEditFailedPromotionsModal
                        show={showFailedPromotionsModal}
                        onClose={() => setshowFailedPromotionsModal(false)}
                        currentFails={failedpromotions}
                        onSubmit={handleFailedpromotionsUpdate}
                    />
                }


                { edit_mode && FEATURE_FLAG_REPORTING &&
                    <>
                        <button
                            className={'btn btn-primary me-3'}
                            onClick={() => openGameReporter()}
                        >
                            <FontAwesomeIcon icon={faTrophy} className={'me-2'}/>
                            {'Report Game'}
                        </button>

                        <button
                            className={'btn btn-primary'}
                            onClick={() => openPostGame()}
                        >
                            <FontAwesomeIcon icon={faChartSimple} className={'me-2'}/>
                            {'Post Game'}
                        </button>
                    </>
                }

                <div className={'WbbDetailViewCollapse-wrap'}>
                    {/* Campaign History */}
                    {(edit_mode || view_mode) && FEATURE_FLAG_HISTORY &&
                        <WbbDetailViewCollapse title="History" initiallyOpen={false}>
                            {/* @TODO: Add history here */}

                        </WbbDetailViewCollapse>
                    }


                    <WbbDetailViewCollapse title="Advanced Options" initiallyOpen={false}>
                        <h4 className={'mb-3'}>
                            {'Manual campaign values'}
                        </h4>



                        <div>
                            <h4 className={'mb-3'}>
                                {'Threshold values'}
                            </h4>

                            {Array.from({length: 12}, (_, i) => (
                                <div key={i} className="row mb-2 align-items-center">
                                    {/* Label column */}
                                    <div className="col-4 fw-bold">{`Round ${i + 1}`}</div>

                                    {/* Input column */}
                                    <div className="col-8">
                                        <input
                                            type="number"
                                            className="form-control"
                                            onFocus={(e) => e.target.select()}
                                            value={thresholds[i]}
                                            min={0}
                                            disabled={!thresholdsEditable}
                                            step={1}
                                            onChange={(e) => {
                                                const newThresholds = [...thresholds];
                                                newThresholds[i] = parseInt(e.target.value) || 0;
                                                setThresholds(newThresholds);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button className="btn btn-primary mt-3" onClick={handleSave}>
                                Save Thresholds
                            </button>
                        </div>
                    </WbbDetailViewCollapse>

                    <WbbDetailViewCollapse title="Notes & Lore" initiallyOpen={false}>
                        {/* Notes textarea */}
                        <WbbTextarea
                            initialText={campaigntext}
                            title="Campaign Notes"
                            onSave={(newText: string) => {
                                warband?.warband_data.SaveNote(newText, 'campaign')
                                setcampaigntext(newText);

                                const Manager: ToolsController = ToolsController.getInstance();
                                Manager.UserWarbandManager.UpdateItemInfo(warband ? warband.id : -999).then(
                                    () => reloadDisplay())
                            }}
                        />
                    </WbbDetailViewCollapse>
                </div>
            </div>
        </div>
    );
};

export default WbbCampaignDetailView;
