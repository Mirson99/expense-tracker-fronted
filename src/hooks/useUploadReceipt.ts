import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl, uploadReceiptToS3, processReceipt } from "../api/receipt";
import toast from "react-hot-toast";

interface UploadReceiptParams {
    file: File;
}

export const useUploadReceipt = () => {
    return useMutation({
        mutationFn: async ({ file }: UploadReceiptParams) => {
            const { preSignedUrl, objectKey } = await getPresignedUrl(file.name, file.type);
            await uploadReceiptToS3(preSignedUrl, file);
            await processReceipt(objectKey);
        },
        onSuccess: () => {
            toast.success("Receipt uploaded successfully");
        },
        onError: () => {
            toast.error("Failed to upload receipt");
        },
    });
};
