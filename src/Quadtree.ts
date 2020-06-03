type Location = [number, number];

type Size = {
  width: number;
  height: number;
};

type Region = {
  nw: Location;
  se: Location;
};

interface Point {
  location: Location;
}

type Leaf = Region & {
  children: Point[];
};

type Branch<T> = Region & {
  children: T;
};

type Quadrant = Leaf | Branch<[Quadrant, Quadrant, Quadrant, Quadrant]>;

interface Quadtree extends Size {
  root: Quadrant;
}

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

  return quadtree;
};
