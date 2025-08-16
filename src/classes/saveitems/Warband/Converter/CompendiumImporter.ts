import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ConvertCompendiumToCompanionID } from "../../../../resources/staticcontext/importdata/compendiumdata";
import { ToolsController } from "../../../_high_level_controllers/ToolsController";
import { UserWarband } from "../UserWarband";
import { SumWarband, WarbandManager } from "../WarbandManager";
import { WarbandProperty } from "../WarbandProperty";


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
        
        // Stash

        // Locations

        // (Exploration) Modifiers
        await this.BuildExplorationSkills(JSONVal.Modifiers, NewWarband.warband_data)

        // Notes
        NewWarband.warband_data.SaveNote(JSONVal.Notes, "notes")

        await this.UserWarbandManager.UpdateItemInfo(NewWarband.id)
        return true;
    }

    public async BuildExplorationSkills(SkillSet : any, wb : UserWarband) {
        let FoundDefault = false;
        for (let i = 0; i < SkillSet.length; i++) {
            const mod_id = ConvertCompendiumToCompanionID(SkillSet[i].id);

            if (mod_id == "es_reroll" && FoundDefault == false) {
                FoundDefault = true;
                continue;
            }
            
            const Value = await SkillFactory.CreateNewSkill(mod_id, wb);
            const NewSkill = new WarbandProperty(Value, wb, null, null);
            await NewSkill.HandleDynamicProps(Value, wb, null, null);
            wb.Exploration.Skills.push(NewSkill);
            
        }
    }

}

export {CompendiumImporter}