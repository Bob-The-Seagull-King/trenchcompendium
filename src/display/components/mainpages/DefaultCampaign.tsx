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
import PageMetaInformation from "../generics/PageMetaInformation";
import SynodImageSources from "../../../utility/SynodImageSources";

const DefaultCampaign = () => {
    
    const navigate = useNavigate();

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DefaultGame.tsx</div>}>
                    <div className={'rules-content-main'}>
                        <PageMetaInformation
                            title={'Campaign Rules v1.6.3'}
                            description={'Here you can find the campaign rules. When in doubt consult the official campaign rules pdf.'}
                        />

                        <h1>
                            {'Campaigns v1.6.3'}
                        </h1>
                        <p className={''}>
                            {'Here you can find the campaign rules. When in doubt consult the official campaign rules pdf.'}

                            <br/>
                            <br/>

                            <a href={'https://www.trenchcrusade.com/s/Trench-Crusade-Campaign-Rules-v163.pdf'}
                               rel={"noreferrer noopener nofollow"} target={'_blank'}
                            >
                                Official Campaign Rules PDF
                                <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>

                            </a>
                        </p>

                        <div className={'spacer-20'}></div>

                        <div className={'row '}>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2849}
                                    linkUrl={'/compendium/campaign/campaign_rules'}
                                    linkText={'Campaign Rules'}
                                />
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2852}
                                    linkUrl={'/compendium/campaign/patron'}
                                    linkText={'Patrons'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2848}
                                    linkUrl={'/compendium/campaign/explorationtable'}
                                    linkText={'Exploration'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2850}
                                    linkUrl={'/compendium/campaign/skills'}
                                    linkText={'Skills'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2851}
                                    linkUrl={'/compendium/campaign/injury'}
                                    linkText={'Injuries'}
                                />
                            </div>
                        </div>

                    </div>
                </ErrorBoundary>
            )
};

export default DefaultCampaign;
