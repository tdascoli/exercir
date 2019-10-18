var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

// BrowserSync Reload
function reload(done) {
  browserSync.reload();
  done();
}

// Static Server + watching scss/html files
gulp.task('watch', function () {
    browserSync.init({
        server: './src'
    });

    gulp.watch("src/scss/*.scss", gulp.series('sass'));
    gulp.watch(["src/*.html","src/*.js","src/*.css"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', gulp.series('sass','watch'));
