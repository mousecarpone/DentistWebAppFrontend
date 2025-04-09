import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import { getAllDocuments, uploadDocument } from "../api";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
        const data = await getAllDocuments();
        setDocuments(data);
        } catch (err) {
        console.error("Failed to fetch documents:", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !description) {
        alert("Please select a file and document type.");
        return;
        }

        const formData = new FormData();
        formData.append("description", description);
        formData.append("document_file", file);

        try {
        await uploadDocument(formData);
        setDescription("");
        setFile(null);
        fetchDocuments();
        } catch (err) {
        console.error("Upload failed:", err);
        alert("Upload failed. Make sure the file is a PDF under 5MB and you're logged in as a patient.");
        }
    };

    return (
        <div className="page-container">
        <Sidebar activePage="documents" />
        <div className="dashboard-content">
            <h1 className="page-title">My Documents</h1>

            <div className="dashboard-sections two-column">
            {/* Left Column - Upload Panel */}
            <div className="left-column">
                <div className="card upload-card">
                <h2>Upload a Document</h2>
                <form onSubmit={handleUpload}>
                    <select
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    >
                    <option value="">Select Document Type</option>
                    <option value="Patient Intake Form">Patient Intake Form</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Referral">Referral</option>
                    <option value="Consent Form">Consent Form</option>
                    <option value="Insurance Card">Insurance Card</option>
                    </select>

                    <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    />
                    <button type="submit" className="confirm-button">Upload</button>
                </form>
                </div>

                <div className="form-links">
                <a href="/forms/patient-intake.html" target="_blank" rel="noopener noreferrer">Patient Intake Form</a>
                <a href="/forms/medical-consent.html" target="_blank" rel="noopener noreferrer">Medical Consent Form</a>
                <a href="/forms/insurance-form.html" target="_blank" rel="noopener noreferrer">Insurance Form</a>
                </div>
            </div>

            {/* Right Column - Uploaded Documents */}
            <div className="right-column">
                {documents.length > 0 ? (
                documents.map((doc) => (
                    <div className="card" key={doc.id}>
                        <a
                        href={`http://127.0.0.1:8000${doc.document_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                    >
                        View Document
                    </a>
                    <p><strong>{doc.description}</strong>, Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</p>
                    </div>
                ))
                ) : (
                <p>No documents uploaded yet.</p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}

export default Documents;
