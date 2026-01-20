import { MediaManagerConfig, MediaUploadResponse, MediaLibraryItem } from '../types/media';
import { buildApiUrl, getGlobalApiConfig } from '../../../src/shared-config';

export class MediaAPI {
  private config: MediaManagerConfig;

  constructor(config: MediaManagerConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    return this.config.headers || {};
  }

  private getApiUrl(): string {
    return this.config.apiUrl || getGlobalApiConfig().apiUrl;
  }

  async upload(file: File): Promise<MediaUploadResponse> {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds ${this.config.maxFileSize} bytes`);
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.upload);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchLibrary(page = 1, limit = 20): Promise<{ items: MediaLibraryItem[]; total: number }> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const response = await fetch(`${libraryUrl}?${params.toString()}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Fetch library failed: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const deleteUrl = `${libraryUrl}/${id}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  }

  async fetchFolders(): Promise<any[]> {
    const foldersUrl = buildApiUrl(this.getApiUrl(), 'media/folders');
    const response = await fetch(foldersUrl, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Fetch folders failed: ${response.statusText}`);
    }

    return response.json();
  }

  async createFolder(name: string, parentId?: string | null): Promise<any> {
    const foldersUrl = buildApiUrl(this.getApiUrl(), 'media/folders');
    const response = await fetch(foldersUrl, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        parent_id: parentId || null
      })
    });

    if (!response.ok) {
      throw new Error(`Create folder failed: ${response.statusText}`);
    }

    return response.json();
  }

  async updateMedia(id: string, updates: Record<string, any>): Promise<void> {
    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const updateUrl = `${libraryUrl}/${id}`;

    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Update media failed: ${response.statusText}`);
    }
  }
}
