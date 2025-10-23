import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import SynodFactionImage from "../../utility/SynodFactionImage";
import SynodImage from "../../utility/SynodImage";
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";
import {ROUTES} from "../../resources/routes-constants";
import {SYNOD} from "../../resources/api-constants";

const CampaignSetup: React.FC = () => {

    const navigate = useNavigate();

    const [isLoading, setisloading] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");

    const handleCreateCampaign = async () => {

        setisloading(true);
        if (!campaignName?.trim()) {
            alert("Please enter a campaign name.");
            return;
        }

        const url = SYNOD.URL + "/wp-json/synod/v1/campaigns/create";
        // TODO: Replace with API call to /campaigns/create

        const token = localStorage.getItem('jwtToken')
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const payload: any = {
            title: campaignName.trim(),
        };
        if (campaignDescription?.trim()) {
            payload.description = campaignDescription.trim();
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            // Expect WP Error format
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const msg =
                    data?.message ||
                    `HTTP ${res.status} ${res.statusText}`;
                throw new Error(msg);
            }

            const newCampaignId =
                data?.campaign_id ?? data?.id ?? data?.post_id;

            if (newCampaignId) {
                navigate(`${ROUTES.CAMPAIGN}${newCampaignId}`);
            } else {
                alert("Campaign created but unable to find it. Please reload the page");
            }
        } catch (err: any) {
            console.error("Error creating campaign:", err);
            alert(`Campaign could not be created:\n${err?.message ?? err}`);
        }
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
                                        {isLoading ? (
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleCreateCampaign}
                                                disabled={true}
                                            >
                                                <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'} />
                                                Creating Campaign
                                            </button>

                                        ):(
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleCreateCampaign}
                                                disabled={!campaignName.trim() || isLoading}
                                            >
                                                Create Campaign
                                            </button>
                                        )}
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