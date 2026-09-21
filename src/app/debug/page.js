import { list } from '@vercel/blob';

export default async function DebugPage() {
  let output = {};
  
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      output = {
        status: "Token is present",
        blobs: blobs.map(b => ({ pathname: b.pathname, url: b.url, size: b.size, uploadedAt: b.uploadedAt }))
      };
      
      // Fetch the latest db-data
      const dbBlobs = blobs.filter(b => b.pathname.startsWith('db-data'));
      if (dbBlobs.length > 0) {
        dbBlobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        const latestBlob = dbBlobs[0];
        output.latestBlob = latestBlob;
        
        const response = await fetch(latestBlob.downloadUrl || latestBlob.url, { 
          cache: 'no-store',
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        });
        output.data = await response.json();
      } else {
        // Fallback to data.json
        const oldBlob = blobs.find(b => b.pathname === 'data.json');
        if (oldBlob) {
           output.oldBlob = oldBlob;
           const response = await fetch(oldBlob.downloadUrl || oldBlob.url, { 
             cache: 'no-store',
             headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
           });
           output.data = await response.json();
        }
      }
      
      // Attempt a test write
      try {
        const { put } = await import('@vercel/blob');
        let putOptions = { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN };
        try {
          const testPut = await put('test-debug.txt', 'hello', putOptions);
          output.testWrite = "Success (Public)";
          output.testWriteUrl = testPut.url;
        } catch (err) {
          if (err.message && err.message.includes('private store')) {
            putOptions.access = 'private';
            const testPut = await put('test-debug.txt', 'hello', putOptions);
            output.testWrite = "Success (Private)";
            output.testWriteUrl = testPut.url;
          } else {
            throw err;
          }
        }
      } catch (writeErr) {
        output.testWrite = "Failed";
        output.testWriteError = writeErr.message;
        output.testWriteStack = writeErr.stack;
      }
      
    } catch (e) {
      output = { status: "Error reading blobs", error: e.message };
    }
  } else {
    output = { status: "No BLOB_READ_WRITE_TOKEN in environment" };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Diagnostic Page</h1>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}
export const dynamic = 'force-dynamic';
