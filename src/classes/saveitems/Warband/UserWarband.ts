import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { IWarbandExplorationSet, WarbandExplorationSet } from './CoreElements/WarbandExplorationSet';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { IContextObject } from '../../contextevent/contextobject';
import { IWarbandFaction, WarbandFaction } from './CoreElements/WarbandFaction';
import { IWarbandPurchaseEquipment, IWarbandPurchaseModel, WarbandPurchase } from './Purchases/WarbandPurchase';
import { WarbandMember } from './Purchases/WarbandMember';
import { WarbandEquipment } from './Purchases/WarbandEquipment';
import { WarbandFactory } from '../../../factories/warband/WarbandFactory';

interface IUserWarband extends IContextObject {
    id : string,
    ducat_bank : number,
    glory_bank : number,
    context : IWarbandContextItem,
    exploration : IWarbandExplorationSet,
    faction : IWarbandFaction,
    models : IWarbandPurchaseModel[],
    equipment : IWarbandPurchaseEquipment[],
    notes : INote[]
}

class UserWarband extends DynamicContextObject {
    public ID;
    public Context : WarbandContextItem;
    public Exploration! : WarbandExplorationSet;
    public Faction! : WarbandFaction;
    public Ducats;
    public Glory;
    public Notes : INote[];
    public Models : WarbandPurchase[] = [];
    public Equipment : WarbandPurchase[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IUserWarband)
    {
        super(data, null)
        this.ID = data.id;
        this.Context = new WarbandContextItem(data.context);
        this.Ducats = data.ducat_bank;
        this.Glory = data.glory_bank;
        this.Notes = data.notes;
    }

    public async NewWarbandItems(data : IUserWarband) {
        this.Exploration = await WarbandFactory.CreateWarbandExplorationSet(data.exploration, this);
        this.Faction = await WarbandFactory.CreateWarbandFaction(data.faction, this);
    }

