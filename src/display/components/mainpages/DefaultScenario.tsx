import { CollectionsListPage } from '../../../classes/viewmodel/pages/CollectionListPage';
import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import RulesBannerFaction from '../rules-content/RulesBannerFaction';
import { FactionCollection } from '../../../classes/feature/faction/FactionCollection';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';
import PageMetaInformation from "../generics/PageMetaInformation";


interface RulesArmouryElement {
    item : CollectionsListPage
}

const DefaultScenario: React.FC<RulesArmouryElement> = ({ item }) => {
    
    const navigate = useNavigate();

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={"Trench Crusade Scenarios"}
                        description={'These are the official Trench Crusade Scenarios. You can select one from the list below or use the random scenario generator.'}
                    />

                    <h1>
                        {"Trench Crusade Scenarios"}
                    </h1>

                    <p>
                        {'These are the official Trench Crusade Scenarios. You can select one from the list below or use the random scenario generator.'}

                        <br/> <br/>
                        <a href={'/scenario/generator'}>
                            Scenario Generator
                            <FontAwesomeIcon icon={faChevronRight} className={'icon-inline-right'}/>
                        </a>
                    </p>

                    <div className={'spacer-20'}></div>

                    <h2>
                        {'Scenarios Table'}
                    </h2>

                    <table className={'table_headed table_headed-highlight'}>
                        <thead>
                            <tr>
                                <th>Scenario</th>
                                <th>Source</th>
                            </tr>
                        </thead>

                        <tbody>
                            {item.Collection.itemcollection.map((scenario : any) => (
                                <tr key={scenario.HeldItem.ID}>
                                    <td className={'font-normal'}>
                                        <CustomNavLink
                                            classes={'font-normal'}
                                            link={'/compendium/scenario/' + scenario.HeldItem.ID}
                                            runfunc={() => {
                                                navigate('/compendium/scenario/' + scenario.HeldItem.ID)
                                            }}>
                                            {scenario.HeldItem.Name}
                                        </CustomNavLink>
                                    </td>
                                    <td>
                                        {scenario.HeldItem.Source}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </ErrorBoundary>
            )
};

export default DefaultScenario;
