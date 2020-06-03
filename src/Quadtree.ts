type Location = [number, number];

type Size = {
  width: number;
  height: number;
};

export type Region = {
  nw: Location;
  se: Location;
};

export interface Point {
  location: Location;
}

export type Leaf = Region & {
  children: [] | [Point]; // max_children_per_quadrant = 1
};

type Branch<T> = Region & {
  children: T & { length: 4 };
};

export type Quadrant = Leaf | Branch<[Quadrant, Quadrant, Quadrant, Quadrant]>;

interface Quadtree extends Size {
  root: Quadrant;
}

const isPoint = (point_or_not: any): point_or_not is Point => {
  return (
    'location' in (point_or_not as Point) &&
    (point_or_not as Point)?.location instanceof Array &&
    (point_or_not as Point)?.location.length === 2
  );
};

const isLeaf = (quadrant: Quadrant): quadrant is Leaf => {
  return quadrant.children.every(isPoint) && [0, 1].includes(quadrant.children.length);
};

export const calculate_region_size = ({ nw, se }: Region): Size => {
  return {
    width: Math.abs(se[0] - nw[0]),
    height: Math.abs(se[1] - nw[1]),
  };
};

const contains_point = ({ nw, se }: Region, { location: [x, y] }: Point): Boolean => {
  return nw[0] <= x && x <= se[0] && nw[1] <= y && y <= se[1];
};

export const find_quadrant_for_point = (point: Point, quadrant: Quadrant, trail: number[] = []): number[] | false => {
  if (!contains_point(quadrant, point)) {
    return false; // this was a dead end
  }

  if (isLeaf(quadrant)) {
    return trail; // we found it!
  }

  let result: false | number[] = false;
  quadrant.children.some((child, index) => {
    let sub_result = find_quadrant_for_point(point, child, [...trail, index]);

    if (sub_result !== false) {
      result = sub_result;
      return true;
    }

    return false;
  });

  return result;
};

const add_to_location = (location: Location, [width, height]: [number, number]): Location => {
  return [location[0] + width, location[1] + height];
};

export const subdivide = ({ nw, se, children }: Leaf): Branch<[Quadrant, Quadrant, Quadrant, Quadrant]> => {
  let { width, height }: Size = calculate_region_size({ nw, se });
  let [quadrant_width, quadrant_height] = [width / 2, height / 2];

  let new_branch: Branch<[Quadrant, Quadrant, Quadrant, Quadrant]> = {
    nw: nw,
    se: se,
    children: [
      {
        nw: nw,
        se: add_to_location(se, [-quadrant_width, -quadrant_height]),
        children: [],
      }, // top-left
      {
        nw: add_to_location(nw, [quadrant_width, 0]),
        se: add_to_location(se, [0, -quadrant_height]),
        children: [],
      }, // top-right
      {
        nw: add_to_location(nw, [quadrant_width, quadrant_height]),
        se: se,
        children: [],
      }, // bottom-right
      {
        nw: add_to_location(nw, [0, quadrant_height]),
        se: add_to_location(se, [-quadrant_width, 0]),
        children: [],
      }, // bottom-left
    ],
  };

  // NEED WORK
  // children.forEach((point) => {
  //   let trail = find_quadrant_for_point(point, new_branch);

  //   if (!trail) {
  //     throw new Error(`Can't happen (could not assign all children to new subquadrants)`);
  //   }

  //   let ch = (trail as number[]).reduce((acc: any, index) => {
  //     return acc.children[index];
  //   }, new_branch);

  //   ch.children.push(point);
  // });

  // console.dir(new_branch, { depth: null });

  return new_branch;
};

export const build_quadtree = ({ width, height, points }: Size & { points: Point[] }): Quadtree => {
  let quadtree: Quadtree = {
    root: {
      nw: [0, 0],
      se: [width, height],
      children: [],
    },
    width,
    height,
  };

  for (let point of points) {
  }

  return quadtree;
};
