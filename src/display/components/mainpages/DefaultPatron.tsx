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
import { Faction } from '../../../classes/feature/faction/Faction';


interface RulesArmouryElement {
    item : CollectionsListPage
}

const DefaultPatron: React.FC<RulesArmouryElement> = ({ item }) => {
    
    const navigate = useNavigate();

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {"Patrons"}
                    </h1>

                    <p>
                        {'These are the official Trench Crusade Patron. You can select one from the list below or use the official PDF.'}

                        <br/> <br/>
                        <a href={'https://www.trenchcrusade.com/s/Trench-Crusade-Campaign-Rules-v163.pdf'}
                           rel={"noreferrer noopener nofollow"} target={'_blank'}
                        >
                            Official Campaign Rules PDF
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>

                        </a>
                    </p>

                    <div className={'spacer-20'}></div>

                    <h2>Patrons Table</h2>

                    <table className={'table_headed table_headed-highlight'}>
                        <thead>
                            <tr>
                                <th>Patron</th>
                                <th>Available to</th>
                            </tr>
                        </thead>

                        <tbody>
                        {/* @TODO: use navigate*/}
                        {item.Collection.itemcollection.map((patron : any) => (
                            <tr key={patron.HeldItem.ID}>
                                <td className={'font-normal'}>
                                    <CustomNavLink
                                        classes={'font-normal'}
                                        link={'/compendium/patron/'+patron.HeldItem.ID}
                                        runfunc={() => {
                                            navigate('/compendium/patron/'+patron.HeldItem.ID)
                                        }}>
                                        {patron.HeldItem.Name}
                                    </CustomNavLink>
                                </td>
                                <td>
                                    {(patron.HeldItem).Factions.map((item : Faction) => (
                                        <span key={item.ID}>{item.Name + ", "}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                
                </ErrorBoundary>
            )
};

export default DefaultPatron;
