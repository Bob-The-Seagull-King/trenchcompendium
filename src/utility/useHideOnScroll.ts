import { useEffect, useRef, useState } from "react"

export function useHideOnScroll(headerRef?: React.RefObject<HTMLElement>) {
    const [hidden, setHidden] = useState(false)

    // last scroll position and accumulated distances in each direction
    const lastY = useRef(0)
    const accUp = useRef(0)
    const accDn = useRef(0)
    const ticking = useRef(false)

    // measured header height → used for CSS var and thresholds
    const headerH = useRef(55) // sensible default; will be measured

    useEffect(() => {
        // measure header height once (or when ref changes) and expose as CSS var
        if (headerRef?.current) {
            const h = Math.max(1, Math.round(headerRef.current.getBoundingClientRect().height))
            headerH.current = h
            document.documentElement.style.setProperty("--header-height", `${h}px`)
        }
    }, [headerRef?.current])

    useEffect(() => {
        // thresholds
        const hideThreshold = 12                // how much you must scroll DOWN to hide
        const revealThreshold = headerH.current // require roughly a header-height scroll UP to reveal
        const topRevealOffset = 8               // near the very top → always show
        const minDelta = 5                      // ignore tiny deltas (iOS rubber band / jitter)
        const bottomGuard = Math.max(24, headerH.current) // in this bottom zone never reveal

        const onResize = () => {
            // reset accumulators on viewport changes (address bar show/hide etc.)
            accUp.current = 0
            accDn.current = 0

            // re-measure header if possible
            if (headerRef?.current) {
                const h = Math.max(1, Math.round(headerRef.current.getBoundingClientRect().height))
                headerH.current = h
                document.documentElement.style.setProperty("--header-height", `${h}px`)
            }
        }

        const onScroll = () => {
            if (ticking.current) return
            ticking.current = true

            requestAnimationFrame(() => {
                const docEl = document.documentElement
                const y = window.scrollY
                const viewportH = window.innerHeight
                const pageH = docEl.scrollHeight

                // if page is not scrollable at all, keep header shown and bail
                const scrollable = pageH - viewportH > 1
                if (!scrollable) {
                    if (hidden) setHidden(false)
                    lastY.current = y
                    ticking.current = false
                    return
                }

                const delta = y - lastY.current

                // always show near top; also clear accumulators
                if (y <= topRevealOffset) {
                    accUp.current = 0
                    accDn.current = 0
                    if (hidden) setHidden(false)
                    lastY.current = y
                    ticking.current = false
                    return
                }

                // never reveal when within the bottom guard zone (prevents bounce-induced reveals)
                const distanceToBottom = pageH - (y + viewportH)
                if (distanceToBottom <= bottomGuard) {
                    // keep header hidden while in bottom zone; also clear accumulators
                    if (!hidden) setHidden(true)
                    accUp.current = 0
                    accDn.current = 0
                    lastY.current = y
                    ticking.current = false
                    return
                }

                // ignore tiny deltas to filter out iOS rubber band / jitter
                if (Math.abs(delta) < minDelta) {
                    lastY.current = y
                    ticking.current = false
                    return
                }

                if (delta > 0) {
                    // scrolling DOWN → hide after threshold
                    accDn.current += delta
                    accUp.current = 0
                    if (!hidden && accDn.current >= hideThreshold) {
                        setHidden(true)
                        accDn.current = 0
                    }
                } else {
                    // scrolling UP → reveal after threshold
                    accUp.current += -delta
                    accDn.current = 0
                    if (hidden && accUp.current >= revealThreshold) {
                        setHidden(false)
                        accUp.current = 0
                    }
                }

                lastY.current = y
                ticking.current = false
            })
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [hidden, headerRef])

    return hidden
}
