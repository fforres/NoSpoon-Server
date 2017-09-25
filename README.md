# [WIP] - NoSpoon-Server

## Explanation
WS backend Server created to serve the [NoSpoon game](https://github.com/fforres/NoSpoon) for `@fforres` talk on WebVR

## Running
- `clone`
- `yarn install`
- `donwload && run redis`
  - You can either run your own instance, or use the supplied docker image.
  - `docker build -t redis .` && `docker run --name redis_container -d redis`
- `yarn run watch`
  - `DEBUG=*,-nodemon* yarn run watch` for debugging in console
  - `yarn run watch:debug` for running dev-tool interactive debugger
