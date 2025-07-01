export interface MoverOptions {
  elementSelector: string
  durationMs?: number
  easingFunction?: (t: number) => number
}

export class CenterMover {
  private element: HTMLElement
  private duration: number
  private easing: (t: number) => number

  constructor(options: MoverOptions) {
    const { elementSelector, durationMs = 600, easingFunction } = options
    const el = document.querySelector<HTMLElement>(elementSelector)
    if (!el) {
      throw new Error(`Element not found: ${elementSelector}`)
    }
    this.element = el
    this.duration = durationMs
    this.easing = easingFunction || ((t) => t * (2 - t)) // default ease-out
  }

  async moveToCenter(): Promise<void> {
    const parent = this.element.parentElement
    if (!parent) return

    const parentRect = parent.getBoundingClientRect()
    const elRect = this.element.getBoundingClientRect()

    const targetX = (parentRect.width - elRect.width) / 2
    const targetY = (parentRect.height - elRect.height) / 2

    const startX = elRect.left - parentRect.left
    const startY = elRect.top - parentRect.top

    return new Promise((resolve) => {
      const startTime = performance.now()

      const animate = (time: number) => {
        const elapsed = time - startTime
        const t = Math.min(elapsed / this.duration, 1)
        const eased = this.easing(t)

        const currentX = startX + (targetX - startX) * eased
        const currentY = startY + (targetY - startY) * eased

        this.element.style.position = "absolute"
        this.element.style.left = `${currentX}px`
        this.element.style.top = `${currentY}px`

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }
}
