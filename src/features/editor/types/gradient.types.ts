// src/features/editor/types/gradient.types.ts

import { fabric } from 'fabric';

export interface GradientStop {
    offset: number;
    color: string;
}

export interface GradientDirection {
    name: string;
    apply: (object: fabric.Object, startColor: string, endColor: string) => void;
}



export interface GradientConfig {
    type: 'linear' | 'radial';
    angle?: number;
    stops: GradientStop[];
    centerX?: number;
    centerY?: number;
    radius?: number;
}

export const createGradient = (canvas: fabric.Canvas, config: GradientConfig, object: fabric.Object) => {
    const { type, stops } = config;

    // For linear gradients
    if (type === 'linear') {
        const angleRad = ((config.angle || 0) * Math.PI) / 180;

        // Calculate coordinates based on angle
        const coords = {
            x1: 0,
            y1: 0,
            x2: Math.cos(angleRad),
            y2: Math.sin(angleRad)
        };

        return new fabric.Gradient({
            type: 'linear',
            coords,
            colorStops: stops,
            // Use offsetX/Y instead of gradientTransform
            offsetX: -object.width! / 2,
            offsetY: -object.height! / 2
        });
    }

    // For radial gradients
    return new fabric.Gradient({
        type: 'radial',
        coords: {
            r1: 0,
            r2: config.radius || 0.5,
            x1: config.centerX || 0.5,
            y1: config.centerY || 0.5,
            x2: config.centerX || 0.5,
            y2: config.centerY || 0.5
        },
        colorStops: stops,
        offsetX: -object.width! / 2,
        offsetY: -object.height! / 2
    });
};

export const gradientToConfig = (gradient: fabric.Gradient): GradientConfig => {
    if (!gradient.coords) {
        throw new Error('Invalid gradient object');
    }

    const stops = gradient.colorStops || [];

    if (gradient.type === 'linear') {
        const { x1 = 0, y1 = 0, x2 = 1, y2 = 0 } = gradient.coords;
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        return {
            type: 'linear',
            angle: angle,
            stops: stops.map(stop => ({
                offset: stop.offset || 0,
                color: stop.color
            }))
        };
    }

    const { x1 = 0.5, y1 = 0.5, r2 = 0.5 } = gradient.coords;

    return {
        type: 'radial',
        centerX: x1,
        centerY: y1,
        radius: r2,
        stops: stops.map(stop => ({
            offset: stop.offset || 0,
            color: stop.color
        }))
    };
};

export interface GradientStop {
    offset: number;
    color: string;
}

export interface GradientDirection {
    name: string;
    apply: (object: fabric.Object, startColor: string, endColor: string) => void;
}
