@ECHO OFF
PUSHD "%~dp0"
git add --all
git commit -am "commit"
git push
POPD
