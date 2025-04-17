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

    /**
     * Returns the Name of the Warband as string
     */
    public GetWarbandName () {
        return this.Name;
    }

    /**
     * Returns the Name of the Faction as string
     */
    public GetFactionName () {
        return this.Faction.Name;
    }

    /**
     * Returns the Ducats Value of the Warband Cost as int
     */
    public GetCostDucats() {
        return this.Ducats;
    }

    /**
     * Returns the Max Ducats Value of the Warband int
     */
    public GetMaxDucats() {
        return this.Ducats;
    }

    /**
     * Returns the Glory Value of the Warband Cost as int
     */
    public GetCostGlory() {
        return this.Glory;
    }

    /**
     * Returns the Max Glory Value of the Warband int
     */
    public GetMaxGlory() {
        return this.Glory;
    }

    /**
     * Returns the name of the associated campaign for this warband if any exists
     */
    public GetCampaignName() {
        return 'No Campaign';
    }


    /**
     * Get the Fighters for this warbands
     */
    public GetFighters() {


        /** Test Data */ // @TODO
        return [
            {
                FighterName: 'Olaf',
                ModelName: 'Jabirean Alchemist',
                ModelId: 'rl_alchemists',
                FighterBaseDucats: 75,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 102,
                FighterTotalCostGlory: 2,
                IsElite: true,
                IsMercenary: false,
                ExperiencePoints: 4,
                BattleScars: 1,
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
                FighterName: 'Olaf',
                ModelName: 'Azeb',
                ModelId: 'rl_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 0,
                BattleScars: 0,
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
                ModelId: 'rl_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 0,
                BattleScars: 0,
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

}

export {IUserWarband, UserWarband}

