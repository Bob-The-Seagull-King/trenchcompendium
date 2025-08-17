import { FactionEquipmentRelationship } from "../../../relationship/faction/FactionEquipmentRelationship";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ConvertCompendiumToCompanionID } from "../../../../resources/staticcontext/importdata/compendiumdata";
import { ToolsController } from "../../../_high_level_controllers/ToolsController";
import { UserWarband } from "../UserWarband";
import { SumWarband, WarbandManager } from "../WarbandManager";
import { WarbandProperty } from "../WarbandProperty";
import { EquipmentFactory } from "../../../../factories/features/EquipmentFactory";
import { FactionModelRelationship } from "../../../relationship/faction/FactionModelRelationship";
import { ModelFactory } from "../../../../factories/features/ModelFactory";
import { WarbandPurchase } from "../Purchases/WarbandPurchase";
import { MemberUpgradePresentation, WarbandMember } from "../Purchases/WarbandMember";
import { InjuryFactory } from "../../../../factories/features/InjuryFactory";
import { ModelUpgradeRelationship } from "../../../relationship/model/ModelUpgradeRelationship";
import { UpgradeFactory } from "../../../../factories/features/UpgradeFactory";


class CompendiumImporter {

    
    private static instance: CompendiumImporter;
    UserWarbandManager : WarbandManager;

    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
        const toolcont = ToolsController.getInstance();
        this.UserWarbandManager = toolcont.UserWarbandManager;
    }

    public static getInstance(): CompendiumImporter {
        if (!CompendiumImporter.instance) {
            CompendiumImporter.instance = new CompendiumImporter();
        }
        return CompendiumImporter.instance;
    }

    public async readFileOnUpload(uploadedFile: File | undefined): Promise<boolean> {
        await this.UserWarbandManager.GetItemsAll()

        return new Promise((resolve) => {
            if (!uploadedFile) {
                resolve(false);
                return;
            }

            const fileReader = new FileReader();

            fileReader.onloadend = async() => {
                try {
                    const finresult : boolean = await this.ConvertImportToWarband( fileReader.result ? fileReader.result.toString() : "" );
                    resolve(finresult);
                } catch (e) {
                    resolve(false);
                }
            };

            fileReader.readAsText(uploadedFile);
        });
    }

    private async ConvertImportToWarband(_content : string): Promise<boolean> {
        const JSONVal = JSON.parse(_content);
        
        // Initial Setup
        const fac_id = ConvertCompendiumToCompanionID(JSONVal.Faction.ID);
        const budget_ducats = JSONVal.DucatTotal + JSONVal.PayChest + JSONVal.DucatLost;
        const budget_glory = JSONVal.GloryTotal;
        const wb_name = JSONVal.Name;

        const NewWarband : SumWarband | null = await this.UserWarbandManager.NewItem(wb_name, fac_id, budget_ducats, budget_glory, false);

        if (NewWarband == null) { return false; }

        // Debts
        NewWarband.warband_data.Debts.ducats += JSONVal.DucatLost;
        NewWarband.warband_data.Debts.glory += JSONVal.GloryLost;

        // Stash
        const OptionList = await (NewWarband.warband_data).GetFactionEquipmentOptions(true, false, true, false);
        const FullList = await EquipmentFactory.GetAllFactionEquipment(true, [], []);
        for (let i = 0; i < JSONVal.Armoury.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(JSONVal.Armoury[i].ID);
            const item_costtype = JSONVal.Armoury[i].CostType == "ducats"? 0 : 1;
            await this.BuildEquipment(mod_id, NewWarband.warband_data, JSONVal.Armoury[i].Cost, item_costtype, OptionList, FullList);
        }

        // Models
        const ModelOptionList = await (NewWarband.warband_data).GetFighterOptions(false);
        const ModelFullList = await ModelFactory.GetAllFactionModel([], []);
        for (let i = 0; i < JSONVal.Members.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(JSONVal.Members[i].Model.ID);
            const item_costtype = JSONVal.Members[i].Model.CostType == "ducats"? 0 : 1;
            await this.BuildModel(mod_id, NewWarband.warband_data, JSONVal.Members[i].Model.Cost, item_costtype, ModelOptionList, ModelFullList, JSONVal.Members[i], OptionList, FullList);
        }
        

        // Locations
        for (let i = 0; i < JSONVal.Locations.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(JSONVal.Locations[i].id);
            await this.BuildLocation(mod_id, NewWarband.warband_data);
        }

        // (Exploration) Modifiers
        await this.BuildExplorationSkills(JSONVal.Modifiers, NewWarband.warband_data)

        // Notes
        NewWarband.warband_data.SaveNote(JSONVal.Notes, "notes")

        await this.UserWarbandManager.UpdateItemInfo(NewWarband.id)
        return true;
    }

    public async BuildLocation(location_id : string, wb : UserWarband) {
        try {
            const NewLocation = await ExplorationFactory.CreateNewExplorationLocation(location_id, wb, true);
            await wb.Exploration.AddExplorationLocation(NewLocation, []);
        } catch (e) {
            console.log(e)
        }
    }

    public async BuildEquipment(item_id : string, wb : UserWarband, cost_val : number, cost_type : number, options : FactionEquipmentRelationship[], fulloptions : FactionEquipmentRelationship[]) {
        const op_id = options.map(obj => obj.EquipmentItem.ID)
        try {
            let FacRel : FactionEquipmentRelationship | null = null;
            if (op_id.includes(item_id)) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].EquipmentItem.ID == item_id) {
                        FacRel = options[i]
                        break;
                    }
                }
            } else {
                for (let i = 0; i < fulloptions.length; i++) {
                    if (fulloptions[i].EquipmentItem.ID == item_id) {
                        FacRel = fulloptions[i]                        
                        break;
                    }
                }
            }

            if (FacRel != null) {
                let isfree = false;
                if (cost_val == 0) { isfree = true;}
                if (cost_val > 0) {FacRel.Cost = cost_val}
                FacRel.CostType = cost_type;
                await wb.AddStash(FacRel, isfree, null);
            }

        } catch (e) {
            console.log(e)
            console.log(item_id)
        }
    }

    public async BuildModel(
        item_id : string, wb : UserWarband, cost_val : number, cost_type : number, 
        options : FactionModelRelationship[], fulloptions : FactionModelRelationship[], 
        data : any,
        refoptions : FactionEquipmentRelationship[], reffulloptions : FactionEquipmentRelationship[]) {
        const op_id = options.map(obj => obj.Model.ID)
        try {
            
            let FacRel : FactionModelRelationship | null = null;
            if (op_id.includes(item_id)) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].Model.ID == item_id) {
                        FacRel = options[i]
                        break;
                    }
                }
            } else {
                for (let i = 0; i < fulloptions.length; i++) {
                    if (fulloptions[i].Model.ID == item_id) {
                        FacRel = fulloptions[i]                        
                        break;
                    }
                }
            }
            if (FacRel != null) {
                let isfree = false;
                if (cost_val == 0) {isfree = true;}
                if (cost_val > 0) {FacRel.Cost = cost_val}
                FacRel.CostType = cost_type;
                const Added : WarbandPurchase[] = await wb.AddFighter([FacRel], isfree);
                for (let j = 0; j < Added.length; j++) { await this.BuildModelFull(Added[j], wb, data, refoptions, reffulloptions);}
            }

        } catch (e) {
            console.log(e)
            console.log(item_id)
        }
    }

    public async BuildModelFull(mdl : WarbandPurchase, wb : UserWarband, data : any,
        refoptions : FactionEquipmentRelationship[], reffulloptions : FactionEquipmentRelationship[]) {
        const GetModel = mdl.HeldObject as WarbandMember;

        // Injuries
        for (let i = 0; i < data.Injuries.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(data.Injuries[i].ID);
            await this.BuildInjury(mod_id, GetModel);
        }

        // Equipment
        for (let i = 0; i < data.Equipment.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(data.Equipment[i].ID);
            const item_costtype = data.Equipment[i].CostType == "ducats"? 0 : 1;
            await this.BuildModelEquipment(mod_id, GetModel, data.Equipment[i].Cost, item_costtype, refoptions, reffulloptions);
        }

        // Skills
        for (let i = 0; i < data.Skills.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(data.Skills[i].id);
            await this.BuildSkill(mod_id, GetModel);
        }

        // Upgrades
        const BaseList = await (GetModel).GetWarbandUpgradeCollections();
        const OptionList : MemberUpgradePresentation[] = []
        const GroupList = Object.keys(BaseList);

        for (let i = 0; i < GroupList.length; i++) {
            for (let j = 0; j < BaseList[GroupList[i]].upgrades.length; j++) {
                OptionList.push(BaseList[GroupList[i]].upgrades[j])
            }
        }
        
        const FullList = await UpgradeFactory.GetAllModelUpgrade();
        for (let i = 0; i < data.Upgrades.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(data.Upgrades[i].ID);
            await this.BuildModelUpgrade(mod_id, GetModel, data.Upgrades[i].Cost, OptionList, FullList);
        }

        // General
        GetModel.Name = data.Name;
        GetModel.Elite = data.Elite;
        GetModel.Experience = data.Experience;
        GetModel.SaveNote(data.Notes, "notes")
        if (data.Reserve == true) {
            GetModel.State = "reserved";
        }
    }

    public async BuildInjury(injury_id : string, md : WarbandMember) {
        try {
            const NewInjury = await InjuryFactory.CreateNewInjury(injury_id, md);
            await md.AddInjury(NewInjury);
        } catch (e) {
            console.log(e)
        }
    }

    public async BuildSkill(skill_id : string, md : WarbandMember) {
        try {
            const NewSkill = await SkillFactory.CreateNewSkill(skill_id, md);
            await md.AddSkill(NewSkill);
        } catch (e) {
            console.log(e)
        }
    }

    public async BuildModelUpgrade(item_id : string, md : WarbandMember, cost_val : number, options : MemberUpgradePresentation[], fulloptions : ModelUpgradeRelationship[]) {
        const op_id = options.map(obj => obj.upgrade.UpgradeObject.ID)
        try {
            if (op_id.includes(item_id)) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].upgrade.UpgradeObject.ID == item_id) {
                        await md.AddUpgrade(options[i]);
                        break;
                    }
                }
            } else {
                for (let i = 0; i < fulloptions.length; i++) {
                    if (fulloptions[i].UpgradeObject.ID == item_id) {
                        const memup : MemberUpgradePresentation = {
                            allowed: true,
                            cost: cost_val,
                            cur_count: 0,
                            discount: 0,
                            max_count: 1,
                            purchase: null,
                            upgrade: fulloptions[i]
                        }
                        
                        await md.AddUpgrade(memup);
                        break;
                    }
                }
            }

        } catch (e) {
            console.log(e)
            console.log(item_id)
        }
    }


    public async BuildModelEquipment(item_id : string, md : WarbandMember, cost_val : number, cost_type : number, options : FactionEquipmentRelationship[], fulloptions : FactionEquipmentRelationship[]) {
        const op_id = options.map(obj => obj.EquipmentItem.ID)
        try {
            let FacRel : FactionEquipmentRelationship | null = null;
            if (op_id.includes(item_id)) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].EquipmentItem.ID == item_id) {
                        FacRel = options[i]
                        break;
                    }
                }
            } else {
                for (let i = 0; i < fulloptions.length; i++) {
                    if (fulloptions[i].EquipmentItem.ID == item_id) {
                        FacRel = fulloptions[i]                        
                        break;
                    }
                }
            }

            if (FacRel != null) {
                FacRel.Cost = cost_val;
                FacRel.CostType = cost_type;
                await md.AddEquipment(FacRel);
            }

        } catch (e) {
            console.log(e)
            console.log(item_id)
        }
    }

    public async BuildExplorationSkills(SkillSet : any, wb : UserWarband) {
        let FoundDefault = false;
        for (let i = 0; i < SkillSet.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(SkillSet[i].id);

            if (mod_id == "es_reroll" && FoundDefault == false) {
                FoundDefault = true;
                continue;
            }
            try {
                const Value = await SkillFactory.CreateNewSkill(mod_id, wb);
                const NewSkill = new WarbandProperty(Value, wb, null, null);
                await NewSkill.HandleDynamicProps(Value, wb, null, null);
                wb.Exploration.Skills.push(NewSkill);
            } catch(e) {
                console.log(e)
                console.log(SkillSet[i].id)
            }
        }
    }

}

export {CompendiumImporter}