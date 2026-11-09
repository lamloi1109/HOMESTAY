import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { HttpError } from '../core.js';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export interface StorageService {
  save(data: Buffer, ext: string): Promise<string>;
  delete(storedName: string): Promise<void>;
  publicUrl(storedName: string): string;
}

export function detectImageExt(data: Buffer): string {
  if (data.length > MAX_IMAGE_BYTES) throw new HttpError(422, 'Ảnh vượt quá 10MB');
  if (data.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'jpg';
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP') return 'webp';
  throw new HttpError(422, 'Chỉ nhận ảnh JPG, PNG hoặc WebP');
}

function safeName(name: string): string {
  if (!name || name === '.' || name === '..' || /[/\\]/.test(name)) throw new HttpError(422, 'Tên file không hợp lệ');
  return name;
}

export class LocalDiskStorage implements StorageService {
  constructor(readonly root: string) {}
  async save(data: Buffer, ext: string): Promise<string> {
    const name = `${randomBytes(20).toString('hex')}.${ext}`;
    await mkdir(this.root, { recursive: true });
    await writeFile(resolve(this.root, name), data);
    return name;
  }
  async delete(name: string): Promise<void> {
    const target = resolve(this.root, safeName(name));
    if (dirname(target) !== resolve(this.root)) throw new HttpError(422, 'Tên file không hợp lệ');
    try { await unlink(target); } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }
  publicUrl(name: string): string { return `/uploads/${name}`; }
}

export interface R2Options {
  endpointUrl: string; accessKeyId: string; secretAccessKey: string;
  bucketName: string; publicUrl: string; keyPrefix: string;
}
export interface S3Transport { send(command: PutObjectCommand | DeleteObjectCommand): Promise<unknown> }
export class R2Storage implements StorageService {
  private readonly client: S3Transport;
  constructor(private readonly options: R2Options, client?: S3Transport) {
    if (![options.endpointUrl, options.accessKeyId, options.secretAccessKey, options.bucketName, options.publicUrl].every(Boolean)) {
      throw new Error('Thiếu cấu hình Cloudflare R2 bắt buộc');
    }
    this.client = client ?? new S3Client({ endpoint: options.endpointUrl, region: 'auto', credentials: { accessKeyId: options.accessKeyId, secretAccessKey: options.secretAccessKey } });
  }
  private key(name: string): string {
    const prefix = this.options.keyPrefix.replace(/^\/+|\/+$/g, '');
    return prefix ? `${prefix}/${safeName(name)}` : safeName(name);
  }
  async save(data: Buffer, ext: string): Promise<string> {
    const name = `${randomBytes(20).toString('hex')}.${ext}`;
    const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    await this.client.send(new PutObjectCommand({ Bucket: this.options.bucketName, Key: this.key(name), Body: data, ContentType: contentType, CacheControl: 'public, max-age=31536000, immutable' }));
    return name;
  }
  async delete(name: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.options.bucketName, Key: this.key(name) }));
  }
  publicUrl(name: string): string { return `${this.options.publicUrl.replace(/\/+$/, '')}/${this.key(name)}`; }
}
