# gulp-dir-cipher

gulp中间件: gulp-dir-cipher, 使用base64+blowfish的方式, 对整个目录下的所有文件进行加密, 包括加密文件名、目录名、文件内容

## install

`npm i gulp-dir-cipher`

## use

```typescript
import gulp from 'gulp';

const password = 'juln1234';

// encoding
gulp.src(['/Volumes/dev/gulp-dir-cipher/src/**/**', '!/Volumes/dev/gulp-dir-cipher/src'])
  .pipe(gulpDirCipher(password, 'encoding', { debug: true }))
  .pipe(gulp.dest('/Volumes/dev/gulp-dir-cipher/dist'))

setTimeout(() => {
  // decoding
  gulp.src(['/Volumes/dev/gulp-dir-cipher/dist/**/**', '!/Volumes/dev/gulp-dir-cipher/dist'])
    .pipe(gulpDirCipher(password, 'decoding', { debug: true }))
    .pipe(gulp.dest('/Volumes/dev/gulp-dir-cipher/dist/source'))
}, 2000)
```
