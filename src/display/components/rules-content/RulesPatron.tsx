import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { Patron } from '../../../classes/feature/skillgroup/Patron';
import RulesPatronDetails from "./RulesPatronDetails";

const RulesPatron = (props: any) => {
    const patronObject : Patron = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='RulesPatron rules-patron-display rules-card'>
                <div className={'rules-patron-display-title rules-card-title'}>
                    {patronObject.Name}
                </div>

                <div className={'rules-patron-display-content rules-card-content'}>
                    <p className={'rules-patron-display-description'}>
                        {returnDescription(patronObject, patronObject.Description)}
                    </p>

                    <p className={'rules-patron-display-availability'}>
                        <strong>{"Available To: "}</strong>

                        {patronObject.Factions.map((item) => (
                            <span key={item.Name} className={'faction-name'}>
                                {/* @TODO: add links or hovers to the faction names */}
                                {
                                    ((patronObject.Factions.indexOf(item) != 0) ? ", " : "") + item.Name
                                }
                            </span>
                        ))}
                    </p>
                    <table className={'rules-patron-display-table rules-card-table'}>
                        <tbody>
                        {patronObject.Skills.map((item) => (
                            <tr key={item.ID}>
                                <td className={'label-cell'}>
                                    {item.Name}
                                </td>
                                <td>
                                    <RulesPatronDetails data={item}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesPatron;