type Vector = [number, number];

export const add = (v1: Vector, v2: Vector): Vector => [v1[0] + v2[0], v1[1] + v2[1]];

export default { add };

export type { Vector };
