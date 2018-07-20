#!/bin/bash

set -x
set -o errexit

echo $CI_BUILD_REF_SLUG
echo $CI_BUILD_REF_NAME
