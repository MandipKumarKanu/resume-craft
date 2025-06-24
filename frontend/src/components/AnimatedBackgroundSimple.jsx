import React, { useEffect, useRef } from 'react';

function AnimatedBackgroundSimple() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(6, 10, 58, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <div className="background-layer">
      <canvas
        ref={canvasRef}
        className="w-full h-full border-none block"
      />
    </div>
  );
}

export default AnimatedBackgroundSimple;
