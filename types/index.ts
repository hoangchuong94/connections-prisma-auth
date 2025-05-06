export interface Profile {
    username: string;
    email: string;
    avatar: string;
}

export type UploadedImage = {
    url: string;
    thumbnailUrl: string | null;
    size: number;
    uploadedAt: Date;
    metadata: Record<string, never>;
    path: {
        type: string;
    };
    pathOrder: 'type'[];
};
