const gulp = require('gulp');

const NimiqBuild = require('../../meta/build-process/nimiq-base-gulpfile.js');

gulp.task('build', () => NimiqBuild.build('keyguard.js', 'keyguard.css', 'keyguard.html', [], `${__dirname}/../../`, 'dist'));