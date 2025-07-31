import { useNavigate } from 'react-router-dom';
import { SumWarband, WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import React, { useEffect, useState } from 'react';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import { Faction } from '../../../classes/feature/faction/Faction';
import SynodFactionImage from "../../../utility/SynodFactionImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCircleNotch, faPlus} from "@fortawesome/free-solid-svg-icons";
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';

const WbbCreateNewDetailsForm: React.FC<{
    chosenfaction : Faction
    onBack: () => void;
    manager: WarbandManager;
}> = ({ chosenfaction, onBack, manager }) => {
    const navigate = useNavigate();

    const [warbandName, setWarbandName] = useState('');
    const [warbandStartingDucats, setWarbandStartingDucats] = useState(700);
    const [warbandStartingGlory, setWarbandStartingGlory] = useState(0);
    const [isunrestricted, setIsUnrestricted] = useState(false);
    const [keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetStartingValues() {
            
            const eventmon : EventRunner = new EventRunner();
            const DucatCount = await eventmon.runEvent(
                "getStartingDucats",
                chosenfaction,
                [],
                700,
                null
            )
            const GloryCount = await eventmon.runEvent(
                "getStartingGlory",
                chosenfaction,
                [],
                0,
                null
            )
            setWarbandStartingDucats(DucatCount);
            setWarbandStartingGlory(GloryCount)
            setkeyvar(keyvar + 1);
        }
        SetStartingValues()
    }, [chosenfaction])

    const [isLoading, setisLoading] = useState(false)

    async function handleSubmit() {
        const msg : null | SumWarband = await manager.NewItem(warbandName, chosenfaction.ID, warbandStartingDucats, warbandStartingGlory, isunrestricted)

        if (msg == null) {
            alert("Warband creation was unsuccessful");
        } else {
            navigate('/warband/detail/' + msg.id);
        }
    }

    return (
        <div className={'WbbCreateNewDetailsForm'}>
            <div className={'row'}>
                <div className={'col-12 col-xl-5'} key={keyvar}>
                    <form className={'warband-options-wrap'}
                          onSubmit={(e) => {
                              e.preventDefault();
                              setisLoading(true);

                              if (!isLoading) {
                                  handleSubmit();
                              }
                          }}
                    >
                        <h2 className={'mb-3'}>{chosenfaction.Name}</h2>

                        <div className={'mb-3'}>
                            <label className="form-label">Warband Name</label>
                            <input
                                className="form-control" type={"text"}
                                value={warbandName}
                                onChange={(e) => setWarbandName(e.target.value)}
                                placeholder={'Your awesome warband name'}
                            />
                            <div className="form-text">
                                {'You can change the name of your warband at any time.'}
                            </div>
                        </div>

                        <div className={'mb-3'}>
                            <label className="form-label">Starting Ducats</label>
                            <input
                                className="form-control form-control-sm" type={"number"}
                                value={warbandStartingDucats}
                                onChange={(e) => setWarbandStartingDucats(parseInt(e.target.value))}
                                placeholder={'Unlimited'}
                            />
                        </div>

                        <div className={'mb-3'}>
                            <label className="form-label">Starting Glory</label>
                            <input
                                className="form-control form-control-sm" type={"number"}
                                value={warbandStartingGlory}
                                onChange={(e) => setWarbandStartingGlory(parseInt(e.target.value))}
                                placeholder={'Unlimited'}
                            />
                        </div>

                        <div className={'mb-3'}>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="removeRestrictions"
                                    checked={isunrestricted}
                                    onChange={(e) => setIsUnrestricted(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="removeRestrictions">
                                    {'Remove Restrictions'}
                                </label>
                            </div>
                            <div className="form-text">
                                {'If restrictions are removed, the builder will not check limitations on number, cost, available hands, and other rules on equipment and model selection.'}
                            </div>
                        </div>


                        <button
                            className="btn btn-primary"
                            disabled={warbandName.trim() === '' || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left-l fa-spin'}/>
                                    {'Creating Warband'}
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className={'icon-inline-left-l'}/>
                                    {'Create Warband'}
                                </>
                            )}

                        </button>
                    </form>
                </div>

                <div className={'col-12 col-xl-7'}>
                    <div className={'faction-image-wrap'}>

                        <SynodFactionImage
                            factionSlug={chosenfaction.ID}
                            size={'full'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WbbCreateNewDetailsForm;