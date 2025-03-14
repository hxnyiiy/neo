#!/bin/bash

opt1=$1
opt2=$2

if [ $# -eq 2 ]; then
    if [ $opt1 == 'test' -a $opt2 == 'aaa' ] || [ $opt1 == 'aaa' -a $opt2 == 'test' ];
        echo great
    else
        echo bad
    fi
else
    echo "Input two parameters...!!"
fi