const {
    src,
    dest,
    watch,
    parallel,
    series
} = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();



function liveBrowser() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
};

function styles() {
    return src('app/scss/style.scss')

        // CONVERT SCSS TO CSS AND COMPRESSES
        .pipe(scss({
            outputStyle: 'compressed'
        }))

        // RENAMING THE CONVERTED CSS FILE
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
        }))

        // FILE LOCATION IN WHICH TO PUT CONVERTED CSS
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
};



function scripts() {
    return src(['node_modules/jquery/dist/jquery.js', 'node_modules/slick-carousel/slick/slick.js', 'app/js/main.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
};



function images() {
    // *.* ALL FILES
    return src('app/images/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(dest('dist/images'))
};


function build() {

    return src([
            'app/**/*.html',
            'app/css/style.min.css',
            'app/js/main.min.js',
            // BASE: APP - WILL SAVE THE FOLDER STRUCTURE AS WELL
        ], {
            base: 'app'
        })
        .pipe(dest('dist'))
};


function cleanDist() {
    return del('dist')
};




function watcher() {
    // ** WATCH FOR CSS CHANGES IN ALL FOLDER AND FILES
    watch(['app/scss/**/*.scss'], styles)

    // ** WATCH FOR JS CHANGES IN ALL FOLDER AND FILES, EXCEPT FOR MIN.JS
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)

    // ** WATCH FOR html CHANGES IN ALL FOLDER AND FILES, AND RELOADING THE html in browser
    watch(['app/**/*.html']).on('change', browserSync.reload)
};




exports.styles = styles;
exports.scripts = scripts;
exports.liveBrowser = liveBrowser;
exports.watcher = watcher;
exports.images = images;
exports.cleanDist = cleanDist;

// series - COMBINE INTO ONE TASK AND SPECIFY STRICT EXECUTION ORDER
exports.build = series(cleanDist, images, build);



// default - INSTEAD OF WRITING "gulp sometask" WE CAN RUN TASKS WRITING ONLY "gulp"
// parallel - WILL COMBINE MULTIPLE TASKS INTO ONE
exports.default = parallel(styles, scripts, liveBrowser, watcher);