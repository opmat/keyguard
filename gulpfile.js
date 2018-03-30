const gulp = require('gulp');

const NimiqBuild = require('../../meta/build-process/nimiq-base-gulpfile.js');

gulp.task('build', () => NimiqBuild.build(
    'src/keyguard.js',
    'src/keyguard.css',
    'src/keyguard.html',
    [],
    `${__dirname}/../../`,
    'dist'
));