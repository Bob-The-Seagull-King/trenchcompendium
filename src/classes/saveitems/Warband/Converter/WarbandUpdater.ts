import { FactionEquipmentRelationship } from "../../../relationship/faction/FactionEquipmentRelationship";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ConvertCompendiumToCompanionID } from "../../../../resources/staticcontext/importdata/compendiumdata";
import { ToolsController } from "../../../_high_level_controllers/ToolsController";
import { IUserWarband, UserWarband } from "../UserWarband";
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


class WarbandUpdater {

    
    private static instance: WarbandUpdater;
    UserWarbandManager : WarbandManager;

    // USED TO HANDLE UPDATE
    private readonly UPDATEVALUE : number = 1;
    private readonly UPDATETAGNAME : string = "";

    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
        const toolcont = ToolsController.getInstance();
        this.UserWarbandManager = toolcont.UserWarbandManager;
    }

    public static getInstance(): WarbandUpdater {
        if (!WarbandUpdater.instance) {
            WarbandUpdater.instance = new WarbandUpdater();
        }
        return WarbandUpdater.instance;
    }

    public CheckUpdate(wb : IUserWarband): boolean {
        if (wb.tags[this.UPDATETAGNAME]) {
            return wb.tags[this.UPDATETAGNAME] == this.UPDATEVALUE;
        } else {
            return false;
        }
    }

    public async RunUpdate(wb : IUserWarband) : Promise<IUserWarband> {
        return wb;
    }

}

export {WarbandUpdater}