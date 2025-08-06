import React, {useState, useEffect} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
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

interface WbbCampaignDetailViewProps {
    onClose: () => void;
}

const WbbCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose }) => {
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


                {/* Patron */}
                <WbbOptionBox
                    title={'Patron'}
                    value={patron? patron.GetTrueName() : ""}
                    onClick={() => setshowPatronModal(true)}
                />

                <WbbEditPatronSelectionModal
                    show={showPatronModal}
                    onClose={() => setshowPatronModal(false)}
                    currentPatron={patron}
                    onSubmit={handlePatronUpdate}
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

                {/* Notes textarea */}
                <div key={keyvar}>
                    <WbbTextarea
                        initialText={warband.warband_data.GetCampaignNotes()}
                        title="Campaign Notes"
                        onSave={(newText : string) => {
                            warband?.warband_data.SaveNote(newText, 'campaign')
                            
                
                            const Manager : ToolsController = ToolsController.getInstance();
                            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                                () => reloadDisplay())
                        }}
                    />
                </div>

                <div className={'info-box'}>
                    <FontAwesomeIcon icon={faInfoCircle} className="info-box-icon"/>

                    <div className={'info-box-title'}>
                        {'New Features coming Soon'}
                    </div>

                    <div className={'info-box-content'}>
                        {'We are currently developing a complete campaign management mode, where you can connect your own warband and the warbands of your friends to a campaign.'}
                        <br/>
                        {'With this new release there will be many additional options for your campaign play.'}
                        <br/>
                        <br/>
                        {'Your warband is structured into campaign cycles. When you finish a game or campaign cycle, you can advance to the next one. During the campaign you can reference the warband details of previous cycles. Keep in mind, that you can only edit your warband for the latest / current campaign cylce. So make sure, to check your warband before advancing to the next cycle.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WbbCampaignDetailView;
