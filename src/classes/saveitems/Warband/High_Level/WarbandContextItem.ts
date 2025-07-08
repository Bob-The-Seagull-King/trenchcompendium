import { CompendiumItem, ICompendiumItemData, ItemType } from '../../../CompendiumItem'
import { DescriptionFactory } from '../../../../utility/functions';
import { INote } from '../../../Note';

interface IWarbandContextItem {
    id : string,
    victory_points: number,
    campaign_round: number
}

class WarbandContextItem {
    public VictoryPoints;
    public CampaignRound;
    public ID;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandContextItem)
    {
        this.ID = data.id;
        this.VictoryPoints = data.victory_points;
        this.CampaignRound = data.campaign_round;
    }

    public ConvertToInterface() {
        const _objint : IWarbandContextItem = {
            id : this.ID,
            victory_points: this.VictoryPoints,
            campaign_round: this.CampaignRound
        }
        
        return _objint;
    }

}

export {IWarbandContextItem, WarbandContextItem}

