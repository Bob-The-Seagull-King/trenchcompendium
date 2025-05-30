/**
 * A Static page for contact options
 */


import React from 'react'

const StaticContact: React.FC = () => {
    return (
        <div className="StaticContact page-static">
            <div className={'container'}>
                <h1>Contact</h1>

                <div className={'row'}>

                    <div className={'rules-scenario-summary rules-card col-12 col-sm-6 col-xs-6'}>
                        <div className={'rules-scenario-summary-title rules-card-title'}>
                            Support
                        </div>
                                    
                        <div className={'rules-scenario-summary-content rules-card-content'}>
                            <table className={'rules-scenario-summary-table rules-card-table'}>
                                <tbody>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Email"}
                                        </td>
                                        <td>
                                            {"Answer"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Phone"}
                                        </td>
                                        <td>
                                            {"Answer2"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className={"ContactFormSupport"}>

                            </div>
                        </div>
                    </div>

                    <div className={'RulesScenarioSummary rules-scenario-summary rules-card col-12 col-sm-6 col-xs-6'}>
                        <div className={'rules-scenario-summary-title rules-card-title'}>
                            Business Inquiries
                        </div>
                                    
                        <div className={'rules-scenario-summary-content rules-card-content'}>
                            <table className={'rules-scenario-summary-table rules-card-table'}>
                                <tbody>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Email"}
                                        </td>
                                        <td>
                                            {"Answer"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Phone"}
                                        </td>
                                        <td>
                                            {"Answer2"}
                                        </td>
                                    </tr>
                                </tbody>
                                <div className={"ContactFormBusiness"}>

                                </div>
                            </table>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default StaticContact