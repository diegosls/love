import { useEffect, useRef } from "react";

export default function Stars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    let stars = [];

    function createStars() {
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: Math.random() * 2 + 0.5,
        size: Math.random() * 2
      }));
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      stars.forEach(star => {
        star.y += star.speed;

        if (star.y > h) {
          star.y = 0;
          star.x = Math.random() * w;
        }

        ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#ff8ad6";
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      requestAnimationFrame(draw);
    }

    createStars();
    draw();

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      createStars();
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}