import { SiteUser } from '../../user_synod/site_user';
import { WarbandFactory } from '../../../factories/warband/WarbandFactory';
import { IWarbandContextItem } from './High_Level/WarbandContextItem';
import { UserWarband, IUserWarband } from './UserWarband';
import { UserFactory } from '../../../factories/synod/UserFactory';
import { SYNOD } from '../../../resources/api-constants';

export interface ISumWarband {
    id : number // -1 means LOCAL warband
    warband_data : IUserWarband
}

export interface SumWarband {
    id : number // -1 means LOCAL warband
    warband_data : UserWarband
}

class WarbandManager {
    private WarbandItemList: SumWarband[] = []; 
    private LocalIDCount : number;
    private UserProfile : SiteUser | null = null;

    public ListOfWarbands : SumWarband[] = [];

    public constructor() {
        const StoredVal = localStorage.getItem('localwarbandcount')
        if (StoredVal != null) {
            try {
                this.LocalIDCount = Number(StoredVal);
            } catch (e) {
                this.LocalIDCount = -999;
            }            
        } else {
            this.LocalIDCount = 0;
            localStorage.setItem('localwarbandcount', '-999')
        }
    }

    private GetIDLocal() : number {
        let needID = true;
        while (needID) {
            needID = false;
            if (this.LocalIDCount == undefined) { 
                this.LocalIDCount = -999;
            }
            for (let i = 0; i < this.WarbandItemList.length; i++) {
                if (this.WarbandItemList[i].id == this.LocalIDCount) {
                    this.LocalIDCount += 1;
                    localStorage.setItem('localwarbandcount', String(this.LocalIDCount))
                    needID = true;
                }
            }
        }
        return this.LocalIDCount;
    }

    public CurWarbands() : SumWarband[] { 
        if (this.UserProfile != null) {
            return this.UserProfile.Warbands;
        }
        return this.WarbandItemList;
    }

    public async SetLoggedUser(id : number) {
        const NewUser : SiteUser | null = await UserFactory.CreatePrivateUserByID(id);
        this.UserProfile = NewUser;
    }

    public RemoveLoggedUser() {
        this.UserProfile = null;
    }

    public async GrabUser() {
        
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');
        if (storedToken && storedUserId && this.UserProfile == null) {
            await this.SetLoggedUser(parseInt(storedUserId, 10));
        }
    }

    public async GetItemsAll() {
        await this.GrabUser();
        this.WarbandItemList = await this.GrabItems();
    }
    
    /**
     * @param _name The name of the item to find
     * @returns The first instance of a item with that name
     */
    public GetItemByName(_name : string) {
        let i = 0;
        for (i=0; i < this.CurWarbands().length ; i++) {
            try {
                const nameval = this.CurWarbands()[i].warband_data.Name 
                if ((nameval != undefined? nameval : "" ).trim() == _name) {
                    return this.CurWarbands()[i]
                }
            } catch (e) {
                console.log("Broken Save Item Found")
            }
        }
        return null;
    }  

    /**
     * @param _name The name of the item to find
     * @returns The first instance of a item with that name
     */
    public GetItemByID(_id : string) {
        let i = 0;
        for (i=0; i < this.CurWarbands().length ; i++) {
            if (this.CurWarbands()[i].id == Number(_id)) {
                return this.CurWarbands()[i]
            }
        }
        return null;
    }

    /**
     * Gets all of the saved items.
     */
    public async GrabItems() {
        if (this.UserProfile != null) {
            this.ListOfWarbands = this.UserProfile.Warbands;
            return this.UserProfile.Warbands;
        }
        const TempList: SumWarband[] = [];  
        const data = localStorage.getItem('userwarbanditem');  
        try {
            const ItemList: ISumWarband[] = JSON.parse(data || "");
            for (let i = 0; i < ItemList.length; i++) {
                TempList.push(
                    {
                        id: ItemList[i].id,
                        warband_data:    await WarbandFactory.CreateUserWarband(ItemList[i].warband_data)
                    })
            }
            this.ListOfWarbands = TempList;
            return TempList;
        } catch (e) {
            undefined;
        }
        this.ListOfWarbands = TempList;
        return TempList;
    }

    /**
     * Updates the browser's local storage to reflect
     * the manager's array of items.
     */
    public SetStorage() {
        if (this.UserProfile != null) {
            return;
        }
        this.UpdateLocalStorage();
    }

    public UpdateLocalStorage() {
        const _list: ISumWarband[] = []
        for (let i = 0; i < this.CurWarbands().length; i++) {
            try {
                _list.push(
                    {   
                        id: this.CurWarbands()[i].id,
                        warband_data: this.CurWarbands()[i].warband_data.ConvertToInterface()
                    })
            } catch (e) {
                console.log("Conversion Failed")
            }
        }
        localStorage.setItem('userwarbanditem', JSON.stringify(_list));
    }

    public async UpdateItemInfo(id : number) {
        if (this.UserProfile == null) {
            this.SetStorage();
        } else {
            const Item : null | SumWarband = this.GetItemByID(String(id));
            if (Item != null) {
                this.UpdateWarbandSynod(id, Item)
            }
        }
    }

