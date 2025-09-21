// WbbSelectItem.tsx
import React from "react";
import {Equipment} from "../../../../classes/feature/equipment/Equipment";
import WbbEquipmentDetails from "./WbbEquipmentDetails";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import AlertCustom from "../../generics/AlertCustom";

export interface WbbSelectItemEquipmentProps {
    id: string; // element ID used for selection
    title: string; // name of the item
    opened: boolean; // opened details?

    available: boolean; // item available?

    onClick: (id: string) => void; // behaviour on click

    /** Optional props for right-hand info */
    cost?: string; // Full cost string
    limit?: string; // full limit string
    restrictions?: string[]; // // array of restriction strings

    /** Details, actions and hints  */
    equipment?: Equipment; // equipment data

    isSubmitting?: boolean; // is this form currently submitting?
    onSubmit: () => void; // submit function
    submitBtnString?: string // String of the main submit button

    unavailableString?: string; // why is this item not available
}

function WbbSelectItemEquipment({
       id,
       title,
       opened,
       available,
       onClick,
       cost,
       limit,
       restrictions,
       equipment,
       isSubmitting,
       onSubmit,
       submitBtnString,
       unavailableString
   }: WbbSelectItemEquipmentProps) {

    
    return (
        <React.Fragment>
            <div
                className={`select-item ${opened ? "selected" : ""} ${
                    available ? "" : "disabled"
                }`}
                onClick={() => onClick(id)}
            >
                <span className="item-left">
                    <span className="item-name">{title}</span>
                </span>

                <span className="item-right">
                    {cost && <span className="item-cost">{cost}</span>}

                    {limit && <span className="item-limit">{limit}</span>}

                    {restrictions && restrictions.length > 0 && (
                        <span className="item-limit">
                          Restrictions: {restrictions.join(", ")}
                        </span>
                    )}
                </span>
            </div>

            {opened && (
                <div className="details-wrap">
                    {equipment && (
                        <WbbEquipmentDetails
                            equipment={equipment}
                            showType={false}
                        />
                    )}

                    <div className={'details-quick-action'}>
                        {available ? (
                            <Button variant="primary"
                                    onClick={onSubmit}
                                    disabled={isSubmitting}
                                    className={' mb-3 btn-sm w-100'}
                            >
                                {isSubmitting ? (
                                    <FontAwesomeIcon icon={faCircleNotch}
                                                     className={'icon-inline-left fa-spin '}/>
                                ) : (
                                    <FontAwesomeIcon icon={faPlus}
                                                     className={'icon-inline-left'}/>
                                )}
                                {submitBtnString ? (
                                    <>
                                        {submitBtnString}
                                    </>
                                ):(
                                    <>
                                        {'Select Equipment'}
                                    </>
                                )}
                            </Button>
                        ):(
                            // Equipment is not available
                            <AlertCustom
                                type={'danger'}
                                className={'mx-2 my-3'}
                            >
                                {unavailableString ? (
                                    <>
                                        {unavailableString}
                                    </>
                                ):(
                                    <>
                                        {'This option can not be selected'}
                                    </>
                                )}
                            </AlertCustom>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default WbbSelectItemEquipment;