    public BuildModels(data : IWarbandPurchaseModel[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandMember = new WarbandMember(data[i].model, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Models.push(NewPurchase);
        }
    }

    public BuildEquipment(data : IWarbandPurchaseEquipment[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = new WarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public ConvertToInterface() {
        const modelslist : IWarbandPurchaseModel[] = []
        for (let i = 0; i < this.Models.length; i++) {
            modelslist.push(this.Models[i].ConvertToInterfaceModel())
        }

        const equipmentlist : IWarbandPurchaseEquipment[] = []
        for (let i = 0; i < this.Equipment.length; i++) {
            equipmentlist.push(this.Equipment[i].ConvertToInterfaceEquipment())
        }

        const _objint : IUserWarband = {
            id : this.ID,
            context : this.Context.ConvertToInterface(),
            exploration : this.Exploration.ConvertToInterface(),
            faction : this.Faction.ConvertToInterface(),
            contextdata : this.ContextKeys,   
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            ducat_bank: this.Ducats,
            glory_bank: this.Glory,
            models : modelslist,
            equipment : equipmentlist,
            notes: this.Notes
        }
        
        return _objint;
    }

    public async GetPatronList() {
        return await this.Faction.FindAllPatronOptions();
    }

    public async UpdateSelfPatron(patron_name : string ) {
        await this.Faction.UpdatePatron(patron_name);
    }


    /**
     * GETTERS
     */

    public GetPatron() {
        return this.Faction.MyPatron;
    }

    public GetPatronName() {
            return this.GetPatron()?.Name || 'None';
    }


    /**
     * Returns the Name of the Warband as string
     */
    public GetWarbandName () {
        if( this.Name == undefined ) {
            return '';
        }
        return this.Name;
    }

    /**
     * Returns the Name of the Faction as string
     */
    public GetFactionName () {
        return this.Faction.GetSelfName();
    }
    /**
     * Returns the Name of the Faction as string
     */
    public GetFactionSlug () {

        return this.Faction.MyFaction?.ID;

    }

    /**
     * Returns the Name of the Base-Faction as string
     *
     * @TODO:
     */
    public GetFactionBaseName () {
        return 'The Iron Sultanate';
    }

    /**
     * Returns the Name of the Faction Variant as string
     *
     * @TODO:
     */
    public GetFactionVariantName () {
        return 'The Iron Sultanate';
    }

    /** @TODO
     * Returns the Ducats Value of the Warband Cost as int (without stash)
     */
    public GetCostDucats() {
        return this.Ducats;
    }

    /**
     * @TODO:
     * Returns the total Ducats Value including stash as int
     * @constructor
     */
    public GetCostDucatsTotal () {
        return this.Ducats;
    }

    /** @TODO
     * Returns the Glory Value of the Warband Cost as int (without stash)
     */
    public GetCostGlory() {
        return this.Glory;
    }

    /** @TODO
     * Returns the Glory Value of the Warband including stash as int
     */
    public GetCostGloryTotal() {
        return this.Glory;
    }

    /**
     * @TODO
     * Returns bool - Does the warband have Troops?
     */
    public HasTroops () {
        return true;
    }

    /**
     * @TODO
     * Returns bool - Does the warband have Elites?
     */
    public HasElites () {
        return true;
    }

    /**
     * @TODO
     * Returns bool - Does the warband have mercenaries?
     */
    public HasMercenaries () {
        return false;
    }

    /** @TODO
     * Get the Fighters for this warbands
     */
    public GetFighters() {


        /** Test Data */ // @TODO
        return [
            {
                FighterName: 'Aladin',
                ModelName: 'Yüzbaşı Captain',
                Slug: 'md_yuzbasicaptain',
                FighterBaseDucats: 75,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 102,
                FighterTotalCostGlory: 2,
                IsElite: true,
                IsMercenary: false,
                ExperiencePoints: 4,
                BattleScars: 1,
                FighterIndex: 1, // the index for sorting and getting unique item in array
                FighterImageId: 53, // the fighter image Synod ID for testing
                Injuries: [
                    {
                        Name: 'Hand Wound',
                        Description: 'The character suffers -1 DICE for all of its melee attack ACTIONS.',
                        InjuryId: 'in_hand_wound'
                    }
                ],
                Advancements: [
                    {
                        Name: 'Stand Firm',
                        Description: 'This model treats the first Down result it suffers each battle as a Minor Hit.',
                        InjuryId: 'sk_standfirm',
                    }
                ],
                Equipment: [
                    {
                        Name: 'Siege Jezzail',
                        CostDucats: 30,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    }
                ]
            },
            {
                FighterName: 'Mustafa',
                ModelName: 'Assassin',
                Slug: 'md_sultanateassassin',
                FighterBaseDucats: 85,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 105,
                FighterTotalCostGlory: 0,
                IsElite: true,
                IsMercenary: false,
                ExperiencePoints: 10,
                BattleScars: 1,
                FighterIndex: 2, // the index for sorting and getting unique item in array
                FighterImageId: 26, // the fighter image Synod ID for testing
                Injuries: [
                    {
                        Name: 'Hand Wound',
                        Description: 'The character suffers -1 DICE for all of its melee attack ACTIONS.',
                        InjuryId: 'in_hand_wound'
                    }
                ],
                Advancements: [
                    {
                        Name: 'Stand Firm',
                        Description: 'This model treats the first Down result it suffers each battle as a Minor Hit.',
                        InjuryId: 'sk_standfirm',
                    }
                ],
                Equipment: [
                    {
                        Name: 'Assassins Dagger',
                        CostDucats: 30,
                        CostGlory: 0,
                        Type: 'Melle Weapon'
                    }
                ]
            },
            {
                FighterName: 'Olaf',
                ModelName: 'Azeb',
                Slug: 'md_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 0,
                BattleScars: 0,
                FighterIndex: 13, // the index for sorting and getting unique item in array
                FighterImageId: 24, // the fighter image Synod ID for testing
                Injuries: [
                ],
                Advancements: [

                ],
                Equipment: [
                    {
                        Name: 'Jezzail',
                        CostDucats: 7,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    },
                    {
                        Name: 'Alchemical Ammunition',
                        CostDucats: 3,
                        CostGlory: 0,
                        Type: 'Equipment'
                    }
                ]
            },
            {
                FighterName: 'Günther',
                ModelName: 'Azeb',
                Slug: 'md_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 10,
                BattleScars: 0,
                FighterIndex: 3, // the index for sorting and getting unique item in array
                FighterImageId: 24, // the fighter image Synod ID for testing
                Injuries: [
                ],
                Advancements: [

                ],
                Equipment: [
                    {
                        Name: 'Jezzail',
                        CostDucats: 7,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    },
                    {
                        Name: 'Alchemical Ammunition',
                        CostDucats: 3,
                        CostGlory: 0,
                        Type: 'Equipment'
                    }
                ]
            }
        ];
    }


    /** @TODO
     * Gets the ranged weapon options for a fighter by its ID
     *
     * @param fighter_id
     */
    public GetRangedWeaponOptions ( fighter_id: string ) {

        // @TODO: get real options
        const options = [
            {
                Name: 'Jezzail',
                Id: 'eq_jezzail',
                Cost: '7 Ducats'
            },
            {
                Name: 'Pistol',
                Id: 'eq_pistol',
                Cost: '5 Ducats'
            },
            {
                Name: 'Musket',
                Id: 'eq_musket',
                Cost: '10 Ducats'
            },
        ];


        return options;
    }

    /**
     * WBB Actions
     */

    /** @TODO
     * Adds a fighter to the Roster
     * @param fighter
     */
    public AddFighter ( fighter: object ) {

        return false;

    }

    /** @TODO
     * Adds an exploration location to a Roster
     *
     * @param location
     * @param option
     * @constructor
     */
    public  AddExplorationLocation ( location: object, option: object) {

        return false;

    }


    /** @TODO
     * Adds a modifier item to a warband
     *
     * @param modifier
     * @param option
     */
    public AddModifier ( modifier: object, option: object) {

        return false;

    }


    /**
     * Campaign Data
     * - This Data could be retrieved from a campaign object.
     * - We need to preserve the method to set these values by user input
     */
    /** @TODO Returns the name of the campaign for the warband
     * - can use Campaign Info
     */
    public GetCampaignName() {
        return 'No Campaign connected';
    }
    /**
     * @TODO: Return the Vistory Points for this Warband
     * - can use Campaign Info
     */
    GetVictoryPoints() {
        return 12;
    }

    /**
     * @TODO: Return the Campaign Cycle of the connected campaign
     - can use Campaign Info
     */
    GetCampaignCycle() {
        return 2;
    }

    /**
     * @TODO: Get Battle Count for this warband
     * - can use Campaign Info
     * -  Battle count != Campaign Round
     *
     */
    GetBattleCount() {
        return 3;
    }

    /**
     * @TODO get stash Data
     */
    GetStash() {

        return {
            ValueDucats: 122,
            ValueGlory: 4,
            AmountDucats: 15,
            AmountGlory: 1,
            Items: [
                {
                    Name: 'Jezzail',
                    Id: 'fc-jezzail',
                    ValueDucats: 17,
                    ValueGlory: 0
                },
                {
                    Name: 'Jezzail',
                    Id: 'fc-jezzail',
                    ValueDucats: 17,
                    ValueGlory: 0
                },
                {
                    Name: 'Trench Knife',
                    Id: 'fc-trench-knife',
                    ValueDucats: 17,
                    ValueGlory: 0
                },
                {
                    Name: 'Gas Mask',
                    Id: 'fc-gas-mask',
                    ValueDucats: 5,
                    ValueGlory: 0
                },
                {
                    Name: 'Machine Gun',
                    Id: 'fc-machine-gun',
                    ValueDucats: 0,
                    ValueGlory: 2
                }
            ]
        }
    }

    /**
     * Returns the number of elite fighters in this warband
     * @constructor
     */
    GetNumElite() {
        return this.GetFighters().filter(f => f.IsElite).length;
    }

    /**
     * Returns the number of troop fighters in this warband
     * @constructor
     */
    GetNumTroop() {
        return this.GetFighters().filter(f => !f.IsElite && !f.IsMercenary).length
    }

    /**
     * Returns the number of mercenary fighters in this warband
     * @constructor
     */
    GetNumMercenary() {
        return this.GetFighters().filter(f => f.IsMercenary).length;
    }

    /** @TODO
     * Returns the notes for this warband as string
     * @constructor
     */
    GetNotes () {
        return '';

        /**
         * If empty, return ''
         */
    }

    /** @TODO
     * Returns the lore for this warband as string
     * @constructor
     */
    GetLore () {
        return '';
    }

    /** @TODO:
     * Does this warband have goetic options?
     * @constructor
     */
    HasGoeticOptions () {
        return true;
    }

    /** @TODO:
     * Returns the name of the chosen goetic discipline of this warband
     * @constructor
     */
    GetGoeticSelection () {
        return 'Wrath'
    }
}

export {IUserWarband, UserWarband}

