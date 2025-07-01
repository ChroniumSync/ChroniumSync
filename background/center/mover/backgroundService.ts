export interface BackgroundOptions {
  containerSelector: string
  imageUrl: string
  repeat?: boolean
  parallaxSpeed?: number
}

export class BackgroundService {
  private container: HTMLElement
  private imageUrl: string
  private repeat: boolean
  private parallaxSpeed: number

  constructor(options: BackgroundOptions) {
    const { containerSelector, imageUrl, repeat = false, parallaxSpeed = 0 } = options
    const container = document.querySelector<HTMLElement>(containerSelector)
    if (!container) {
      throw new Error(`Container not found: ${containerSelector}`)
    }
    this.container = container
    this.imageUrl = imageUrl
    this.repeat = repeat
    this.parallaxSpeed = parallaxSpeed
    this.setupBackground()
    if (this.parallaxSpeed > 0) {
      window.addEventListener("scroll", this.onScroll.bind(this))
    }
  }

  private setupBackground() {
    const style = this.container.style
    style.backgroundImage = `url(${this.imageUrl})`
    style.backgroundSize = this.repeat ? "auto" : "cover"
    style.backgroundRepeat = this.repeat ? "repeat" : "no-repeat"
    style.backgroundPosition = "center center"
    style.position = style.position || "relative"
  }

  private onScroll() {
    const offset = window.pageYOffset * this.parallaxSpeed
    this.container.style.backgroundPosition = `center ${-offset}px`
  }
}
