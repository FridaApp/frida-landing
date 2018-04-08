import gulp from 'gulp'
import gutil from 'gulp-util'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import notify from 'gulp-notify'
import jshint from 'gulp-jshint'
import plumber from 'gulp-plumber'
import browserify from 'browserify'
import babelify from 'babelify'
import chalk from 'chalk'
import options from 'minimist'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import { scripts } from '../config'

const env = options(process.argv.slice(2))

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(
      chalk.red(err.name) +
        ': ' +
        chalk.yellow(err.fileName.replace(__dirname + '/src/js/', '')) +
        ': ' +
        'Line ' +
        chalk.magenta(err.lineNumber) +
        ' & ' +
        'Column ' +
        chalk.magenta(err.columnNumber || err.column) +
        ': ' +
        chalk.blue(err.description)
    )
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name) + ': ' + chalk.yellow(err.message))
  }

  this.emit('end')
}

const jshintTask = () => {
  gulp
    .src(scripts.jshintSrc)
    .pipe(jshint('.jshintrc'))
    .pipe(
      notify(function(file) {
        if (file.jshint.success) {
          return false
        }

        var errors = file.jshint.results
          .map(function(data) {
            if (data.error) {
              return (
                '(' +
                data.error.line +
                ':' +
                data.error.character +
                ') ' +
                data.error.reason
              )
            }
          })
          .join('\n')
        return (
          file.relative +
          ' (' +
          file.jshint.results.length +
          ' errors)\n' +
          errors
        )
      })
    )
}

const vendorsTask = () =>
  gulp
    .src(scripts.vendorSrc)
    .pipe(concat('vendors.js'))
    .pipe(env.production ? uglify() : gutil.noop())
    .pipe(gulp.dest(scripts.dest))

const scriptsTask = () => {
  const bundler = browserify({
    entries: scripts.src,
    debug: env.production ? false : true
  })

  return bundler
    .transform(babelify)
    .bundle()
    .on('error', map_error)
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(env.production ? uglify() : gutil.noop())
    .pipe(gulp.dest(scripts.dest))
}

gulp.task('scripts:vendors', vendorsTask)
gulp.task('scripts:app', scriptsTask)
gulp.task('jshint', jshintTask)

export default {
  vendorsTask,
  scriptsTask,
  jshintTask
}
