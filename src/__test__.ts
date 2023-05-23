import gulp from 'gulp';
import gulpDirCipher from '.';

const password = 'juln1234';

// encoding
gulp.src(['/Volumes/dev/gulp-dir-cipher/src/**/**', '!/Volumes/dev/gulp-dir-cipher/src'])
  .pipe(gulpDirCipher(password, 'encoding', { debug: true }))
  .pipe(gulp.dest('/Volumes/dev/gulp-dir-cipher/build'))

setTimeout(() => {
  // decoding
  gulp.src(['/Volumes/dev/gulp-dir-cipher/build/**/**', '!/Volumes/dev/gulp-dir-cipher/build'])
    .pipe(gulpDirCipher(password, 'decoding', { debug: true }))
    .pipe(gulp.dest('/Volumes/dev/gulp-dir-cipher/build/source'))
}, 2000)
