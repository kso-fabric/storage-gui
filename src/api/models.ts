
export interface Metadata {
    description?: string | null;
    tags?: string[];
    custom?: Record<string, unknown> | null;
}

export interface DirectoryMetadata {
    id: string;
    name: string;
    parentId?: string | null;
    createdAt: string;
    additionalData?: Metadata;
}

export interface FileMetadata {
    id: string;
    name: string;
    directoryId?: string | null;
    size: number;
    contentType?: string;
    checksum: string;
    createdAt: string;
    updatedAt?: string;
    additionalData?: Metadata;
}

export interface FileListResponse {
    files: FileMetadata[];
    total: number;
}

export interface DirectoryListResponse {
    directories: DirectoryMetadata[];
    total: number;
}

export interface CreateDirectoryRequest {
    name: string;
    parentId?: string;
}

export type StorageItem =
    | (DirectoryMetadata & { type: 'directory' })
    | (FileMetadata & { type: 'file' });
