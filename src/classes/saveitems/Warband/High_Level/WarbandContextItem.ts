import { CompendiumItem, ICompendiumItemData, ItemType } from '../../../CompendiumItem'
import { DescriptionFactory } from '../../../../utility/functions';
import { INote } from '../../../Note';

interface IWarbandContextItem {
    id : string,
    victory_points: number,
    campaign_round: number,
    failed_promotions: number,
    stored_ratings: StoredRatings
}

interface StoredRatings {
    rating_ducat : number,
    rating_glory : number,
    stash_rating_ducat : number,
    stash_rating_glory : number,
    spare_ducat : number,
    spare_glory : number
}

class WarbandContextItem {
    public VictoryPoints;
    public CampaignRound;
    public ID;
    public FailedPromotions;
    public Ratings : StoredRatings;

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
        this.FailedPromotions = data.failed_promotions;
        if (data.stored_ratings) {
            this.Ratings = data.stored_ratings
        } else {
            this.Ratings = {
            rating_ducat : 0,
            rating_glory : 0,
            stash_rating_ducat : 0,
            stash_rating_glory : 0,
            spare_ducat : 0,
            spare_glory : 0
            }
        }
    }

    public ConvertToInterface() {
        const _objint : IWarbandContextItem = {
            id : this.ID,
            victory_points: this.VictoryPoints,
            campaign_round: this.CampaignRound,
            failed_promotions: this.FailedPromotions,
            stored_ratings : this.Ratings
        }
        
        return _objint;
    }

}

export {IWarbandContextItem, WarbandContextItem}

