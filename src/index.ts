import path from 'path';
import crypto from 'crypto';
import { Stream } from 'stream';
import { atob, btoa } from 'buffer';
import type { Transform } from 'stream';
import type File from 'vinyl';

export const checkPassword = (password: string) => Buffer.from(password).length === 8;
export const encodeDirname = (dirname: string) => btoa(dirname).replace('/', '-');
export const decodeDirname = (dirname: string) => atob(dirname.replace('-', '/'));

/** base64 + blowfish */
const gulpDirCipher = (password: string, mode: 'encoding' | 'decoding' = 'encoding', cfg = { debug: false }): NodeJS.ReadWriteStream => {
  const iv = password.split('').reverse().join('');

  /** 统计目录映射 */
  const dirRecords: { originalDir: string; finallyDir: string; }[] = [];

  function transform(this: Transform, originalFile: File, encoding: BufferEncoding, callback: (error?: Error | null, data?: File) => void) {
    if (!checkPassword(password)) {
      callback(new Error('the password is illegal and must consist of an 8-byte string'));
      return;
    }
    try {
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
          // 可能之前目录名就改变过, 路径就要跟着更新
          const mayBeDir = dirRecords.find(({ originalDir }) => originalDir === file.dirname)?.finallyDir;

          const newBasename = (mode === 'encoding' ? encodeDirname : decodeDirname)(file.basename);
          const newPath = path.join(mayBeDir ?? file.dirname, newBasename);
          if (file.isDirectory()) {
            dirRecords.push({ originalDir: file.path, finallyDir: newPath });
          }
          file.path = newPath;
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
    } catch (error: any) {
      callback(error);
    }
  };
  return new Stream.Transform({ objectMode: true, transform });
}

export default gulpDirCipher;
