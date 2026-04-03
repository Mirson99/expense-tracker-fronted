import { axiosClient } from "./axiosClient";

interface PresignedUrlResponse {
    preSignedUrl: string;
    objectKey: string;
}

export const getPresignedUrl = async (fileName: string, contentType: string): Promise<PresignedUrlResponse> => {
    const response = await axiosClient.get<PresignedUrlResponse>('/receipt/presigned-url', {
        params: { fileName, contentType }
    });
    return response.data;
};

export const uploadReceiptToS3 = async (preSignedUrl: string, file: File): Promise<void> => {
    await fetch(preSignedUrl, {
        method: 'PUT',
        body: file,
    });
};

export const processReceipt = async (storageKey: string): Promise<void> => {
    await axiosClient.post('/receipt/process', null, { params: { storageKey } });
};