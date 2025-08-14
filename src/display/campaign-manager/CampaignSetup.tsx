import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import SynodFactionImage from "../../utility/SynodFactionImage";
import SynodImage from "../../utility/SynodImage";
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";

const CampaignSetup: React.FC = () => {

    const navigate = useNavigate();

    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");

    const handleCreateCampaign = () => {
        // TODO: Replace with API call to /campaigns/create

        alert('TODO create campaign here');

        console.log("Creating campaign with data:", {
            title: campaignName,
            description: campaignDescription
        });

        // navigate after creation
        // navigate(`/campaigns/${newCampaignId}`);
    };

    return (
        <div className="CampaignSetup">
            <div className={'container'}>
                <div className={'headline-wrap'}>
                    <h1>
                        <CustomNavLink
                            classes={'headline-back-btn'}
                            link={`/campaigns/`}
                            runfunc={() => {
                                navigate(`/campaigns/`,
                                    {state: Date.now().toString()})
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className={''}/>
                        </CustomNavLink>

                        {'Campaign Setup'}
                    </h1>
                </div>

                <div className={'CampaignSetup-form-wrap'}>
                    <div className={'CampaignSetup-form'}>
                        <div className={'row'}>
                            <div className={'col-12 col-xl-6'}>
                                <form className={'CampaignSetup-options-wrap'}
                                      onSubmit={(e) => {
                                          e.preventDefault();
                                          handleCreateCampaign()
                                      }}
                                >
                                    <h2 className={'mb-3'}>
                                        {'Create your Campaign'}
                                    </h2>
                                    {/* Campaign name string */}
                                    <div className={'mb-3'}>
                                        <label className="form-label">Campaign Name</label>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            placeholder="Enter campaign name"
                                        />
                                    </div>

                                    {/* Campaign description string */}
                                    <div className={'mb-3'}>
                                        <label className="form-label">Campaign Description</label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            value={campaignDescription}
                                            onChange={(e) => setCampaignDescription(e.target.value)}
                                            placeholder="Enter campaign description"
                                            rows={4}
                                        />
                                    </div>

                                    {/* Create Campaign Button */}
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleCreateCampaign}
                                            disabled={!campaignName.trim()}
                                        >
                                            Create Campaign
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className={'col-12 col-xl-6'}>
                                <SynodImageWithCredit
                                    imageId={2841}
                                    className={''}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);
};

export default CampaignSetup;