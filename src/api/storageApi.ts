
import type {
    FileMetadata,
    DirectoryMetadata,
    FileListResponse,
    DirectoryListResponse,
    CreateDirectoryRequest
} from './models';

const BASE_URL = '/storage-api/v1';

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, options);

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.detail ??
            `HTTP ${response.status}: ${response.statusText}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export async function listFiles(
    directoryId: string | null
): Promise<FileMetadata[]> {
    const files: FileMetadata[] = [];
    const limit = 100;

    while (true) {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(files.length)
        });

        if (directoryId) {
            params.set('directoryId', directoryId);
        }

        const response = await request<FileListResponse>(
            `/files?${params}`
        );

        files.push(...response.files);

        if (files.length >= response.total ||
            response.files.length === 0) {
            return files;
        }
    }
}

export async function listDirectories(
    directoryId: string | null
): Promise<DirectoryMetadata[]> {
    const directories: DirectoryMetadata[] = [];
    const limit = 100;

    while (true) {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(directories.length)
        });

        if (directoryId) {
            params.set('directoryId', directoryId);
        }

        const response = await request<DirectoryListResponse>(
            `/directories?${params}`
        );

        directories.push(...response.directories);

        if (directories.length >= response.total ||
            response.directories.length === 0) {
            return directories;
        }
    }
}

export function getFile(id: string): Promise<FileMetadata> {
    return request(`/files/${id}`);
}

export function getDirectory(
    id: string
): Promise<DirectoryMetadata> {
    return request(`/directories/${id}`);
}

export function createDirectory(
    name: string,
    parentId: string | null
): Promise<DirectoryMetadata> {
    const body: CreateDirectoryRequest = { name };

    if (parentId) {
        body.parentId = parentId;
    }

    return request('/directories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

export function deleteFile(id: string): Promise<void> {
    return request(`/files/${id}`, {
        method: 'DELETE'
    });
}

export function deleteDirectory(id: string): Promise<void> {
    return request(`/directories/${id}?recursive=false`, {
        method: 'DELETE'
    });
}

export function uploadFile(
    file: File,
    directoryId: string | null
): Promise<FileMetadata> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/octet-stream',
        'X-File-Name': file.name,
        'X-Content-Type': file.type || 'application/octet-stream'
    };

    if (directoryId) {
        headers['X-Directory-Id'] = directoryId;
    }

    return request('/files', {
        method: 'POST',
        headers,
        body: file
    });
}

export function downloadFile(id: string): void {
    const link = document.createElement('a');

    link.href = `${BASE_URL}/files/${id}/content`;
    link.download = '';

    document.body.appendChild(link);
    link.click();
    link.remove();
}
