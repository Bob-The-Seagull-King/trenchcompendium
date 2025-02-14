import { TableBody } from "../feature/table/tablebody";
import { CompendiumItem } from "../CompendiumItem";
import { GlossaryRule } from "../feature/glossary/Glossary"
import { Keyword } from "../feature/glossary/Keyword";

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

    public CheckID(cachename : string, id_val : string) {
        switch (cachename) {
            case 'glossary': 
                return (this.GlossaryCache[id_val] == null)
            case 'table': 
                return (this.TableCache[id_val] == null)
            case 'keyword': 
                return (this.KeywordCache[id_val] == null)
            default: return false;
        }
    }

    public AddToCache(cachename : string, obj : CompendiumItem) {
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