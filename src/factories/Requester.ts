import { ContentPack } from '../classes/contentpacks/contentpack';
import {DataResponder} from '../resources/data/util/DataResponder'

/**
 * Format for a given request to send to the icon-data repo
 */
interface IRequest {
    searchtype: string, // Used to decide which request to make
    searchparam: any // The data of the givn request
}

class Requester {

    public static GetLanguage() {
        const language = localStorage.getItem('language');
        if (language != null) {
            return language
        } else {
            return 'ln_english'
        }
    }

    /**
     * Send a request to a DataResponder and returns the result
     * @param request The IRequest being sent to the Requester
     * @returns The data returned by the icon-data repo in response to the request
     */
    public static MakeRequest(request: IRequest) {
        request.searchparam.data = GetContentPackData(request)
        const lan = Requester.GetLanguage();
        try {
            return DataResponder.GetResponse(request.searchparam, request.searchtype, lan)
        } catch (e) {
            return []
        }
    }

}

export {Requester, IRequest}

/**
 * Adds data from content packs to be given to the Data searcher
 * @param request The request to add data to
 * @returns The requets with additional data from content packs
 */
function GetContentPackData(request: IRequest): any {
    const BonusData = [];

    let ReturnData: ContentPack[] = [];  
    const data = localStorage.getItem('contentpackstorage_sitename');  
    try {
        ReturnData = JSON.parse(data || "");
    } catch (e) {
        undefined;
    }
    
    let i = 0;
    for (i = 0; i < ReturnData.length; i++) {
        if (ReturnData[i].IsActive) {
            let j = 0;
            for (j = 0; j < ReturnData[i].Files.length; j++) {
                if (ReturnData[i].Files[j].type == request.searchparam.type) {
                    let k = 0;
                    for (k = 0; k < ReturnData[i].Files[j].data.length; k++) {
                        BonusData.push(ReturnData[i].Files[j].data[k]);
                    }
                }
            }
        }
    }

    return BonusData
}
