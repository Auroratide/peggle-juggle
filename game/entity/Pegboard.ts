import * as PIXI from 'pixi.js'
import { Peg } from './Peg'
import { Band } from './Band'
import { Resources } from '../aliases'
import { assets } from '../assets'

export class Pegboard extends PIXI.TilingSprite {
    private ticker: PIXI.Ticker
    readonly pegs: Peg[]
    readonly bands: Band[]
    private preparedPeg: Peg

    private pegsLayer: PIXI.Container
    private bandsLayer: PIXI.Container

    constructor(resources: Resources, renderer: PIXI.Renderer, ticker: PIXI.Ticker) {
        super(resources[assets.hole].texture, renderer.width, renderer.height)

        this.pegs = []
        this.bands = []
        this.preparedPeg = null

        this.interactive = true

        this.pegsLayer = new PIXI.Container()
        this.bandsLayer = new PIXI.Container()

        this.addChild(this.bandsLayer)
        this.addChild(this.pegsLayer)

        this.ticker = ticker
    }

    killOldestPeg = () => {
        const peg = this.pegs.shift()
        if (peg) {
            if (this.preparedPeg === peg) {
                this.preparedPeg = null
            }
            peg.destroy()
        }

        this.pegs[0].gonnaDieSoon()
    }

    makePeg: (x: number, y: number) => Peg = (x, y) => {
        const peg = new Peg(x, y, this, this.ticker)
        this.pegsLayer.addChild(peg)
        this.pegs.push(peg)
        return peg
    }

    makeRandomPeg: () => Peg = () => {
        return this.makePeg(Math.floor(Math.random() * 10) * 40 + 60, Math.floor(Math.random() * 10) * 40 + 60)
    }

    prepareBand = (peg: Peg) => {
        this.preparedPeg = peg
    }

    joinPreparedPeg: (to: Peg) => Band = (to) => {
        if (this.preparedPeg) {
            const band = this.joinPegs(this.preparedPeg, to)
            this.preparedPeg = null
            return band
        } else {
            return null
        }
    }

    joinPegs: (first: Peg, second: Peg) => Band = (first, second) => {
        const band = first.joinTo(second)
        this.bandsLayer.addChild(band)
        this.bands.push(band)

        return band
    }

    removeBand: (band: Band) => void = (band) => {
        this.bands.splice(this.bands.indexOf(band), 1)
    }
}