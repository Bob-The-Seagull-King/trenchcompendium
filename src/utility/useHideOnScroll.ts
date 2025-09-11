import { useEffect, useRef, useState } from "react"

export function useHideOnScroll(headerRef?: React.RefObject<HTMLElement>) {
    const [hidden, setHidden] = useState(false)
    const lastY = useRef(0)
    const accUp = useRef(0)
    const accDn = useRef(0)
    const ticking = useRef(false)

    useEffect(() => {
        if (headerRef?.current) {
            const h = headerRef.current.getBoundingClientRect().height
            document.documentElement.style.setProperty("--header-height", `${Math.round(h)}px`)
        }
    }, [headerRef?.current])

    useEffect(() => {
        const hideThreshold = 55
        const revealThreshold = 55    // etwas höher, um Flackern zu vermeiden
        const topRevealOffset = 8
        const minDelta = 5             // kleine Scroll-Deltas ignorieren (Rubberband)

        const onScroll = () => {
            if (ticking.current) return
            ticking.current = true
            requestAnimationFrame(() => {
                const y = window.scrollY
                const delta = y - lastY.current

                // kleine Bewegungen (Bounce, Jitter) ignorieren
                if (Math.abs(delta) < minDelta) {
                    lastY.current = y
                    ticking.current = false
                    return
                }

                // wenn ganz oben → Header immer zeigen
                if (y <= topRevealOffset) {
                    accUp.current = 0
                    accDn.current = 0
                    if (hidden) setHidden(false)
                    lastY.current = y
                    ticking.current = false
                    return
                }

                if (delta > 0) {
                    // runter scrollen
                    accDn.current += delta
                    accUp.current = 0
                    if (!hidden && accDn.current >= hideThreshold) {
                        setHidden(true)
                        accDn.current = 0
                    }
                } else if (delta < 0) {
                    // hoch scrollen
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
        return () => window.removeEventListener("scroll", onScroll)
    }, [hidden])

    return hidden
}
