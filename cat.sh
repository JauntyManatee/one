#! /bin/bash

dest='project/static/tinyFiles/lib.min.js'
rm $dest
touch $dest

#below are bower_component files, add to the array to add more
declare -a Paths=('/angular/angular.min.js' '/angular-route/angular-route.min.js' '/angular-sanitize/angular-sanitize.min.js' '/d3/d3.min.js' '/moment/min/moment.min.js');
for path in ${Paths[@]}; do
  echo cat-ing 'project/static/bower_components'$path
  cat 'project/static/bower_components'$path >> $dest
done

#below is an example of a standalone lib addition to the cat file
echo cat-ing 'project/static/js/nv.d3.js'
cat 'project/static/js/nv.d3.min.js' >> $dest

#below are custom i minified and added to tinyFiles.js
declare -a Paths=('/embed.min.js' '/angulard3.min.js' '/angular-pageslide.min.js')
for path in ${Paths[@]}; do
  echo cat-ing 'project/static/tinyFiles'$path
  cat 'project/static/tinyFiles'$path >> $dest
done

