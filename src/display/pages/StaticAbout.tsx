/**
 * A Static page for contact options
 */


import React from 'react'
import imageroadmap from '../../resources/images/Roadmap.png'

const StaticAbout: React.FC = () => {
    return (
        <div className="StaticContact page-static">
            <div className={'container'}>
                <h1>About the Trench Companion</h1>

                <div className={'RulesScenarioSummary rules-scenario-summary rules-card'}>
                    <div className={'rules-scenario-summary-title rules-card-title'}>
                        What Is This?
                    </div>
                                
                    <div className={'rules-scenario-summary-content rules-card-content'}>
                        <p>
                            {"TEST TEXT"}
                        </p>
                        <hr/>
                        <p>
                            {"TEST TEXT"}
                        </p>
                        
                        <table className={'rules-scenario-summary-table rules-card-table'}>
                            <tbody>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"Question"}
                                    </td>
                                    <td>
                                        {"Answer"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={'RulesScenarioSummary rules-scenario-summary rules-card'}>
                    <div className={'rules-scenario-summary-title rules-card-title'}>
                        Future Plans
                    </div>

                    <div className={'rules-scenario-summary-content rules-card-content'}>
                        <p> 
                            <img src={imageroadmap}
                                alt="Trench Companion Roadmap"
                                className={'rules-banner-image-element'}
                                style={{width:"100%"}}
                            />
                        </p> 
                        <table className={'rules-scenario-summary-table rules-card-table'}>
                            <tbody>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"Update"}
                                    </td>
                                    <td>
                                        {"desc"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={'label-cell'}>
                                        {"Update2"}
                                    </td>
                                    <td>
                                        {"desc2"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaticAbout