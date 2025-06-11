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
    private UserProfile : SiteUser | null = null;

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
        if (this.UserProfile != null) {
            for (i=0; i < this.CurWarbands().length ; i++) {
                if (this.CurWarbands()[i].id == Number(_id)) {
                    return this.CurWarbands()[i]
                }
            }
        }
        for (i=0; i < this.CurWarbands().length ; i++) {
            try {
                const nameval = this.CurWarbands()[i].warband_data.ID 
                if ((nameval != undefined? nameval : "" ).trim() == _id) {
                    return this.CurWarbands()[i]
                }
            } catch (e) {
                console.log("Broken Save Item Found")
            }
        }
        return null;
    }

    /**
     * Gets all of the saved items.
     */
    public async GrabItems() {
        if (this.UserProfile != null) {
            return this.UserProfile.Warbands;
        }
        const TempList: SumWarband[] = [];  
        const data = localStorage.getItem('userwarbanditem');  
        try {
            const ItemList: IUserWarband[] = JSON.parse(data || "");
            for (let i = 0; i < ItemList.length; i++) {
                TempList.push(
                    {
                        id: -1,
                        warband_data:    await WarbandFactory.CreateUserWarband(ItemList[i])
                    })
            }
            return TempList;
        } catch (e) {
            undefined;
        }
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
                        id: -1,
                        warband_data: this.CurWarbands()[i].warband_data.ConvertToInterface()
                    })
            } catch (e) {
                console.log("Conversion Failed")
            }
        }
        localStorage.setItem('userwarbanditem', JSON.stringify(_list));
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
    public DeletePack(_pack : UserWarband) {
        let i = 0;
        for (i = 0; i < this.CurWarbands().length; i++) {
            if (_pack == this.CurWarbands()[i].warband_data) {
                this.CurWarbands().splice(i, 1);
                break;
            }
        }
        
        this.SetStorage();
    }

    /**
     * Builds a new item and saves it to the browser
     */
    public async NewItem(_title : string, fact_id : string, self_context: IWarbandContextItem) {

        if (_title.trim().length <= 0) {
            return null;
        }

        const _Item : IUserWarband = {
            id: this.CalcID(_title.trim()),
            contextdata: {},
            name: _title,
            source: 'user_warband',
            tags: {},
            ducat_bank: 0,
            glory_bank: 0,
            notes: [],
            context: {
                id: this.CalcID(_title.trim() + "_context"),
                value_ducat: self_context.value_ducat,
                value_glory: self_context.value_glory
            },
            exploration: {
                explorationskills: [],
                locations: [],
                contextdata: {},
                id: this.CalcID(_title.trim() + "_exploration"),
                name: _title+"_exploration",
                source: 'user_warband',
                tags: {}
            },
            faction: {
                faction_property: {
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
        }
        const new_item : UserWarband = await WarbandFactory.CreateUserWarband(_Item)

        if (this.UserProfile != null) {
            const id  = await this.CreateWarbandSynod(new_item.ConvertToInterface())
            
            this.CurWarbands().push(
                {
                    id: Number(id),
                    warband_data: new_item
                })
        } else {

            this.CurWarbands().push(
                {
                    id: -1,
                    warband_data: new_item
                })
            this.SetStorage();
        }
        return new_item;
    }

    public async CreateWarbandSynod(wb_data : IUserWarband) {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${SYNOD.URL}/wp-json/wp/v2/warband/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
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

    /**
     * Recreates a copy of the item as a new item.
     */
    public async DuplicateItem(_Item : UserWarband) {  
        const NewMember : UserWarband = await WarbandFactory.CreateUserWarband((_Item.ConvertToInterface()));
        NewMember.Name = _Item.Name + " - Copy"
        NewMember.ID = this.CalcID(NewMember.Name);
        
        this.CurWarbands().push(
            {
                id: -1,
                warband_data: NewMember
            });

        this.SetStorage();
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
     * Moves a content pack within the array
     * @param _pack the content pack to move
     * @param direction if the pack should be moved up (true) or down (false)
     */
    public ShufflePack(_pack : UserWarband, direction: boolean) {
        
        let i = 0;
        for (i = 0; i < this.CurWarbands().length; i++) {
            if (_pack == this.CurWarbands()[i].warband_data) {
                break;
            }
        }

        if ((i == 0 && direction == true) || (i == this.CurWarbands().length - 1 && direction == false)) {return;}

        const new_i = i + (direction? -1 : 1);

        const MemberArray = this.CurWarbands().slice();
        [MemberArray[i], MemberArray[new_i]] = [MemberArray[new_i], MemberArray[i]]

        this.WarbandItemList = MemberArray;

        this.SetStorage();
    }

    /**
     * 
     * WARBAND UPDATE FUNCTIONS MOVE THROUGH HERE
     * 
     */

    public async UpdateWarbandPatron(wb : UserWarband, patron_id : string) {
        wb.UpdateSelfPatron(patron_id);
        this.SetStorage();
    }
}

export {WarbandManager}