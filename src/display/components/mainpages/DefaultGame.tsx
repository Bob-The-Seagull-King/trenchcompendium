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
import RulesBannerImage from '../rules-content/RulesBannerImage';

const DefaultGame = () => {
    
    const navigate = useNavigate();

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DefaultGame.tsx</div>}>
                    <>
                        <h1>
                            {'Playtest Rules v1.6'}
                        </h1>

                        <div className={'spacer-20'}></div>

                        <div className={'row '}>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={164}
                                    linkUrl={'/compendium/game/rules/gr_introduction'}
                                    linkText={'Game Rules'}
                                />
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={162}
                                    linkUrl={'/compendium/game/keyword'}
                                    linkText={'Keywords'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={166}
                                    linkUrl={'/compendium/game/model'}
                                    linkText={'Units & Models'}
                                />
                            </div>
                        </div>
                    </>            
                </ErrorBoundary>
            )
};

export default DefaultGame;
