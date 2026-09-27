import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Test-only transport: the SDK's local BlobsServer omits GET ETags. Model the
// documented atomic conditional requests without weakening production checks.
export function blobFetch(directory) {
  return async (url, options) => {
    const request = new Request(url, options);
    const file = join(directory, createHash('sha256').update(new URL(url).pathname).digest('hex'));
    const data = existsSync(file) ? readFileSync(file, 'utf8') : null;
    const etag = data === null ? null : `"${createHash('sha256').update(data).digest('hex')}"`;
    if (request.method === 'GET') {
      return data === null ? new Response(null, { status: 404 })
        : new Response(data, { headers: { ETag: etag } });
    }
    if (request.method !== 'PUT') throw new Error('Unexpected fixture request');
    if (request.headers.get('If-None-Match') === '*' ? data !== null
      : request.headers.get('If-Match') !== etag || etag === null) {
      return new Response(null, { status: 412 });
    }
    // The synchronous write keeps each conditional update atomic within this
    // test process; production atomicity is supplied by Netlify Blobs.
    writeFileSync(file, options.body);
    return new Response(null, { headers: { ETag: '"saved"' } });
  };
}
