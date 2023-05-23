import gulp from 'gulp';
import gulpDirCipher from '..';
import { rmdirSync, existsSync } from 'fs';

const password = 'juln1234';

if (existsSync('./build')) {
  rmdirSync('./build', { recursive: true });
}

// encoding
gulp.src(['./src/**/**', '!./src'])
  .pipe(gulpDirCipher(password, 'encoding', { debug: true }))
  .pipe(gulp.dest('./build'))

setTimeout(() => {
  // decoding
  gulp.src(['./build/**/**', '!./build'])
    .pipe(gulpDirCipher(password, 'decoding', { debug: true }))
    .pipe(gulp.dest('./build/source'))
}, 2000)
