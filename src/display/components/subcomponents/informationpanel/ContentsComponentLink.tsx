import '../../../../resources/styles/vendor/bootstrap.css'
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
    title : string;
}

const ContentsComponentLink: React.FC<ContentsCollection> = (props: any) => {


    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome(route : string) {
        navigate('/compendium/' + route, {state: Date.now().toString()});
    }

    function ReturnItemLink(_obj : ContentsLink) {
        return (
            <div className="" onClick={() => NavigateHome(_obj.route)}>
                {"- " + _obj.name}
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div>
            {props.showheader == false &&
                <div className="  bordergrey borderstyler backgroundBgCard">
                    <div className="">
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
                    d_name={props.title} 
                    d_colour={"grey"} 
                    d_state={true}  
                    bordertype={0}
                    d_border={false}
                    d_col={"BgCard"}
                    d_margin={"sml"}
                    d_method={() => 
                    <div className="bordergrey borderthin">
                        <div className="">
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