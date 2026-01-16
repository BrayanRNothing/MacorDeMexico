import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let blobs = [];
        const blobCount = 12;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Blob {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 200 + 150;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.5 + 0.2;
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                // Use the user's preferred blue/purple palette
                const colors = [
                    'rgba(37, 99, 235, 0.15)', // Blue 600
                    'rgba(79, 70, 229, 0.15)', // Indigo 600
                    'rgba(124, 58, 237, 0.15)', // Violet 600
                    'rgba(147, 51, 234, 0.1)',  // Purple 600
                    'rgba(59, 130, 246, 0.1)'   // Blue 500
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.x > canvas.width + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = canvas.height + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius;
            }

            draw() {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            blobs = [];
            for (let i = 0; i < blobCount; i++) {
                blobs.push(new Blob());
            }
        };

        const animate = () => {
            // Dark elegant background
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add subtle grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            blobs.forEach(blob => {
                blob.update();
                blob.draw();
            });

            // Noise overlay for texture
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 bg-[#020617]">
            <canvas
                ref={canvasRef}
                className="w-full h-full opacity-60"
            />
            {/* Dark vignette */}
            <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-transparent to-slate-950 pointer-events-none opacity-80"></div>
        </div>
    );
};

export default AnimatedBackground;
