import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { StaticContextObject } from '../../classes/contextevent/staticcontextobject'

class KeywordFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateKeyword(_rule: IKeyword, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('keyword', _rule.id))
        if (isValid == false) {
            return cache.KeywordCache[_rule.id];
        }
        const rule = new Keyword(_rule, parent)
        cache.AddToCache('keyword', rule);
        return rule;
    }

    static CreateNewKeyword(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('keyword', _val))
        if (isValid == false) {
            return cache.KeywordCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "keyword", id: _val}}) as IKeyword
        const rulenew = KeywordFactory.CreateKeyword(ruledata, parent)
        return rulenew;
    }

}

export {KeywordFactory}