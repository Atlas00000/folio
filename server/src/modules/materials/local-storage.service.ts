import { Injectable } from '@nestjs/common';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

/**
 * Local disk storage for A1. Swap for S3/MinIO later behind the same methods.
 */
@Injectable()
export class LocalStorageService {
  private readonly root = path.join(process.cwd(), 'storage');

  constructor() {
    if (!existsSync(this.root)) {
      mkdirSync(this.root, { recursive: true });
    }
  }

  async save(params: {
    courseId: string;
    originalName: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<{ storageKey: string; byteSize: number }> {
    const dir = path.join(this.root, params.courseId);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const safe = params.originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `${params.courseId}/${randomUUID()}_${safe}`;
    const full = path.join(this.root, storageKey);
    await writeFile(full, params.buffer);
    return { storageKey, byteSize: params.buffer.length };
  }

  openReadStream(storageKey: string) {
    const full = path.join(this.root, storageKey);
    if (!existsSync(full)) {
      return null;
    }
    return createReadStream(full);
  }

  absolutePath(storageKey: string) {
    return path.join(this.root, storageKey);
  }

  async readText(storageKey: string): Promise<string> {
    const full = path.join(this.root, storageKey);
    if (!existsSync(full)) {
      return '';
    }
    return readFile(full, 'utf8');
  }
}
