// Import typescript classes
import { FilterText, FilterTag, FilterItem, FilterRange } from './FilterInterfaces'
import { FilterType, FitlerDataDex } from './FiltersStatic';

class FilterManager {
    
    TextOptions: FilterText[] = [];
    TagOptions: FilterTag[] = [];
    MiscOptions: FilterItem[] = [];
    RangeOptions: FilterRange[] = [];

    MyFilters : FilterType;

    constructor(type : Lowercase<string>) {
        this.MyFilters = FitlerDataDex[type]
        if (this.MyFilters.findMisc) {
            this.MiscOptions = this.MyFilters.findMisc();
        }
        if (this.MyFilters.findTags) {
            this.TagOptions = this.MyFilters.findTags();
        }
        if (this.MyFilters.findText) {
            this.TextOptions = this.MyFilters.findText();
        }
        if (this.MyFilters.findRange) {
            this.RangeOptions = this.MyFilters.findRange();
        }
    }

    /**
     * @returns Array of all text-type filters
     */
    ReturnTextFilters () { return this.TextOptions; }
    
    /**
     * @returns Array of all range-type filters
     */
    ReturnRangeFilters () { return this.RangeOptions; }

    /**
     * @returns Array of all tag-type filters
     */
    ReturnTagFilters() { return this.TagOptions; }

    /**
     * @returns Array of all misc filters
     */
    ReturnMiscFilters() { return this.MiscOptions; }

    /**
     * @returns Array of all currently active text-type filters
     */
    ReturnActiveTextFilters() { return this.TextOptions.filter((value) => value.Val.trim().length > 0); }

    /**
     * @returns Array of all currently active range-type filters
     */
    ReturnActiveRangeFilters() { return this.RangeOptions.filter((value) => ((value.Lower != value.Set_Lower) || (value.Upper != value.Set_Upper))); }

    /**
     * @returns Array of all currently active tag-type filters
     */
    ReturnActiveTagFilters() { return this.TagOptions.filter((value) => value.TagType.IsActive == true); }

    /**
     * @returns Array of all currently active misc filters
     */
    ReturnActiveMiscFilters() { return this.MiscOptions.filter((value) => value.IsActive == true);}

    /**
     * @returns Integer count of all the filters that currently exist
     */
    ReturnCount() { return this.ReturnMiscFilters.length + this.ReturnTagFilters.length + this.ReturnTextFilters.length + this.ReturnRangeFilters.length; }

    /**
     * @returns Integer count of all the filters that are currently active
     */
    ReturnActiveCount() { return this.ReturnActiveMiscFilters.length + this.ReturnActiveTagFilters.length + this.ReturnActiveTextFilters.length + this.ReturnActiveRangeFilters.length; }
}

export {FilterManager}