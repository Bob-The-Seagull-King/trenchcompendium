import { useNavigate } from 'react-router-dom';
import { WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import React, { useState } from 'react';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import { Faction } from '../../../classes/feature/faction/Faction';

const WbbCreateNewDetailsForm: React.FC<{
    chosenfaction : Faction
    onBack: () => void;
    manager: WarbandManager;
}> = ({ chosenfaction, onBack, manager }) => {
    const navigate = useNavigate();

    const [warbandName, setWarbandName] = useState('');
    const [ducatsLimit, setducatsLimit] = useState(0);
    const [gloryLimit, setgloryLimit] = useState(0);

    async function handleSubmit() {
        const msg : null | UserWarband = await manager.NewItem(warbandName, chosenfaction.ID, {
            id : "null",
            limit_ducat: ducatsLimit,
            limit_model: gloryLimit,
            value_ducat: ducatsLimit,
            value_glory: gloryLimit
        })
        if (msg == null) {
            alert("Warband creation was unsuccessful");
        } else {
            navigate('/warband/edit/' + msg.ID);
        }
    }

    return (
        <div className={'WbbCreateNewDetailsForm'}>
            <h3 className={'mb-3'}>Faction: {chosenfaction.Name}</h3>

            <p>
                {'Please enter your warbands details below. You can change these settings in the Warband Builder at any point.'}
            </p>

            <div className={'mb-3'}>
                <label className="form-label">Warband Name</label>

                <input
                    className="form-control" type={"text"}
                    value={warbandName}
                    onChange={(e) => setWarbandName(e.target.value)}
                    placeholder=""
                />
            </div>

            <div className={'mb-3'}>
                <label className="form-label">Ducats Limit</label>

                <div className={'input-group'}>
                    <input
                        className="form-control" type={"number"}
                        value={ducatsLimit}
                        onChange={(e) => setducatsLimit(parseInt( e.target.value))}
                        onFocus={(e) => e.target.select()}
                        placeholder=""
                    />
                    <span className="input-group-text">Ducats</span>
                </div>
            </div>

            <div className={'mb-3'}>
                <label className="form-label">Glory Limit</label>

                <div className={'input-group'}>
                    <input
                        className="form-control" type={"number"}
                        value={gloryLimit}
                        onChange={(e) => setgloryLimit(parseInt(e.target.value))}
                        onFocus={(e) => e.target.select()}
                        placeholder=""
                    />
                    <span className="input-group-text">Glory</span>
                </div>
            </div>


            <div className="bottom-actions">
                <button onClick={onBack} className="btn btn-secondary">Back</button>
                <button onClick={handleSubmit} className="btn btn-primary">Create Warband</button>
            </div>
        </div>
    );
};

export default WbbCreateNewDetailsForm;