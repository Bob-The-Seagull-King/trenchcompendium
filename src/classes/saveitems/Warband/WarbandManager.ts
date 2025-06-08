import { SiteUser } from '../../user_synod/site_user';
import { WarbandFactory } from '../../../factories/warband/WarbandFactory';
import { IWarbandContextItem } from './High_Level/WarbandContextItem';
import { UserWarband, IUserWarband } from './UserWarband';

export interface ISumWarband {
    id : number // -1 means LOCAL warband
    warband_data : IUserWarband
}

export interface SumWarband {
    id : number // -1 means LOCAL warband
    warband_data : UserWarband
}

class WarbandManager {
    public WarbandItemList: SumWarband[] = []; 
    public UserProfile : SiteUser | null = null;

    public async GetItemsAll() {
        this.WarbandItemList = await this.GrabItems();
    }
    
    /**
     * @param _name The name of the item to find
     * @returns The first instance of a item with that name
     */
    public GetItemByName(_name : string) {
        let i = 0;
        for (i=0; i < this.WarbandItemList.length ; i++) {
            try {
                const nameval = this.WarbandItemList[i].warband_data.Name 
                if ((nameval != undefined? nameval : "" ).trim() == _name) {
                    return this.WarbandItemList[i]
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
        for (i=0; i < this.WarbandItemList.length ; i++) {
            try {
                const nameval = this.WarbandItemList[i].warband_data.ID 
                if ((nameval != undefined? nameval : "" ).trim() == _id) {
                    return this.WarbandItemList[i]
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
        const _list: ISumWarband[] = []
        for (let i = 0; i < this.WarbandItemList.length; i++) {
            try {
                _list.push(
                    {   
                        id: -1,
                        warband_data: this.WarbandItemList[i].warband_data.ConvertToInterface()
                    })
            } catch (e) {
                console.log("Conversion Failed")
            }
        }
        localStorage.setItem('userwarbanditem', JSON.stringify(_list));
    }

    /**
     * Attempts to convert a given file into an
     * object, returning a message if something went wrong in
     * the conversion process.
     * @param _content The string representation of the File
     * @returns String message, "" means nothing unusual has
     * occured, non empty strings indicate an error.
     */
    public FileToContentPack(_content : string) {
        let ReturnMsg = "";
        try {
            ReturnMsg = this.ValidateFileData(_content) 
            if (ReturnMsg == "") {
                const ContentNew: UserWarband = new UserWarband(JSON.parse(_content) as IUserWarband);
                this.WarbandItemList.push(
                    {
                        id: -1,
                        warband_data: ContentNew
                    });
                this.SetStorage();
            } else {
                return ReturnMsg;
            }
        } catch (e) {
            ReturnMsg = "File was not in the Item Sheet format.";
        }

        return ReturnMsg;
    }

    /**
     * Checks if the provided information can convert into
     * a JSON format and that the minimum structure of an item
     * is provided.
     * @param _content The string representation of the File
     * @returns String message, "" means nothing unusual has
     * occured, non empty strings indicate an error.
     */
    private ValidateFileData(_content : string) {
        const TestPack = (JSON.parse(_content))
        let i = 0;

        // Check that no Content Pack shares the same ID
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (this.WarbandItemList[i].warband_data.ID == TestPack.id) {
                return "You already have a Item Sheet with the same ID";
            }
        }

        return ""
    }

    /**
     * Getter for the Content Packs
     * @returns All Content Packs
     */
    public GetPack() {
        return this.WarbandItemList;
    }

    /**
     * Remove a Content Pack from the manager and
     * update the stored information to match.
     * @param _pack The Content Pack to remove from the manager
     */
    public DeletePack(_pack : UserWarband) {
        let i = 0;
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (_pack == this.WarbandItemList[i].warband_data) {
                this.WarbandItemList.splice(i, 1);
                break;
            }
        }
        
        this.SetStorage();
    }

    public TstClearStorag() {
        this.WarbandItemList = [];
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
        this.WarbandItemList.push(
            {
                id: -1,
                warband_data: new_item
            })
        this.SetStorage();

        return new_item;
    }

    /**
     * Recreates a copy of the item as a new item.
     */
    public async DuplicateItem(_Item : UserWarband) {  
        const NewMember : UserWarband = await WarbandFactory.CreateUserWarband((_Item.ConvertToInterface()));
        NewMember.Name = _Item.Name + " - Copy"
        NewMember.ID = this.CalcID(NewMember.Name);
        
        this.WarbandItemList.push(
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
        for (i = 0; i < this.WarbandItemList.length; i++) {
            if (_pack == this.WarbandItemList[i].warband_data) {
                break;
            }
        }

        if ((i == 0 && direction == true) || (i == this.WarbandItemList.length - 1 && direction == false)) {return;}

        const new_i = i + (direction? -1 : 1);

        const MemberArray = this.WarbandItemList.slice();
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