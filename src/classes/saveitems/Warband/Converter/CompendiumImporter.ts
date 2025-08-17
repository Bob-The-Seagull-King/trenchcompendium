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
import { WarbandMember } from "../Purchases/WarbandMember";


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

        // Models
        const ModelOptionList = await (NewWarband.warband_data).GetFighterOptions(false);
        const ModelFullList = await ModelFactory.GetAllFactionModel([], []);
        for (let i = 0; i < JSONVal.Members.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(JSONVal.Members[i].Model.ID);
            const item_costtype = JSONVal.Members[i].Model.CostType == "ducats"? 0 : 1;
            await this.BuildModel(mod_id, NewWarband.warband_data, JSONVal.Members[i].Model.Cost, item_costtype, ModelOptionList, ModelFullList, JSONVal.Members[i]);
        }
        
        // Stash
        const OptionList = await (NewWarband.warband_data).GetFactionEquipmentOptions(true, false, true, false);
        const FullList = await EquipmentFactory.GetAllFactionEquipment(true, [], []);
        for (let i = 0; i < JSONVal.Armoury.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(JSONVal.Armoury[i].ID);
            const item_costtype = JSONVal.Armoury[i].CostType == "ducats"? 0 : 1;
            await this.BuildEquipment(mod_id, NewWarband.warband_data, JSONVal.Armoury[i].Cost, item_costtype, OptionList, FullList);
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

    public async BuildModel(item_id : string, wb : UserWarband, cost_val : number, cost_type : number, options : FactionModelRelationship[], fulloptions : FactionModelRelationship[], data : any) {
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
                for (let j = 0; j < Added.length; j++) { await this.BuildModelFull(Added[j], wb, data);}
            }

        } catch (e) {
            console.log(e)
            console.log(item_id)
        }
    }

    public async BuildModelFull(mdl : WarbandPurchase, wb : UserWarband, data : any) {
        const GetModel = mdl.HeldObject as WarbandMember;

        GetModel.Name = data.Name;
        GetModel.Elite = data.Elite;
        GetModel.Experience = data.Experience;
        GetModel.SaveNote(data.Notes, "notes")
        if (data.Reserve == true) {
            GetModel.State = "reserved";
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