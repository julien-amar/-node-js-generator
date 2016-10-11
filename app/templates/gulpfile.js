var gulp = require('gulp')
var gulpInject = require('gulp-inject')

var wiredep = require('wiredep').stream

gulp.task('copy-socket.io', function() {
  const target = gulp.dest('./public/vendors/socket.io-client')

  gulp.src('./node_modules/socket.io-client/socket.io.js')
    .pipe(target)
});

gulp.task('inject-scripts', function () {
  const vendors = gulp
    .src(['./public/app/**/*.js'])

  return gulp.src('./public/index.html')
    .pipe(gulpInject(vendors, { relative: true }))
    .pipe(gulp.dest('./public'))
});

gulp.task('inject-bower-files', function () {
  return gulp.src('./public/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./public'))
});

gulp.task('inject-vendors', ['inject-scripts', 'inject-bower-files'], function () {
  console.log('Injection done!')
});

gulp.task('default', ['copy-socket.io', 'inject-vendors'], function() {
  console.log('Done!')
});
