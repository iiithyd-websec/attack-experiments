#!/bin/bash
cd can-of-worms/
emacs --batch -l org index.org -f org-babel-tangle
cd ../bag-of-tricks/vectors/
emacs --batch -l org index.org -f org-babel-tangle
cd ../
emacs --batch -l org index.org -f org-babel-tangle
cd ./public/js/
emacs --batch -l org index.org -f org-babel-tangle