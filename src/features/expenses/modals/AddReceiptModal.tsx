import { useState, useRef } from "react";
import { useUploadReceipt } from "../../../hooks/useUploadReceipt";
import { ButtonSpinner } from "../../../components/ui/ButtonSpinner";

interface AddReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddReceiptModal = ({ isOpen, onClose }: AddReceiptModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useUploadReceipt();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        handleRemoveFile();
        onClose();
    };

    const handleSend = () => {
        if (!selectedFile) return;
        mutate({ file: selectedFile }, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-xl font-bold text-white">Add Receipt</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors hover:cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Drop zone / file picker */}
                    {!preview ? (
                        <label
                            htmlFor="receipt-file"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl hover:border-teal-500/60 transition-colors cursor-pointer bg-gray-900/30"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-10 h-10 text-gray-500 mb-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                            <p className="text-sm text-gray-400">
                                Click to upload a receipt photo
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                JPG or PNG only
                            </p>
                            <input
                                id="receipt-file"
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Receipt preview"
                                className="w-full max-h-64 object-contain rounded-xl border border-gray-700"
                            />
                            <button
                                onClick={handleRemoveFile}
                                className="absolute top-2 right-2 bg-gray-900/80 hover:bg-rose-600 text-gray-300 hover:text-white rounded-full p-1.5 transition-colors hover:cursor-pointer"
                                title="Remove photo"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-xs text-gray-400 mt-2 truncate">
                                {selectedFile?.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-900/30">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleClose}
                        className="inline-flex justify-center rounded-md bg-gray-700/50 px-4 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-700 hover:text-white ring-1 ring-inset ring-gray-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selectedFile || isPending}
                        onClick={handleSend}
                        className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
                    >
                        {isPending ? (
                            <>
                                <ButtonSpinner />
                                Uploading...
                            </>
                        ) : (
                            'Send Receipt'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
