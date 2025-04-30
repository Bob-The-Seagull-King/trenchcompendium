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

    async function handleSubmit() {
        const msg : null | UserWarband = await manager.NewItem(warbandName, chosenfaction.ID, {
            id : "null",
            limit_ducat: 0,
            limit_glory: 0,
            limit_model: 0,
            value_ducat: 0,
            value_glory: 0
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


            <div className="bottom-actions">
                <button onClick={onBack} className="btn btn-secondary">Back</button>
                <button onClick={handleSubmit} className="btn btn-primary">Create Warband</button>
            </div>
        </div>
    );
};

export default WbbCreateNewDetailsForm;