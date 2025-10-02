import { FactionEquipmentRelationship } from "../../../relationship/faction/FactionEquipmentRelationship";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ConvertCompendiumToCompanionID } from "../../../../resources/staticcontext/importdata/compendiumdata";
import { ToolsController } from "../../../_high_level_controllers/ToolsController";
import { IUserWarband, UserWarband } from "../UserWarband";
import { SumWarband, WarbandManager } from "../WarbandManager";
import { IWarbandProperty, WarbandProperty } from "../WarbandProperty";
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
        const fin_locations : IWarbandProperty[] = []
        
        // Update a warband's Locations to include new modifiers
        for (let i = 0; i < locations.length; i++) {
            let DoAdd = true
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
            
            // Golgatha Tektites
            if (locations[i].object_id == "el_golgothatektites_apply") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_golgothatektites_apply", selections: locations[i].selections, consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_golgothatektites_apply", selections: locations[i].selections, consumables : [] } ] }
                locations[i].selections = [];
                DoAdd = false;
            }
            
            // Alchemist's Workshop
            if (locations[i].object_id == "el_ransackedalchemistworkshop") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_ransackedalchemistworkshop_mod", selections: locations[i].selections, consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_ransackedalchemistworkshop_mod", selections: locations[i].selections, consumables : [] } ] }
                locations[i].selections = [];
            }
            
            // Ressurection Machine
            if (locations[i].object_id == "el_abandonedressurectionmachine") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_abandonedressurectionmachine_mod", selections: locations[i].selections, consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_abandonedressurectionmachine_mod", selections: locations[i].selections, consumables : [] } ] }
                locations[i].selections = [];
            }
            
            // Pot of Manna
            if (locations[i].object_id == "el_potofmanna") {
                if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_potofmanna_mod", selections: [], consumables : [] } )
                } else { wb.exploration.location_mods =[ { object_id: "el_potofmanna_mod", selections: [], consumables : [] } ] }
            }
            
            // Moonshine Stash Distribute
            if (locations[i].object_id == "el_moonshinestash") {
                for (let j = 0; j < locations[i].selections.length; j++) {
                    if (locations[i].selections[j].selection_ID == "el_moonshinestash_distribute") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_moonshinestash_distribute", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_moonshinestash_distribute", selections: [], consumables : [] } ] }
                    }
                }
            }
            
            // Stash of Drugs & Erotica Indulge
            if (locations[i].object_id == "el_stashofdrugsanderotica") {
                for (let j = 0; j < locations[i].selections.length; j++) {
                    if (locations[i].selections[j].selection_ID == "el_stashofdrugsanderotica_indulge") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_stashofdrugsanderotica_indulge", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_stashofdrugsanderotica_indulge", selections: [], consumables : [] } ] }
                    }
                }
            }
            
            // Esoteric Library
            if (locations[i].object_id == "el_esotericlibrary") {
                for (let j = 0; j < locations[i].selections.length; j++) {
                    if (locations[i].selections[j].selection_ID == "el_esotericlibrary_plague") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_esotericlibrary_plague", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_esotericlibrary_plague", selections: [], consumables : [] } ] }
                    }
                    if (locations[i].selections[j].selection_ID == "el_esotericlibrary_study") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_esotericlibrary_study", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_esotericlibrary_study", selections: [], consumables : [] } ] }
                    }
                }
            }
            
            // Jabirean Books
            if (locations[i].object_id == "el_jabireanalchemicalbooks") {
                for (let j = 0; j < locations[i].selections.length; j++) {
                    if (locations[i].selections[j].selection_ID == "el_jabireanalchemicalbooks_study") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_jabireanalchemicalbooks_study", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_jabireanalchemicalbooks_study", selections: [], consumables : [] } ] }
                    }
                    if (locations[i].selections[j].selection_ID == "el_jabireanalchemicalbooks_keep") {
                        if (wb.exploration.location_mods) { wb.exploration.location_mods.push( { object_id: "el_jabireanalchemicalbooks_keep", selections: [], consumables : [] } )
                        } else { wb.exploration.location_mods =[ { object_id: "el_jabireanalchemicalbooks_keep", selections: [], consumables : [] } ] }
                    }
                }
            }

            if (DoAdd) {
                fin_locations.push(locations[i])
            }
        }
        wb.exploration.locations = fin_locations;
        return wb;
    }

}

export {WarbandUpdater}