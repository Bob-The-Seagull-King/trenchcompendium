import React, {useState, useEffect} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faDownload, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";
import WbbEditVictoryPointsModal from "./modals/warband/WbbEditVictoryPointsModal";
import WbbEditPatronSelectionModal from "./modals/warband/WbbEditPatronSelectionModal";
import WbbEditCampaignCycleModal from "./modals/warband/WbbEditCampaignCycleModal";
import { Patron } from '../../../classes/feature/skillgroup/Patron';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';

interface WbbCampaignDetailViewProps {
    onClose: () => void;
}

const WbbCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    /** Victory Points */
    const [victoryPoints, setVictoryPoints] = useState<number>(warband.warband_data.GetVictoryPoints());
    const [showVictoryPointsModal, setshowVictoryPointsModal] = useState(false);
    const [keyvar, setKeyvar] = useState(0);
    const handleVictoryPointsUpdate = ( newVP: number ) => {
        setVictoryPoints(newVP)
        // @TODO: Update Victory Points
        console.log('@TODO: Set new VP value ' + newVP);
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

    /** Campaign Cycle */
    const [campaignCycle, setCampaignCycle] = useState<number>(warband.warband_data.GetCampaignCycleView());
    const [campaignCycleMax, setCampaignCycleMax] = useState<number>(warband.warband_data.GetCampaignCycleMax());
    const [showCampaignCycleModal, setshowCampaignCycleModal] = useState(false);
    const handleCampaignCycleUpdate = ( newCycle: number, newCycleMax: number ) => {


        setCampaignCycle(newCycle)
        setCampaignCycleMax(newCycleMax)

        // @TODO: Campaign Cycle
        console.log('@TODO: Set new Campaign Cylce current: ' + newCycle + ' & new Max Cycle: ' + newCycleMax);
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
                        {'Campaign Cycle: '}
                    </strong>
                    {warband.warband_data.GetCampaignCycleView()}
                    {' / '}
                    {warband.warband_data.GetCampaignCycleMax()}
                </div>

                <div className={'detail-section-text-element'}>
                    <strong>
                        {'Treshold Value: '}
                    </strong>
                    {warband.warband_data.GetCampaignTresholdValue()}
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
                    title={'Campaign Cycle'}
                    value={campaignCycle + ' / '+campaignCycleMax}
                    onClick={() => setshowCampaignCycleModal(true)}
                />

                <WbbEditCampaignCycleModal
                    show={showCampaignCycleModal}
                    onClose={() => setshowCampaignCycleModal(false)}
                    currentCampaignCycle={campaignCycle}
                    currentCampaignCycleMax={campaignCycleMax}
                    onSubmit={handleCampaignCycleUpdate}
                />


                {/* Notes textarea */}
                <WbbTextarea
                    initialText={warband.warband_data.GetCampaignNotes()}
                    title="Campaign Notes"
                    onSave={(newText) => {
                        // @TODO Save the newText as campaign Notes
                        console.log('@TODO Save the newText as campaign Notes', newText);
                    }}
                />


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
