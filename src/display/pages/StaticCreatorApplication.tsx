import React, { useState } from "react";
import { useAuth } from "../../utility/AuthContext";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {ROUTES} from "../../resources/routes-constants";

export const StaticCreatorApplication: React.FC = () => {
    const { SiteUser, authToken, userId } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        contactName: "",
        companyName: "",
        street: "",
        zip: "",
        city: "",
        state: "",
        companyUrl: "",
        mmfUrl: "",
        cultsUrl: "",
        cgtraderUrl: "",
        instagramUrl: "",
        facebookUrl: "",
        patreonUrl: ""
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setErrors(prev => ({ ...prev, [id]: false }));
    };

    const validate = () => {
        const requiredFields = ["contactName", "companyName", "street", "zip", "city", "state", "companyUrl"];
        const newErrors: { [key: string]: boolean } = {};

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]?.trim()) {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fill out all required fields.");
            return;
        }

        try {
            const response = await fetch("/wp-json/synod/v1/creator-application/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("API error");
            }

            setShowSuccessModal(true);
        } catch (err) {
            toast.error("Submission failed. Please try again later.");
            console.error(err);
        }
    };

    return (
        <div className="StaticCreatorApplication py-4">
            <div className={"container"}>
                <div className={"narrow-content"}>
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <h1>{'Apply for the Trench Companion creator program'}</h1>
                            <p>{'As a registered creator you will be able to promote your Trench Crusade STLs on our platform.'}</p>
                        </div>

                        <div className="col-12">
                            <form onSubmit={handleSubmit}>
                                {/* Contact Person */}
                                <div className="mb-3">
                                    <label htmlFor="contactName" className="form-label">{'Contact Person Name *'}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.contactName ? "is-invalid" : ""}`}
                                        id="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Company */}
                                <div className="mb-3">
                                    <label htmlFor="companyName" className="form-label">{'Company Name *'}</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Address */}
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label htmlFor="street" className="form-label">{'Street & Number *'}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.street ? "is-invalid" : ""}`}
                                            id="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="zip" className="form-label">{'Zip *'}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                                            id="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="city" className="form-label">{'City *'}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                            id="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="state" className="form-label">{'Country / State *'}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                            id="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Company URL */}
                                <div className="mb-3">
                                    <label htmlFor="companyUrl" className="form-label">{'Company Web URL *'}</label>
                                    <input
                                        type="url"
                                        className={`form-control ${errors.companyUrl ? "is-invalid" : ""}`}
                                        id="companyUrl"
                                        value={formData.companyUrl}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Optional URLs */}
                                {["mmfUrl", "cultsUrl", "cgtraderUrl", "instagramUrl", "facebookUrl", "patreonUrl"].map((field, i) => (
                                    <div className="mb-3" key={field}>
                                        <label htmlFor={field} className="form-label">{field}</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id={field}
                                            value={formData[field as keyof typeof formData]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}

                                {/* Submit */}
                                <div className="mt-4">
                                    <button type="submit" className="btn btn-primary">{'Submit Application'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>{'Application Received'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {'Your application has been received. We will check it and get back to you soon.'}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                            navigate(ROUTES.MAIN + '/profile/' + userId);
                            window.location.reload();
                        }}
                    >
                        {'Go to Profile'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StaticCreatorApplication;
