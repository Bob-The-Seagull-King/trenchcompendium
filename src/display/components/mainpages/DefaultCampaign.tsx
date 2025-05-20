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

const DefaultCampaign = () => {
    
    const navigate = useNavigate();

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DefaultGame.tsx</div>}>
                                    
                </ErrorBoundary>
            )
};

export default DefaultCampaign;
