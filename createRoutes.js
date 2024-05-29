const glob = require('glob')

const Router = require('express').Router

module.exports = () => glob

    .sync('**/*.js', { cwd: `${__dirname}/`+constants.API_VER+'/routes/' })

    .map(filename => require(`./`+constants.API_VER+'/routes/'+`${filename}`))

    .filter(router => Object.getPrototypeOf(router) == Router)
 

    .reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }))