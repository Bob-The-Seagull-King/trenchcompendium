import React from 'react'
import { Offcanvas } from 'react-bootstrap'
import {ROUTES} from "../../../resources/routes-constants";
import {QRCodeSVG} from "qrcode.react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faShareNodes} from "@fortawesome/free-solid-svg-icons";

interface ProfileShareDrawerProps {
    userId: number
    show: boolean
    onClose: () => void
}

const ProfileShareDrawer: React.FC<ProfileShareDrawerProps> = ({ userId, show, onClose }) => {

    const handleNativeShare = () => {
        const shareUrl = ROUTES.MAIN + '/profile/' + userId ;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Check out my Trench Companion profile!',
                    text: "Let's play connect and play together",
                    url: shareUrl,
                })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.log('Error sharing', error))
        } else {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    alert('Link copied to clipboard!')
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err)
                })
        }
    }


    return (
        <Offcanvas
            show={show}
            onHide={onClose}
            placement="bottom"
            className={'ProfileShareDrawer'}
        >
            <Offcanvas.Header>
                <Offcanvas.Title>
                    {'Share Profile'}
                    <div className="offcanvas-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faClose} className=""/>
                    </div>
                </Offcanvas.Title>


            </Offcanvas.Header>
            <Offcanvas.Body>
                <p>
                    {'Let your friend scan this QR code to view your profile.'}
                </p>
                <div className={'qr-code-wrap'}>
                    <QRCodeSVG
                        value={ROUTES.MAIN + '/profile/' + userId }
                        size={280}

                    />
                </div>

                <div className={'mt-3 mb-3 align-center'}>
                    <div className={'btn btn-primary'}
                         onClick={handleNativeShare}
                    >
                        {'Share Profile'}
                        <FontAwesomeIcon icon={faShareNodes} className="icon-inline-right"/>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default ProfileShareDrawer
