Useful commands:
`./node_modules/.bin/electron .`
`tail -f ~/Library/Logs/OpenROVCockpit/log.log`
`GH_TOKEN=$GH_TOKEN node_modules/.bin/build -p onTagOrDraft --draft`

https://github.com/electron-userland/electron-builder/wiki/docker
docker run --rm -ti -e GH_TOKEN=$GH_TOKEN -v ${PWD}:/project -v ${PWD##*/}-node-modules:/project/node_modules -v ~/.electron:/root/.electron electronuserland/electron-builder:wine
 yarn install --production --ignore-scripts --prefer-offline
CSC_IDENTITY_AUTO_DISCOVERY=false ./node_modules/.bin/build -mlw -p onTagOrDraft