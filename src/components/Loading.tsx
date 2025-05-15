"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-base-100 z-50">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <span className="text-lg font-semibold text-base-content">Carregando...</span>
    </div>
  );
} 