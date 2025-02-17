import { TableBody } from "../feature/table/tablebody";
import { CompendiumItem } from "../CompendiumItem";
import { GlossaryRule } from "../feature/glossary/Glossary"
import { Keyword } from "../feature/glossary/Keyword";
import { ModelCollection } from "../feature/model/ModelCollection";
import { Model } from "../feature/model/Model";
import { Ability } from "../feature/ability/Ability";
import { Upgrade } from "../feature/ability/Upgrade";
import { ModelUpgradeRelationship } from "../relationship/model/ModelUpgradeRelationship";
import { Equipment } from "../feature/equipment/Equipment";
import { ModelEquipmentRelationship } from "../relationship/model/ModelEquipmentRelationship";
import { Faction } from "../feature/faction/Faction";
import { FactionCollection } from "../feature/faction/FactionCollection";
import { Rule } from "../feature/faction/Rule";
import { FactionModelRelationship } from "../relationship/faction/FactionModelRelationship";
import { Requester } from "../../factories/Requester";

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class StaticDataCache {

    private static instance: StaticDataCache;
    
    public GlossaryCache :  {[tokenid: string]: GlossaryRule} = {};
    public TableCache :  {[tokenid: string]: TableBody} = {};
    public KeywordCache :  {[tokenid: string]: Keyword} = {};
    public ModelCollectionCache :  {[tokenid: string]: ModelCollection} = {};
    public ModelCache :  {[tokenid: string]: Model} = {};
    public AbilityCache :  {[tokenid: string]: Ability} = {};
    public UpgradeCache :  {[tokenid: string]: Upgrade} = {};
    public ModelUpgradeCache :  {[tokenid: string]: ModelUpgradeRelationship} = {};
    public EquipmentCache :  {[tokenid: string]: Equipment} = {};
    public ModelEquipmentCache :  {[tokenid: string]: ModelEquipmentRelationship} = {};
    public FactionCollectionCache :  {[tokenid: string]: FactionCollection} = {};
    public FactionCache :  {[tokenid: string]: Faction} = {};
    public RuleCache :  {[tokenid: string]: Rule} = {};
    public FactionModelCache :  {[tokenid: string]: FactionModelRelationship} = {};

    public CheckID(cachename : string, id_val : string) {
        switch (cachename) {
            case 'glossary': 
                return (this.GlossaryCache[id_val] == null)
            case 'table': 
                return (this.TableCache[id_val] == null)
            case 'keyword': 
                return (this.KeywordCache[id_val] == null)
            case 'modelcollection': 
                return (this.ModelCollectionCache[id_val] == null)
            case 'model': 
                return (this.ModelCache[id_val] == null)
            case 'ability': 
                return (this.AbilityCache[id_val] == null)
            case 'upgrade': 
                return (this.UpgradeCache[id_val] == null)
            case 'modelupgrade': 
                return (this.ModelUpgradeCache[id_val] == null)
            case 'equipment': 
                return (this.EquipmentCache[id_val] == null)
            case 'modelequipment': 
                return (this.ModelEquipmentCache[id_val] == null)
            case 'factioncollection': 
                return (this.FactionCollectionCache[id_val] == null)
            case 'faction': 
                return (this.FactionCache[id_val] == null)
            case 'rule': 
                return (this.RuleCache[id_val] == null)
            case 'factionmodel': 
                return (this.FactionModelCache[id_val] == null)
            default: return false;
        }
    }

    public AddToCache(cachename : string, obj : any) {
        switch (cachename) {
            case 'glossary': 
                if (this.GlossaryCache[obj.ID] == null) {
                    this.GlossaryCache[obj.ID] = obj as GlossaryRule;
                }
                return;
            case 'table': 
                if (this.TableCache[obj.ID] == null) {
                    this.TableCache[obj.ID] = obj as TableBody;
                }
                return;
            case 'keyword': 
                if (this.KeywordCache[obj.ID] == null) {
                    this.KeywordCache[obj.ID] = obj as Keyword;
                }
                return;
            case 'modelcollection': 
                if (this.ModelCollectionCache[obj.ID] == null) {
                    this.ModelCollectionCache[obj.ID] = obj as ModelCollection;
                }
                return;
            case 'model':   
                if (this.ModelCache[obj.ID] == null) {
                    this.ModelCache[obj.ID] = obj as Model;
                }
                return;
            case 'ability':   
                if (this.AbilityCache[obj.ID] == null) {
                    this.AbilityCache[obj.ID] = obj as Ability;
                }
                return;
            case 'upgrade':   
                if (this.UpgradeCache[obj.ID] == null) {
                    this.UpgradeCache[obj.ID] = obj as Upgrade;
                }
                return;
            case 'modelupgrade':   
                if (this.ModelUpgradeCache[obj.ID] == null) {
                    this.ModelUpgradeCache[obj.ID] = obj as ModelUpgradeRelationship;
                }
                return;
            case 'equipment':   
                if (this.EquipmentCache[obj.ID] == null) {
                    this.EquipmentCache[obj.ID] = obj as Equipment;
                }
                return;
            case 'modelequipment':   
                if (this.ModelEquipmentCache[obj.ID] == null) {
                    this.ModelEquipmentCache[obj.ID] = obj as ModelEquipmentRelationship;
                }
                return;
            case 'factioncollection': 
                if (this.FactionCollectionCache[obj.ID] == null) {
                    this.FactionCollectionCache[obj.ID] = obj as FactionCollection;
                }
                return;
            case 'faction':   
                if (this.FactionCache[obj.ID] == null) {
                    this.FactionCache[obj.ID] = obj as Faction;
                }
                return;
            case 'rule':   
                if (this.RuleCache[obj.ID] == null) {
                    this.RuleCache[obj.ID] = obj as Rule;
                }
                return;
            case 'factionmodel':   
                if (this.FactionModelCache[obj.ID] == null) {
                    this.FactionModelCache[obj.ID] = obj as FactionModelRelationship;
                }
                return;
            default: return;
        }
    } 


    public static getInstance(): StaticDataCache {
        if (!StaticDataCache.instance) {
          StaticDataCache.instance = new StaticDataCache();
        }
        return StaticDataCache.instance;
      }

}

export {StaticDataCache}