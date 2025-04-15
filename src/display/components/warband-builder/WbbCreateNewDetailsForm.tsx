import React, { useState } from 'react';

const WbbCreateNewDetailsForm: React.FC<{
    factionId: string;
    factionName: string | null;
    onBack: () => void;
}> = ({ factionId, onBack, factionName }) => {

    const [warbandName, setWarbandName] = useState('');
    const [ducatsLimit, setducatsLimit] = useState('');
    const [gloryLimit, setgloryLimit] = useState('');

    const handleSubmit = () => {
        //@TODO handle backend request here
        alert(`Creating warband "${warbandName}" for ${factionName} as faction_id ${factionId}`);
    };

    return (
        <div className={'WbbCreateNewDetailsForm'}>
            <h3 className={'mb-3'}>Faction: {factionName}</h3>

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
                        onChange={(e) => setducatsLimit(e.target.value)}
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
                        onChange={(e) => setgloryLimit(e.target.value)}
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