    /**
     * Getter for the Content Packs
     * @returns All Content Packs
     */
    public GetPack() {
        return this.CurWarbands();
    }

    /**
     * Remove a Content Pack from the manager and
     * update the stored information to match.
     * @param _pack The Content Pack to remove from the manager
     */
    public async DeletePack(_pack : number) {
        if (this.UserProfile != null) {
            const status = await this.DeleteWarbandSynod(_pack);
            if (status == 200) {
                for (let i = 0; i < this.CurWarbands().length; i++) {
                    if (_pack == this.CurWarbands()[i].id) {
                        this.CurWarbands().splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.CurWarbands().length; i++) {
                if (_pack == this.CurWarbands()[i].id) {
                    this.CurWarbands().splice(i, 1);
                    this.SetStorage();
                    break;
                }
            }
        }        
    }

    /**
     * Builds a new item and saves it to the browser
     */
    public async NewItem(_title : string, fact_id : string, ducats : number, glory : number) {

        if (_title.trim().length <= 0) {
            return null;
        }

        const _Item : IUserWarband = {
            id: this.CalcID(_title.trim()),
            contextdata: {},
            name: _title,
            source: 'user_warband',
            tags: {},
            ducat_bank: isNaN(ducats)? 123e34 : ducats,
            glory_bank: isNaN(glory)? 123e34 : ducats,
            notes: [],
            context: {
                id: this.CalcID(_title.trim() + "_context"),
                victory_points: 0,
                campaign_round: 1
            },
            exploration: {
                explorationskills: [
                    {        
                        consumables: [],                
                        object_id: "es_reroll",
                        selections: []
                    }
                ],
                locations: [],
                contextdata: {},
                id: this.CalcID(_title.trim() + "_exploration"),
                name: _title+"_exploration",
                source: 'user_warband',
                tags: {}
            },
            faction: {
                faction_property: {
                    consumables: [],
                    object_id: fact_id,
                    selections: []
                },
                faction_rules : [],
                contextdata: null,
                id: this.CalcID(_title.trim() + "_faction"),
                name: _title+"_faction",
                source: 'user_warband',
                tags: {}
            },            
            models : [],
            equipment : [],
            debts: {
                ducats: 0,
                glory: 0
            },
            modifiers: [],
            fireteams: [],
            consumables: []
        }
        const new_item : UserWarband = await WarbandFactory.CreateUserWarband(_Item)

        if (this.UserProfile != null) {
            const id  = await this.CreateWarbandSynod(new_item.ConvertToInterface())
            const NewSum : SumWarband = {
                    id: Number(id),
                    warband_data: new_item
                }
            this.CurWarbands().push(NewSum)
            return NewSum;
        } else {
            const NewSum : SumWarband = {
                    id: this.GetIDLocal(),
                    warband_data: new_item
                }
            this.WarbandItemList.push(NewSum)
            this.SetStorage();
            return NewSum;
        }
    }

    public async CreateWarbandSynod(wb_data : IUserWarband) {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${SYNOD.URL}/wp-json/wp/v2/warband/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: wb_data.name,
                status: "publish",
                meta: {
                    warband_data: JSON.stringify(wb_data)
                }
            }),
        })
        const json : any = await response.json();
        return json.id
    }

    public async UpdateWarbandSynod(id : number, wb_data : SumWarband) {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${SYNOD.URL}/wp-json/wp/v2/warband/`+String(id), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: wb_data.warband_data.Name,
                meta: {
                    warband_data: JSON.stringify(wb_data.warband_data.ConvertToInterface())
                }
            }),
        })
    }

    public async DeleteWarbandSynod(id : number) {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${SYNOD.URL}/wp-json/wp/v2/warband/`+String(id), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const json : any = await response.json();
        if (response.status) {
            return response.status
        }
        return 0;
    }

    /**
     * Recreates a copy of the item as a new item.
     */
    public async DuplicateItem(_Item : UserWarband) {  
        const NewMember : UserWarband = await WarbandFactory.CreateUserWarband((_Item.ConvertToInterface()));
        NewMember.Name = _Item.Name + " - Copy"
        NewMember.ID = this.CalcID(NewMember.Name);

        if (this.UserProfile != null) {
            const id  = await this.CreateWarbandSynod(NewMember.ConvertToInterface())
            
            this.CurWarbands().push(
                {
                    id: Number(id),
                    warband_data: NewMember
                })
        } else {

            this.CurWarbands().push(
                {
                    id: this.GetIDLocal(),
                    warband_data: NewMember
                })
            this.SetStorage();
        }
    }

    /**
     * Generates an ID based on upload time.
     */
    public CalcID(_name : string) {
        const milliseconds = Date.now();
        const id =  WarbandManager.sanitizeString(_name + milliseconds.toString());
        return id;
    }

    public static sanitizeString(input: string): string {
        return input.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    /**
     * 
     * WARBAND UPDATE FUNCTIONS MOVE THROUGH HERE
     * 
     */

    /**
     * Update the patron of a warband
     * @param wb 
     * @param patron_id 
     */
    public async UpdateWarbandPatron(wb : SumWarband, patron_id : string) {
        wb.warband_data.UpdateSelfPatron(patron_id);
        this.UpdateItemInfo(wb.id);
    }
}

export {WarbandManager}