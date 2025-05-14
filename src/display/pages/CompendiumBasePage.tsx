import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import ViewTableItemDisplay from '../../display/components/subcomponents/list/ViewTableItemDisplay'
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import ContentsComponentLink, { ContentsLink } from '../components/subcomponents/informationpanel/ContentsComponentLink';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import RulesBannerImage from "../components/rules-content/RulesBannerImage";
import SynodImageSource from "../../utility/SynodImageSource";
import SynodImageSources from "../../utility/SynodImageSources";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumBasePage: React.FC<IControllerProp> = (prop: any) => {
    
    
    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with BaseDisplayCompendium.tsx</div>}>
            <div className={'rules-content-main'}>
                <h1 className="">
                    {"Compendium"}
                </h1>

                <p className={'mb-3'}>
                    {'Welcome to the Compendium. Here you can find all current rules for Trench Crusade including Game Rules, Campaign rules, Faction and glossaries for all the rules.'}
                </p>

                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <RulesBannerImage
                            imageId={164}
                            linkUrl={'/compendium/gamerule'}
                            linkText={'Game Rules'}
                        />
                    </div>

                    <div className={'col-12 col-md-6'}>
                        <RulesBannerImage
                            imageId={166}
                            linkUrl={'/compendium/faction'}
                            linkText={'Factions'}
                        />
                    </div>

                    <div className={'col-12 col-md-6'}>
                        <RulesBannerImage
                            imageId={165}
                            linkUrl={'/compendium/armoury'}
                            linkText={'Armoury'}
                        />
                    </div>

                    <div className={'col-12 col-md-6'}>
                        <RulesBannerImage
                            imageId={161}
                            linkUrl={'/compendium/scenario'}
                            linkText={'Scenarios'}
                        />
                    </div>

                    <div className={'col-12 col-md-6'}>
                        <RulesBannerImage
                            imageId={162}
                            linkUrl={'/compendium/campaignrule'}
                            linkText={'Campaign Rules'}
                        />
                    </div>
                </div>

                <div className={'row'}>
                    <div className={'col-12'}>
                        <SynodImageSources imageIds={[164, 166, 165, 161, 162]} />
                    </div>
                </div>

            </div>

        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumBasePage