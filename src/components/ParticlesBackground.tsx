'use client'

import { useEffect, useRef } from 'react'

export default function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        let mouse = { x: -1000, y: -1000 }
        let themeColor = '168, 85, 247' // Default purple

        const particleCount = 45
        const connectionDistance = 120
        const mouseRepelDist = 200

        const getThemeColor = () => {
            if (typeof window === 'undefined') return '168, 85, 247'
            const style = getComputedStyle(document.documentElement)
            const rgb = style.getPropertyValue('--primary-rgb').trim()
            return rgb || '168, 85, 247'
        }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.vx = (Math.random() - 0.5) * 0.15
                this.vy = (Math.random() - 0.5) * 0.15
                this.size = Math.random() * 1.5 + 0.5
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                // Mouse attraction/repulsion
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouseRepelDist) {
                    const forceDirectionX = dx / distance
                    const forceDirectionY = dy / distance
                    const force = (mouseRepelDist - distance) / mouseRepelDist

                    this.vx += forceDirectionX * force * 0.02
                    this.vy += forceDirectionY * force * 0.02
                }

                // Bounce off edges
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${themeColor}, 0.4)`
                ctx.fill()
            }
        }

        const initParticles = () => {
            themeColor = getThemeColor()
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((p, index) => {
                p.update()
                p.draw()

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(${themeColor}, ${0.3 * (1 - distance / connectionDistance)})`
                        ctx.lineWidth = 1
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        })

        // Initial setup
        resize()
        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', (e) => {
                mouse.x = e.clientX
                mouse.y = e.clientY
            })
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        />
    )
}
