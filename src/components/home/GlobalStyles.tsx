// Komponen untuk global styles (bisa ditaruh di layout atau di page)
'use client';

export const GlobalStyles = () => {
  return (
    <style jsx global>{`
      @keyframes wave {
        0%,
        100% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(10deg);
        }
        75% {
          transform: rotate(-10deg);
        }
      }
      .animate-wave {
        animation: wave 2s infinite;
      }
      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s infinite;
      }
    `}</style>
  );
};
