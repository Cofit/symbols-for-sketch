const gulp = require('gulp')
const rename = require('gulp-rename')
const sketch = require('gulp-sketch')
const iconfont = require('gulp-iconfont')
const consolidate = require('gulp-consolidate')
const bs = require('browser-sync').create()

/**
 * Font settings
 */
const fontName = 'cficon' // set name of your symbol font
const className = 'cficon' // set class name in your CSS
const skethcFileName = 'symbol-font-16px.sketch' // or 'symbol-font-16px.sketch'
const template = 'ionic-2-style'; // you can also choose 'foundation-style'

gulp.task('symbols', function(){
  gulp.src(skethcFileName)
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'svg'] 
    }))
    .on('glyphs', function(glyphs) {
      var options = {
        className: 'cficon', // set class name in your CSS
        fontName: fontName,
        fontPath: '../fonts/', // set path to font (from your CSS file if relative)
        glyphs: glyphs.map(mapGlyphs)
      }
      gulp.src(`templates/${template}.css`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: fontName }))
        .pipe(gulp.dest('dist/css/')) // set path to export your CSS

      gulp.src('templates/' + template + '.scss')
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: fontName }))
        .pipe(gulp.dest('dist/css/')) // set path to export your CSS

      // if you don't need sample.html, remove next 4 lines
      gulp.src(`templates/${template}.html`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: 'sample' }))
        .pipe(gulp.dest('dist/')) // set path to export your sample HTML
    })
    .pipe(gulp.dest('dist/fonts/')) // set path to export your fonts
  }
)

gulp.task('watch', ['symbols'], () => {
  bs.init({
    files: 'dist/sample.html',
    server: 'dist/',
    startPath: '/sample.html',
    middleware: cacheControl
  })
  gulp.watch('*.sketch', ['symbols'])
})

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs (glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

/**
 * This keeps browser from caching fonts for your testing environment
 */
function cacheControl (req, res, next) {
  res.setHeader('Cache-control', 'no-store')
  next()
}
