'use strict';
var ghpages = require('gh-pages');
var path = require('path');
var fse = require('fs-extra')

//Create a dist folder place all files there then create git hub page
const distFolder = 'dist';
const npmVenders = [
     'es6-shim',
     'zone.js',
     'reflect-metadata',
     'systemjs',
     'rxjs',
     '@angular',
     'ng2-draggable'
];


const appFilesFolders = [
    'systemjs.config.js',
    'index.html',
    'app',
    'styles.css'
]; 



npmVenders.map(np=>`/node_modules/${np}`).concat(appFilesFolders).map(ff=>{
    try {
        fse.copySync(path.join(__dirname,ff), path.join(__dirname,distFolder, ff));        
    } catch (error) {
        console.log(error);
    }
});



ghpages.publish(
    path.join(__dirname, dist)
,function (err) {
    if(err) return console.error(err);
    console.log('Created github page.');
    removeSync(path.join(___dirname, dist));
});