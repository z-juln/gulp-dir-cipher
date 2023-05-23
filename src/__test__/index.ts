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
  .pipe(gulpDirCipher(password, 'encoding', { debug: true }))
  .pipe(gulp.dest('./test-build'))

setTimeout(() => {
  // decoding
  gulp.src(['test-build/**/**'], { ignore: ['test-build'] })
    .pipe(gulpDirCipher(password, 'decoding', { debug: true }))
    .pipe(gulp.dest('test-source'))
}, 2000)
