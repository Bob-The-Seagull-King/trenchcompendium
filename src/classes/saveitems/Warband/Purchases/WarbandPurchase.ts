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

interface IWarbandPurchase {
    cost_value : number,
    cost_type : number,
    count_limit : boolean,
    count_cap : boolean,
    sell_item : boolean,
    sell_full : boolean,
    purchaseid: string
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

class WarbandPurchase {
    SelfParent : DynamicContextObject;
    HeldObject : ContextObject;

    ItemCost : number;
    CostType : number;

    CountLimit : boolean;
    CountCap : boolean;
    Sellable : boolean;
    FullSell : boolean;
    

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
    }

    public ConvertToInterface() {

        const _objint : IWarbandPurchase = {
            cost_value : this.ItemCost,
            cost_type : this.CostType,
            count_limit : this.CountLimit,
            count_cap : this.CountCap,
            sell_item : this.Sellable,
            sell_full : this.FullSell,
            purchaseid: this.HeldObject.ID
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

}

export {IWarbandPurchase, WarbandPurchase, IWarbandPurchaseModel, IWarbandPurchaseEquipment, IWarbandPurchaseUpgrade}

