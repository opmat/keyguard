const gulp = require('gulp');

const NimiqBuild = require('../../meta/build-process/nimiq-base-gulpfile.js');

gulp.task('build', () => NimiqBuild.build({
    jsEntry: 'src/keyguard.js',
    cssEntry: 'src/keyguard.css',
    htmlEntry: 'src/index.html',
    rootPath: `${__dirname}/../../`,
    distPath: 'dist'
}));

gulp.task('default', ['build']);
