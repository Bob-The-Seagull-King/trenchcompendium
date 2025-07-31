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

interface WbbCampaignDetailViewProps {
    onClose: () => void;
}

const WbbViewCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    /** Victory Points */
    const [victoryPoints, setVictoryPoints] = useState<number>(warband.warband_data.GetVictoryPoints());
    const [ducatlimit, setducatlimit] = useState<number>(700);
    const [keyvar, setKeyvar] = useState(0);
    /** Patron */
    const [patron, setPatron] = useState<Patron | null>(warband? warband?.warband_data.GetPatron() : null);

    useEffect(() => {
        async function RunDucatCheck() {
           const threshhold = await warband?.warband_data.GetCampaignTresholdValue()
           if (threshhold != undefined) {
            setducatlimit(threshhold)
            setKeyvar(keyvar + 1)
           }
        }

        RunDucatCheck();
    }, [updateKey])

    /** Campaign Cycle */
    const [campaignCycle, setCampaignCycle] = useState<number>(warband.warband_data.GetCampaignCycleView());
    const [failedpromotions, setfailedpromotions] = useState<number>(warband.warband_data.Context.FailedPromotions);


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
                    onClick={() => {undefined}}
                />


                {/* Patron */}
                <WbbOptionBox
                    title={'Patron'}
                    value={patron? patron.GetTrueName() : ""}
                    onClick={() => {undefined}}
                />

                {/* Campaign Cycle */}
                <WbbOptionBox
                    title={'Campaign Round'}
                    value={campaignCycle}
                    onClick={() => {undefined}}
                />

                {/* Failed Promotions */}
                <div className={'WbbFighterDetailView'}>
                    <div className="WbbOptionBox">
                        <div className="WbbOptionBox-title">
                            {'Failed Promotions'}
                        </div>
                    </div>
                    <div className={'battle-scars'}>
                        <div className="battle-scar-boxes" onClick={() => {undefined}}>
                            {Array.from({length: 6}, (_, i) => {
                                const index = i + 1;
                                const isChecked = index <= failedpromotions;
                                const isSkull = index === 6;

                                return (
                                    <div key={index} className="battle-scar-box">
                                        {isSkull &&
                                            <FontAwesomeIcon icon={faGift} className={'skull-icon'}/>
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

                {/* Notes textarea */}
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
        </div>
    );
};

export default WbbViewCampaignDetailView;
