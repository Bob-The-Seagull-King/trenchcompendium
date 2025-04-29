import React from 'react';
import { useWarband } from '../../../context/WarbandContext';
import { usePrintMode } from '../../../context/PrintModeContext';
import WbbPrintViewSimpleOverview from "./print-view/WbbPrintViewSimpleOverview";
import WbbPrintViewSimpleFighter from "./print-view/WbbPrintViewSimpleFighter";
import WbbEditViewFighter from "./WbbEditViewFighter";

const WbbPrintViewSimple: React.FC = () => {
    const { warband } = useWarband();
    const { printMode } = usePrintMode();

    if (!warband || !printMode) return null;

    const stash = warband.GetStash();
    const fighters = warband.GetFighters();

    return (
        <div className="WbbPrintViewSimple">
            <div className={'print-view-page-overview-wrap pbi-avoid'}>
                <WbbPrintViewSimpleOverview/>
            </div>

            {warband.HasElites() &&
                <div className={'print-view-page-elites-wrap pbi-avoid'}>
                    <h2 className={'page-headline'}>{'Elites'}</h2>
                    {warband.GetFighters().map((item, index) => (
                        <>
                            {item.IsElite &&
                                <WbbPrintViewSimpleFighter key={'print-elites' + index}
                                    fighter={item}
                                />
                            }
                        </>
                    ))}

                    {warband.GetFighters().map((item, index) => (
                        <>
                            {item.IsElite &&
                                <WbbPrintViewSimpleFighter key={'print-elites' + index}
                                                           fighter={item}
                                />
                            }
                        </>
                    ))}

                    {warband.GetFighters().map((item, index) => (
                        <>
                            {item.IsElite &&
                                <WbbPrintViewSimpleFighter key={'print-elites' + index}
                                                           fighter={item}
                                />
                            }
                        </>
                    ))}
                </div>
            }

            {warband.HasTroops() &&
                <div className={'print-view-troops-wrap pbi-avoid'}>
                    <h2 className={'page-headline'}>{'Troops'}</h2>

                    {warband.GetFighters().map((item, index) => (
                        <>
                            {(!item.IsElite && !item.IsMercenary) &&
                                <WbbPrintViewSimpleFighter
                                    key={'print-troop' + index}
                                    fighter={item}
                                />
                            }
                        </>
                    ))}
                </div>
            }

            {warband.HasMercenaries() &&
                <div className={'print-view-mercenaries-wrap pbi-avoid'}>
                    <h2 className={'page-headline'}>{'Mercenaries'}</h2>

                    {warband.GetFighters().map((item, index) => (
                        <>
                            {item.IsMercenary &&
                                <WbbPrintViewSimpleFighter
                                    key={'print-mercenary' + index}
                                    fighter={item}
                                />
                            }
                        </>
                    ))}
                </div>
            }


        </div>
    );
};

export default WbbPrintViewSimple;
