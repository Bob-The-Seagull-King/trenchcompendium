import { useNavigate } from 'react-router-dom';
import { SumWarband, WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import React, { useState } from 'react';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import { Faction } from '../../../classes/feature/faction/Faction';
import SynodFactionImage from "../../../utility/SynodFactionImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCircleNotch, faPlus} from "@fortawesome/free-solid-svg-icons";

const WbbCreateNewDetailsForm: React.FC<{
    chosenfaction : Faction
    onBack: () => void;
    manager: WarbandManager;
}> = ({ chosenfaction, onBack, manager }) => {
    const navigate = useNavigate();

    const [warbandName, setWarbandName] = useState('');
    const [isLoading, setisLoading] = useState(false)

    async function handleSubmit() {
        const msg : null | SumWarband = await manager.NewItem(warbandName, chosenfaction.ID, {
            id : "null",
            value_ducat: 0,
            value_glory: 0
        })

        if (msg == null) {
            alert("Warband creation was unsuccessful");
        } else {
            navigate('/warband/edit/' + msg.id);
        }
    }

    return (
        <div className={'WbbCreateNewDetailsForm'}>
            <div className={'row'}>
                <div className={'col-12 col-xl-5'}>
                    <form className={'warband-options-wrap'}
                          onSubmit={(e) => {
                              e.preventDefault();
                              setisLoading(true);

                              if( !isLoading ) {
                                  handleSubmit();
                              }
                          }}
                    >
                        <h2 className={'mb-3'}>{chosenfaction.Name}</h2>
                        <label className="form-label">Warband Name</label>
                        <input
                            className="form-control mb-3" type={"text"}
                            value={warbandName}
                            onChange={(e) => setWarbandName(e.target.value)}
                            placeholder={'Your awesome warband name'}
                        />

                        <p><small>
                            {'You can change the name of your warband at any time.'}
                        </small>
                        </p>

                        <button
                                className="btn btn-primary"
                                disabled={warbandName.trim() === '' || isLoading }
                        >
                            { isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left-l fa-spin'}/>
                                    {'Creating Warband'}
                                </>
                            ):(
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