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

export const UPDATEVALUE = 1;
export const UPDATETAGNAME = "UPDATE_VERSION_REFERENCE";

class WarbandUpdater {

    
    private static instance: WarbandUpdater;
    UserWarbandManager : WarbandManager;

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
        if (wb.tags[UPDATETAGNAME]) {
            return wb.tags[UPDATETAGNAME] == UPDATEVALUE;
        } else {
            return false;
        }
    }

    public async RunUpdate(wb : IUserWarband) : Promise<IUserWarband> {
        const TagVal = wb.tags[UPDATETAGNAME]
        const CurrentVer = (typeof TagVal === "string") ? parseInt(TagVal) : 0
        let ref_wb = wb;

        if (CurrentVer < 1) {
            ref_wb = await this.Update_Version1(ref_wb);
        }
        
        return ref_wb;
    }

    public async Update_Version1(wb : IUserWarband) : Promise<IUserWarband> {
        
        wb.tags[UPDATETAGNAME] = 1;

        const locations = wb.exploration.locations;

        // Update a warband's Locations to include new modifiers
        for (let i = 0; i < locations.length; i++) {
            
            // Black Network Contact
            if (locations[i].object_id == "el_blacknetworkcontact") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_blacknetworkcontact_mod", selections: [], consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_blacknetworkcontact_mod", selections: [], consumables : [] } ] }
            }

            // Trench Merchant - Trade Selection
            if (locations[i].object_id == "el_trenchmerchant_trade") {
                if (wb.exploration.location_mods) {
                    wb.exploration.location_mods.push( { object_id: "el_trenchmerchant_trade_mod", selections: [], consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_trenchmerchant_trade_mod", selections: [], consumables : [] } ] }
            }
            
            // Black Market
            if (locations[i].object_id == "el_blackmarket") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_blackmarket_mod", selections: [], consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_blackmarket_mod", selections: [], consumables : [] } ] }
            }
        }

        return wb;
    }

}

export {WarbandUpdater}