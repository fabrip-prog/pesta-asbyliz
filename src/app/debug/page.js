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
      
      // Buscar el blob 'database.json' (el que usa db.js)
      const dbBlob = blobs.find(b => b.pathname === 'database.json');
      if (dbBlob) {
        output.dbBlob = dbBlob;
        
        const response = await fetch(dbBlob.downloadUrl || dbBlob.url, { 
          cache: 'no-store',
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        });
        output.data = await response.json();
      } else {
        output.data = "No se encontró 'database.json' en Blob Storage. Se usarán datos por defecto hasta que se guarde algo.";
      }
      
      // Intento de escritura de prueba
      try {
        const { put } = await import('@vercel/blob');
        let putOptions = { access: 'private', addRandomSuffix: false, token: process.env.BLOB_READ_WRITE_TOKEN };
        try {
          const testPut = await put('test-debug.txt', 'hello', putOptions);
          output.testWrite = "Success (Private)";
          output.testWriteUrl = testPut.url;
        } catch (err) {
          if (err.message && err.message.includes('public')) {
            putOptions.access = 'public';
            const testPut = await put('test-debug.txt', 'hello', putOptions);
            output.testWrite = "Success (Public)";
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
    output = { status: "No BLOB_READ_WRITE_TOKEN in environment — la persistencia NO funciona sin este token." };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Diagnostic Page</h1>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}
export const dynamic = 'force-dynamic';
