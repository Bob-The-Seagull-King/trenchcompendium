import { CollectionsListPage } from '../../../classes/viewmodel/pages/CollectionListPage';
import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import RulesBannerFaction from '../rules-content/RulesBannerFaction';
import { FactionCollection } from '../../../classes/feature/faction/FactionCollection';
import { ErrorBoundary } from 'react-error-boundary';


interface RulesArmouryElement {
    item : CollectionsListPage
}

const DefaultFactions: React.FC<RulesArmouryElement> = ({ item }) => {

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1 className="">
                        {'Factions'}
                    </h1>

                    <p>
                        {'Each warband in Trench Crusade belongs to a faction fighting in the Great War. Use the faction lists that follow to recruit and equip your warband. These lists provide information about the troop types available, their weapons, armour and equipment options, as well as special rules specific to that faction.'}
                    </p>


                    <div className={'spacer-20'}></div>

                    <div className={'rules-faction-masonry'}>
                        {item.Collection.itemcollection.map(item => {
                            return (
                                <RulesBannerFaction
                                    key={item.HeldItem.GetBaseFac().ID}
                                    slug={item.HeldItem.GetBaseFac().ID}
                                    title={item.HeldItem.GetBaseFac().Name}
                                >
                                    {(item.HeldItem as FactionCollection).SubModelsList.filter((item : any) => (item.var_name != 'base')).map(sub_item => (
                                        <RulesBannerFaction
                                            key={sub_item.faction.ID}
                                            slug={sub_item.faction.ID}
                                            parentSlug={item.HeldItem.GetBaseFac().ID}
                                            title={sub_item.faction.Name? sub_item.faction.Name : ""}
                                        />
                                    ))}
                                </RulesBannerFaction>
                            )
                        })}
                    </div>
                </ErrorBoundary>
            )
};

export default DefaultFactions;
