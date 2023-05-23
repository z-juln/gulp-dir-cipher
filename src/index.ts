import path from 'path';
import crypto from 'crypto';
import { Stream } from 'stream';
import { atob, btoa } from 'buffer';
import type { Transform } from 'stream';
import type File from 'vinyl';

/** base64 + blowfish */
const gulpDirCipher = (password: string, mode: 'encoding' | 'decoding' = 'encoding', cfg = { debug: false }): NodeJS.ReadWriteStream => {
  const iv = password.split('').reverse().join('');

  function transform(this: Transform, originalFile: File, encoding: BufferEncoding, callback: (error?: Error | null, data?: File) => void) {
    const cipher = crypto.createCipheriv("blowfish", password, iv);
    const decipher = crypto.createDecipheriv("blowfish", password, iv);

    const file = originalFile.clone({ contents: true });

    // sourceMap
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    const parseFilename = () => {
      // base64
      try {
        const newBasename = mode === 'encoding'
          ? btoa(file.basename).replace('/', '-')
          : atob(file.basename.replace('-', '/'));
        file.path = path.join(file.base, newBasename);
      } catch (error: any) {
        if (cfg.debug) {
          console.log('  parseFilename error:\n' + '    file: ' + path.join(file.base, file.basename) + '\n    errMsg: ' + error?.message ?? error + '\n');
        } else {
          throw error;
        }
      }
    };

    const parseContents = () => {
      if (file.isDirectory()) return;
      if (file.contents) {
        try {
          const content_base64 = file.contents.toString('base64');
          const parse = mode === 'encoding' ? cipher : decipher;
          file.contents = Buffer.from(
            parse.update(content_base64, 'base64', 'base64') as string + parse.final('base64') as string,
            'base64'
          );
        } catch (error: any) {
          if (cfg.debug) {
            console.log('  parseContents error:\n' + '    file: ' + path.join(file.base, file.basename) + '\n    errMsg: ' + error?.message ?? error + '\n');
          } else {
            throw error;
          }
        }
      }
    };

    parseFilename();
    parseContents();
    callback(null, file);
  };
  return new Stream.Transform({ objectMode: true, transform });
}

export default gulpDirCipher;
