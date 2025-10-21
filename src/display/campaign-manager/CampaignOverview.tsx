import React, {useState} from 'react';
import {CampaignProvider} from "../../context/CampaignContext";
import WarbandListEntry from "../components/Profile/WarbandListEntry";
import CMCampaignListItem from "./components/CMCampaignListItem";
import {Campaign} from "../../classes/saveitems/Campaign/Campaign";
import {useAuth} from "../../utility/AuthContext";
import {PopoverProvider} from "../../context/PopoverContext";
import CampaignManagerContent from "./CampaignManagerContent";
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons";
import AlertCustom from "../components/generics/AlertCustom";
import {ROUTES} from "../../resources/routes-constants";

const CampaignOverview: React.FC = () => {

    const { isLoggedIn, login, SiteUser } = useAuth()

    const campaignIds = SiteUser?.GetCampaignIDList() ?? [];
    console.log(SiteUser);

    const navigate = useNavigate();

    return (
        <div className="CampaignOverview">
            <div className={'container'}>
                <h1 className="">{'Your Campaigns'}</h1>

                { isLoggedIn ? (

                    <div className={'row'}>
                        {campaignIds.map((id) => (
                            <CampaignProvider campaignId={id} key={id}>
                                <PopoverProvider>
                                    <CMCampaignListItem />
                                </PopoverProvider>
                            </CampaignProvider>
                        ))}

                        <div className={'col'}>
                            <CustomNavLink
                                classes={'CampaignOverview-new-link'}
                                link={`/campaigns/new`}
                                runfunc={() => {
                                    navigate(`${ROUTES.CAMPAIGN}new`, {state: Date.now().toString()})
                                }}>
                                <FontAwesomeIcon icon={faPlus} className={'icon-inline-left-l'}/>

                                {'Create new campaign '}
                            </CustomNavLink>
                        </div>
                    </div>
                ) : (
                    <AlertCustom
                        type={'info'}
                    >
                        <h3>{'Log in to join or create campaigns'}</h3>
                        <p>
                            {'You need to log in to use the campaigns feature.'}
                        </p>

                        <a href={'/login'} className={'btn btn-primary'}>
                            <FontAwesomeIcon
                                icon={faUser}
                                className="icon-inline-left-l"/>
                            {'Login'}
                        </a>
                    </AlertCustom>
                )}

            </div>
        </div>
    );
};

export default CampaignOverview;
