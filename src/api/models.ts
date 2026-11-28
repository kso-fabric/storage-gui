export interface Metadata {
    description?: string | null;
    tags?: string[];
    custom?: Record<string, unknown> | null;
}

export type ItemType = 'FILE' | 'DIRECTORY';

export interface StorageItem {
    id: string;
    name: string;
    type: ItemType;
    parentId?: string | null;
    size: number;
    contentType?: string;
    checksum?: string;
    createdAt: string;
    updatedAt: string;
    additionalData?: Metadata;
}

export type DirectoryMetadata = StorageItem;
export type FileMetadata = StorageItem;

export interface ItemListResponse {
    items: StorageItem[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface CreateDirectoryRequest {
    name: string;
    parentId?: string;
}