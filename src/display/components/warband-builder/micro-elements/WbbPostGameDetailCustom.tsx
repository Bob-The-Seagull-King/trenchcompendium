import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";



const WbbPostGameDetailCustom: React.FC = () => {
    const { warband } = useWarband();

    if (!warband) return <div>Loading...</div>;

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode();

    const [showCustom, setShowCustom] = useState(false);
    const [additionalDucats, setAdditionalDucats] = useState<number>(0);
    const [customGlory, setCustomGlory] = useState<number>(0);

    const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="WbbPostGameDetailCustom WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {"Add Custom Values"}
            </div>

            <p>
                {
                    "You can add additional ducats and glory to your warband to facilitate for any homebrew rules your campaign might have. This is not part of the default campaign rules."
                }
            </p>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="toggle-custom-values"
                    checked={showCustom}
                    onChange={(e) => setShowCustom(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="toggle-custom-values">
                    Add additional custom values
                </label>
            </div>

            {showCustom && (
                <div className="row g-3">
                    <div className="col-12 col-sm-6">
                        <label htmlFor="additional-ducats" className="form-label fw-bold">
                            Additional Ducats
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="additional-ducats"
                            min={0}
                            step={1}
                            value={additionalDucats}
                            onChange={(e) => setAdditionalDucats(Number(e.target.value))}
                            onFocus={handleFocusSelectAll}
                        />
                    </div>

                    <div className="col-12 col-sm-6">
                        <label htmlFor="custom-glory" className="form-label fw-bold">
                            Custom Glory Points
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="custom-glory"
                            min={0}
                            step={1}
                            value={customGlory}
                            onChange={(e) => setCustomGlory(Number(e.target.value))}
                            onFocus={handleFocusSelectAll}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WbbPostGameDetailCustom;