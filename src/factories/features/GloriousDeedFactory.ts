import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IRule, Rule } from '../../classes/feature/faction/Rule';
import { GloriousDeed, IGloriousDeed } from '../../classes/feature/scenario/GloriousDeed';

class GloriousDeedFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateGloriousDeed(_deed: IGloriousDeed, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('gloriousdeed', _deed.id))
        if (isValid == false) {
            return cache.GloriousDeedCache[_deed.id];
        }
        const deed = new GloriousDeed(_deed, parent)
        cache.AddToCache('gloriousdeed', deed);
        return deed;
    }

    static CreateNewGloriousDeed(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('gloriousdeed', _val))
        if (isValid == false) {
            return cache.GloriousDeedCache[_val];
        }
        const deeddata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "gloriousdeed", id: _val}}) as IGloriousDeed
        const deednew = GloriousDeedFactory.CreateGloriousDeed(deeddata, parent)
        return deednew;
    }

}

export {GloriousDeedFactory}