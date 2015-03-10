var gulp = require('gulp');

gulp.task('copy', function () {
  
  gulp.src('bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('src/fonts'));
  gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('src/js'));
  gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('src/js'));
  gulp.src('bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/slip/slip.js').pipe(gulp.dest('src/js'));
  gulp.src('bower_components/slip/slip.js').pipe(gulp.dest('dist/js'));
  gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css').pipe(gulp.dest('dist/css'));

});

gulp.task('html', function () {
  
  var htmlmin = require('gulp-htmlmin');
  
  return gulp.src('src/html/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/html'))
});

gulp.task('css', function () {

  var uncss   = require('gulp-uncss');
  var csscomb = require('gulp-csscomb');
  var csso    = require('gulp-csso');
  
  return gulp.src('src/css/bootstrap.min.css')
    .pipe(uncss({
      html: ['src/html/options.html']
    }))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
  
  var uglify = require('gulp-uglify');
  
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', function () {
  gulp.start('copy', 'html', 'css', 'js');
});