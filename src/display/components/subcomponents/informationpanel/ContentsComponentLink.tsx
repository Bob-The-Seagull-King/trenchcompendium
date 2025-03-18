import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

export interface ContentsLink {
    name: string,
    route: string
}

export interface ContentsCollection {
    listofcontents: ContentsLink[];
    showheader : boolean;
}

const ContentsComponentLink: React.FC<ContentsCollection> = (props: any) => {


    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome(route : string) {
        navigate('/compendium/' + route);
    }

    function ReturnItemLink(_obj : ContentsLink) {
        return (
            <div className="hovermouse" onClick={() => NavigateHome(_obj.route)}>
                {"- " + _obj.name}
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div>
            {props.showheader == false &&
                <div className="font-default bordergrey borderstyler backgroundBgCard">
                    <div className="totalmarginsml">
                        {props.listofcontents.map((item : ContentsLink) => 
                            <div key={item.route}>
                                {ReturnItemLink(item)}
                            </div>)}
                    </div>
                </div>
            }
            {props.showheader == true &&      
            <div className="bordergrey borderthin">     
                <GenericCollapsableBlockDisplay 
                    d_name={"Contents"} 
                    d_colour={"grey"} 
                    d_state={false}  
                    bordertype={0}
                    d_border={false}
                    d_col={"BgCard"}
                    d_margin={"sml"}
                    d_method={() => 
                    <div className="bordergrey borderthin">
                        <div className="totalmarginsml">
                        {props.listofcontents.map((item : ContentsLink) => 
                            <div key={item.route}>
                                {ReturnItemLink(item)}
                            </div>)}
                        </div>
                    </div>} 
                    />
                </div>
            }
            </div>
        </ErrorBoundary>
    )
}

export default ContentsComponentLink;