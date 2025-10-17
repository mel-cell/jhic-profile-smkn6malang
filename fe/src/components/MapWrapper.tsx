// src/app/components/MapWrapper.js
"use client";

import React from 'react';
import dynamic from 'next/dynamic';

interface MapWrapperProps {
  position: [number, number];
  zoom: number;
}

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
});

const MapWrapper: React.FC<MapWrapperProps> = ({ position, zoom }) => {
  return <MapWithNoSSR position={position} zoom={zoom} />;
};

export default MapWrapper;
