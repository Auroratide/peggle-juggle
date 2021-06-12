import * as PIXI from 'pixi.js'
import { Angle } from './Angle'
import { Band } from './Band'
import { Orb } from './Orb'
import { Peg } from './Peg'
import { Pegboard } from './Pegboard'
import { PegGenerator } from './PegGenerator'
import { Velocity } from './Velocity'

const app = new PIXI.Application({
    width: 480,
    height: 480,
})

document.body.append(app.view)

app.loader.load(() => {
    const board = new Pegboard()
    const orb = new Orb(app.ticker, board.bands)

    for (let i = 0; i < 12; ++i)
        board.makePeg(Math.random() * 480, Math.random() * 480)

    app.stage.addChild(board)
    app.stage.addChild(orb)

    const generator = new PegGenerator(480, 480, board, app.ticker)
    generator.start()
})
