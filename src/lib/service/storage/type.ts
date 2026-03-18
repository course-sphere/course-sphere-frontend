export interface PresignedUrlRequest {
    contentType: string;
    fileName: string;
}

export interface PresignedUrlResponse {
    url: string;
    values: {
        'Content-Type': string;
        'X-Amz-Algorithm': string;
        'X-Amz-Credential': string;
        'X-Amz-Date': string;
        'X-Amz-Signature': string;
        acl: string;
        key: string;
        policy: string;
    };
}
