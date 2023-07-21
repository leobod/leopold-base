import path from 'path'
import fs from 'fs'
import { MiddlewareItemType } from './index';

const fileExtension  = (val) => {
    const dotLastIndex = val.lastIndexOf(".")
    return dotLastIndex !== -1 ? val.substring(val.lastIndexOf(".") + 1) : '';
}


const _parser = async(ctx, next) => {
    const urlPieces = ctx.request.url.split('/')
    if(urlPieces[1] === 'api') {
        let ext = fileExtension (ctx.request.url)
        console.log('ext', ext)
        let full_path =  ''
        if(ext) {
            full_path = path.join(process.cwd(), `./www/${ctx.request.url}`)
        } else {
            full_path = path.join(process.cwd(), `./www/${ctx.request.url}.js`)
            ext = 'js'
        }
        if (fs.existsSync(full_path)) {
            if(ext === 'js') {
                const controller = require(full_path)
                if (controller) {
                    controller.fn(ctx, next)
                }
            } else if (ext === 'html') {
                const content = fs.readFileSync(full_path,"utf8")
                console.log(content)
                ctx.body = content
            } else {
                ctx.body = 'no match'
            }
        } else {
            ctx.body = 'not found'
        }
    } else {
        ctx.set('Content-Type', 'application/json')
        ctx.body = ctx
    }
}

const BodyParser: MiddlewareItemType = {
    init: function (app): void {
        app.use(_parser)

    }
}