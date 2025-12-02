// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Generate unique filename with timestamp and UUID
 */
export function generateUniqueFilename(originalName: string): {
    filename: string;
    timestamp: number;
    uuid: string;
} {
    const timestamp = Date.now();
    const uuid = randomUUID().split('-')[0]; // Use first segment for brevity
    const ext = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, ''); // Remove extension

    return {
        filename: `${timestamp}-${uuid}-${baseName}.${ext}`,
        timestamp,
        uuid
    };
}

/**
 * Calculate SHA256 checksum of buffer
 */
export function calculateChecksum(buffer: Buffer): string {
    const hash = createHash('sha256');
    hash.update(buffer);
    return `sha256:${hash.digest('hex')}`;
}

/**
 * Save file to storage with unique filename
 */
export async function saveFile(
    buffer: Buffer,
    originalName: string,
    directory: 'uploads' | 'thumbs' | 'parsed'
): Promise<{
    storedPath: string;
    filename: string;
    timestamp: number;
    uuid: string;
}> {
    const { filename, timestamp, uuid } = generateUniqueFilename(originalName);
    const dirPath = join(process.cwd(), 'public', directory);

    // Ensure directory exists
    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }

    const filePath = join(dirPath, filename);
    await writeFile(filePath, buffer);

    return {
        storedPath: `/${directory}/${filename}`,
        filename,
        timestamp,
        uuid
    };
}

/**
 * Add cache-busting query parameter to URL
 */
export function addCacheBuster(url: string, timestamp?: number): string {
    const t = timestamp || Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${t}`;
}

/**
 * Save JSON data to parsed directory
 */
export async function saveParsedJson(
    data: any,
    uuid: string,
    timestamp: number
): Promise<string> {
    const filename = `${timestamp}-${uuid}.json`;
    const dirPath = join(process.cwd(), 'public', 'parsed');

    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }

    const filePath = join(dirPath, filename);
    await writeFile(filePath, JSON.stringify(data, null, 2));

    return `/parsed/${filename}`;
}
