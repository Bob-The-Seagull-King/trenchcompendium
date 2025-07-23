import { CompendiumItem, ICompendiumItemData, ItemType } from '../../../CompendiumItem'
import { DescriptionFactory } from '../../../../utility/functions';
import { INote } from '../../../Note';
import { IWarbandContextItem, WarbandContextItem } from './../High_Level/WarbandContextItem';
import { DynamicOptionContextObject } from '../../../options/DynamicOptionContextObject';
import { ContextObject, IContextObject } from '../../../contextevent/contextobject';
import { DynamicContextObject } from '../../../contextevent/dynamiccontextobject';
import { StaticOptionContextObject } from '../../../options/StaticOptionContextObject';
import { ContextPackage } from '../../../contextevent/contextpackage';
import { IWarbandMember, WarbandMember } from './WarbandMember';
import { IWarbandEquipment, WarbandEquipment } from './WarbandEquipment';
import { IWarbandProperty, WarbandProperty } from '../WarbandProperty';
import { IFactionModelRelationship } from '../../../relationship/faction/FactionModelRelationship';
import { IFactionEquipmentRelationship } from '../../../relationship/faction/FactionEquipmentRelationship';
import { IModelUpgradeRelationship } from '../../../relationship/model/ModelUpgradeRelationship';

interface IWarbandPurchase {
    cost_value : number,
    cost_type : number,
    count_limit : boolean,
    count_cap : boolean,
    sell_item : boolean,
    sell_full : boolean,
    purchaseid: string,
    faction_rel_id: string,
    custom_rel?: IFactionModelRelationship | IFactionEquipmentRelationship | IModelUpgradeRelationship,
    modelpurch : boolean
}

interface IWarbandPurchaseModel {
    purchase : IWarbandPurchase,
    model : IWarbandMember
}

interface IWarbandPurchaseEquipment {
    purchase : IWarbandPurchase,
    equipment : IWarbandEquipment
}

interface IWarbandPurchaseUpgrade {
    purchase : IWarbandPurchase,
    upgrade : IWarbandProperty
}

interface RealWarbandPurchaseModel {
    purchase : WarbandPurchase,
    model : WarbandMember
}

interface RealWarbandPurchaseEquipment {
    purchase : WarbandPurchase,
    equipment : WarbandEquipment
}

interface RealWarbandPurchaseUpgrade {
    purchase : WarbandPurchase,
    upgrade : WarbandProperty
}

class WarbandPurchase {
    SelfParent : DynamicContextObject;
    HeldObject : ContextObject;

    PurchaseInterface : string;
    CustomInterface : IFactionModelRelationship | IFactionEquipmentRelationship | IModelUpgradeRelationship | undefined = undefined;

    ItemCost : number;
    CostType : number;

    CountLimit : boolean;
    CountCap : boolean;
    Sellable : boolean;
    FullSell : boolean;
    ModelPurchase : boolean;
    

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandPurchase, parent : DynamicContextObject, heldItem : ContextObject)
    {
        this.SelfParent = parent;
        this.HeldObject = heldItem;
        this.ItemCost = data.cost_value;
        this.CostType = data.cost_type;
        this.CountLimit = data.count_limit;
        this.CountCap = data.count_cap;
        this.Sellable = data.sell_item;
        this.FullSell = data.sell_full;
        this.PurchaseInterface = data.faction_rel_id;
        if (data.custom_rel) {
            this.CustomInterface = data.custom_rel;
        }
        if (data.modelpurch) {
            this.ModelPurchase = data.modelpurch;
        } else {
            this.ModelPurchase = false;
        }
    }

    public ConvertToInterface() {

        const _objint : IWarbandPurchase = {
            cost_value : this.ItemCost,
            cost_type : this.CostType,
            count_limit : this.CountLimit,
            count_cap : this.CountCap,
            sell_item : this.Sellable,
            sell_full : this.FullSell,
            purchaseid: this.HeldObject.ID,
            faction_rel_id: this.PurchaseInterface,
            custom_rel : this.CustomInterface,
            modelpurch : this.ModelPurchase
        }
        
        return _objint;
    }

    public ConvertToInterfaceModel() {

        const _objint : IWarbandPurchaseModel = {
            purchase : this.ConvertToInterface(),
            model : (this.HeldObject as WarbandMember).ConvertToInterface()
        }
        
        return _objint;
    }

    public ConvertToInterfaceEquipment() {

        const _objint : IWarbandPurchaseEquipment = {
            purchase : this.ConvertToInterface(),
            equipment : (this.HeldObject as WarbandEquipment).ConvertToInterface()
        }
        
        return _objint;
    }

    public ConvertToInterfaceUpgrade() {

        const _objint : IWarbandPurchaseUpgrade = {
            purchase : this.ConvertToInterface(),
            upgrade : (this.HeldObject as WarbandProperty).ConvertToInterface()
        }
        
        return _objint;
    }

    public GetTotalDucats(overridecap = false) {
        let TotalDucatCost = 0;
        if (this.CostType == 0) {
            TotalDucatCost += this.ItemCost;
        }

        if (this.HeldObject instanceof WarbandMember) {
            TotalDucatCost += this.HeldObject.GetSubCosts(0, overridecap);
        } else if (this.HeldObject instanceof WarbandEquipment) {
            TotalDucatCost += this.HeldObject.GetSubCosts(0, overridecap);
        }

        return TotalDucatCost;
    }

    public GetTotalGlory() {
        let TotalGloryCost = 0;
        if (this.CostType == 1) {
            TotalGloryCost += this.ItemCost;
        }

        if (this.HeldObject instanceof WarbandMember) {
            TotalGloryCost += this.HeldObject.GetSubCosts(1);
        } else if (this.HeldObject instanceof WarbandEquipment) {
            TotalGloryCost += this.HeldObject.GetSubCosts(1);
        }

        return TotalGloryCost;
    }

    public GetOwnItem() {

        if (this.HeldObject instanceof WarbandMember) {
            return this.HeldObject as WarbandMember;
        } else if (this.HeldObject instanceof WarbandEquipment) {
            return this.HeldObject as WarbandEquipment;
        } else if (this.HeldObject instanceof WarbandProperty) {
            return this.HeldObject as WarbandProperty;
        }
    }

    public GetItemName() {
        const val = this.GetOwnItem();

        if (val instanceof WarbandMember) {
            return val.GetTrueName();
        } else if (this.HeldObject instanceof WarbandEquipment) {
            return (val as WarbandEquipment).MyEquipment.GetTrueName();
        } else if (this.HeldObject instanceof WarbandProperty) {
            return (val as WarbandProperty).SelfDynamicProperty.OptionChoice.GetTrueName();
        }
        return val? val.GetTrueName() : "";
    }

}

export {IWarbandPurchase, WarbandPurchase, IWarbandPurchaseModel, IWarbandPurchaseEquipment, IWarbandPurchaseUpgrade, RealWarbandPurchaseModel, RealWarbandPurchaseEquipment, RealWarbandPurchaseUpgrade}

