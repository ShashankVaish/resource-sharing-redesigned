import React from "react";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const NewTabPdfViewer = ({ pdfFileUrl }) => {
    return (
        <div className="pdf-viewer">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfFileUrl} />
            </Worker>
        </div>
    );
};

export default NewTabPdfViewer;
