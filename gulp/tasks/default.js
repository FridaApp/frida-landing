import gulp from 'gulp'
import runSequence from 'run-sequence'

const defaultTask = () =>
  runSequence(
    'copy:fonts',
    'icons',
    'images',
    'styles',
    'scripts:vendors',
    'scripts:app',
    'views',
    'server'
  )

const productionTask = () =>
  runSequence(
    'copy:fonts',
    'icons',
    'images',
    'styles',
    'scripts:vendors',
    'scripts:app',
    'views'
  )

gulp.task('default', defaultTask)
gulp.task('build', productionTask)

export default defaultTask
