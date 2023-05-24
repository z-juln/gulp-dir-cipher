import gulp from 'gulp';
import gulpDirCipher from '..';
import { rmdirSync, existsSync } from 'fs';

const password = 'juln1234';

if (existsSync('./test-build')) {
  rmdirSync('./test-build', { recursive: true });
}
if (existsSync('./test-source')) {
  rmdirSync('./test-source', { recursive: true });
}

// encoding
gulp.src(['src/**/**'], { ignore: ['src'] })
  .pipe(
    gulpDirCipher(password, 'encoding', { debug: true })
      .on('error', (error) => console.log('==== gulpDirCipher encoding error', error?.message ?? error))
  )
  .pipe(gulp.dest('./test-build'))
  .on('end', () => {
    console.log('==== encoding end');
    // decoding
    gulp.src(['test-build/**/**'], { ignore: ['test-build'] })
      .pipe(
        gulpDirCipher(password, 'decoding', { debug: true })
          .on('error', (error) => console.log('==== gulpDirCipher decoding error', error?.message ?? error))
      )
      .pipe(gulp.dest('test-source'))
      .on('end', () => console.log('==== decoding end'));
  });
