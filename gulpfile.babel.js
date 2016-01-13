const gulp = require('gulp');

gulp.task('copy', () => {
  gulp.src('bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('dist/fonts'));
  gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/slip/slip.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css').pipe(gulp.dest('dist/css'));
  gulp.src('src/icons/*').pipe(gulp.dest('dist/icons'));
  gulp.src('src/manifest.json').pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  const htmlmin = require('gulp-htmlmin');

  return gulp.src('src/html/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/html'))
});

gulp.task('css', () => {
  const uncss   = require('gulp-uncss');
  const csscomb = require('gulp-csscomb');
  const csso    = require('gulp-csso');

  return gulp.src('src/css/bootstrap.min.css')
    .pipe(uncss({
      html: ['src/html/options.html']
    }))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', () => {
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');

  return gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', () => {
  gulp.start('copy', 'html', 'css', 'js');
});
