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

                    <div className={'rules-scenario-summary rules-card col-12'}>
                        <div className={'rules-scenario-summary-title rules-card-title'}>
                            Emails
                        </div>
                                    
                        <div className={'rules-scenario-summary-content rules-card-content'}>
                            <table className={'rules-scenario-summary-table rules-card-table'}>
                                <tbody>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Support"}
                                        </td>
                                        <td>
                                            {"support@trench-companion.com"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"Business"}
                                        </td>
                                        <td>
                                            {"info@trench-companion.com"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'label-cell'}>
                                            {"API"}
                                        </td>
                                        <td>
                                            {"synod@trench-companion.com"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={'rules-scenario-summary rules-card col-12'}>
                        <div className={'rules-scenario-summary-title rules-card-title'}>
                            Submit a Support Request
                        </div>
                                    
                        <div className={'ContactFormSupport rules-scenario-summary-content rules-card-content'}>
                            
                        </div>
                    </div>

                    <div className={'RulesScenarioSummary rules-scenario-summary rules-card col-12 col-sm-6 col-xs-6'}>
                        <div className={'rules-scenario-summary-title rules-card-title'}>
                            Submit a Business Inquiry
                        </div>
                                    
                        <div className={'ContactFormBusiness rules-scenario-summary-content rules-card-content'}>
                            
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default StaticContact