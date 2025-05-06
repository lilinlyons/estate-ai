import React from "react";
import { useDropzone } from "react-dropzone";

interface Props {
    onFileSelect: (file: File) => void;
    fileName?: string;
}

export const FileUploader: React.FC<Props> = ({ onFileSelect, fileName }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        },
        multiple: false,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        }
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded cursor-pointer text-center transition ${
                    isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the file here ...</p>
                ) : (
                    <p>Drag & drop a survey file here, or click to browse</p>
                )}
            </div>

            {fileName && (
                <p className="text-sm text-gray-600 mt-2">📄 Selected file: {fileName}</p>
            )}
        </div>
    );
};
