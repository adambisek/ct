// if this file named gulpfile.babel.js -> can be used ES6 syntax :)
import gulp from 'gulp';
import eslint from 'gulp-eslint';

const filesToLint = [
  './*.js',
  './src/**/*.js',
  './test/*.js',
];

gulp.task('lint', () => {
  const stream = gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
  return stream;
});

gulp.task('lint-fix', () => {
  const stream = gulp.src(filesToLint, { base: '.' })
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulp.dest('.'));
  return stream;
});
