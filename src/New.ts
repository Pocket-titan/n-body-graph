import produce from 'immer';
import { Stack, List } from 'immutable';
import vector, { Vector } from './vector';

const max_children_per_quadrant: number = 1;

type Region = {
  nw: Vector;
  se: Vector;
};

type Point = {
  [key: string]: any;
  location: number[];
};

type Leaf = Region & {
  children: Point[];
};

type Branch = Region & {
  children: [Quadrant, Quadrant, Quadrant, Quadrant];
};

type Quadrant = Leaf | Branch;

type Tree = {
  width: number;
  height: number;
  root: Quadrant;
};

// Utility stuff
const isPoint = (point_or_not: any): point_or_not is Point => {
  return (
    'location' in (point_or_not as Point) &&
    (point_or_not as Point)?.location instanceof Array &&
    (point_or_not as Point)?.location.length === 2
  );
};

const isLeaf = (quadrant: Quadrant): quadrant is Leaf => {
  return (
    (quadrant as Leaf)?.children?.every(isPoint) &&
    [...Array(max_children_per_quadrant + 1).keys()].includes(quadrant.children.length)
  );
};

const contains_point = ({ nw, se }: Region, { location: [x, y] }: Point): Boolean => {
  return nw[0] <= x && x <= se[0] && nw[1] <= y && y <= se[1];
};

const calculate_region_size = ({ nw, se }: Region): { width: number; height: number } => ({
  width: Math.abs(se[0] - nw[0]),
  height: Math.abs(se[1] - nw[1]),
});

// The meat
const reduce_quadrant = <T>(quadrant: Quadrant, fn: (acc: T, curr: Quadrant) => T, value: T): T => {
  let result = fn(value, quadrant);

  if (isLeaf(quadrant)) {
    return result;
  }

  return quadrant.children.reduce((child_acc, child_curr) => reduce_quadrant(child_curr, fn, child_acc), result);
};

const map_quadrant = (quadrant: Quadrant, fn: (quadrant: Quadrant) => Quadrant): Quadrant => {
  let result = fn(quadrant);

  if (isLeaf(result)) {
    return result as Leaf;
  }

  return {
    ...result,
    children: result.children.map((child) => map_quadrant(child, fn)),
  } as Branch;
};

const split_into_quadrants = ({ nw, se, children }: Leaf): Branch => {
  const size = calculate_region_size({ nw, se });
  const [width, height] = [size.width / 2, size.height / 2];

  let branch: Branch = {
    nw,
    se,
    children: [
      {
        nw: nw,
        se: vector.add(se, [-width, -height]),
        children: [],
      }, // top-left
      {
        nw: vector.add(nw, [width, 0]),
        se: vector.add(se, [0, -height]),
        children: [],
      }, // top-right
      {
        nw: vector.add(nw, [width, height]),
        se: se,
        children: [],
      }, // bottom-right
      {
        nw: vector.add(nw, [0, height]),
        se: vector.add(se, [-width, 0]),
        children: [],
      }, // bottom-left
    ],
  };

  for (let point of children) {
    branch = insert(point, branch) as Branch;
  }

  return branch;
};

const insert = (point: Point, quadrant: Quadrant): Quadrant => {
  if (!contains_point(quadrant, point)) {
    throw new Error();
  }

  if (isLeaf(quadrant)) {
    let new_quadrant: Leaf = {
      ...quadrant,
      children: [...quadrant.children, point],
    };

    if (new_quadrant.children.length > max_children_per_quadrant) {
      return split_into_quadrants(new_quadrant) as Branch;
    }

    return new_quadrant as Leaf;
  }

  let found_a_place = false;

  let new_quadrant = {
    ...quadrant,
    children: quadrant.children.map((child) => {
      if (!found_a_place && contains_point(child, point)) {
        found_a_place = true;
        return insert(point, child);
      }

      return child;
    }),
  } as Branch;

  if (!found_a_place) {
    throw new Error();
  }

  return new_quadrant as Branch;
};

// Ugh I could have avoided this if I made Quadtree a Quadrant itself but idk
const Quadtree = {
  build: ({ width, height, points = [] }: { width: number; height: number; points: Point[] }): Tree => {
    let tree: Tree = {
      width,
      height,
      root: {
        nw: [0, 0],
        se: [width, height],
        children: [] as Point[],
      } as Leaf,
    };

    for (let point of points) {
      tree = Quadtree.insert(point, tree);
    }

    return tree;
  },
  insert: (point: Point, tree: Tree) => ({
    ...tree,
    root: insert(point, tree.root),
  }),
  update: (tree: Tree, fn: (point: Point) => Point): Tree => {
    return tree;
  },
  map: (tree: Tree, fn: (quadrant: Quadrant) => Quadrant): Tree => ({
    ...tree,
    root: map_quadrant(tree.root, fn),
  }),
  reduce: <T>(tree: Tree, fn: (acc: T, curr: Quadrant) => T, value: T): T => reduce_quadrant(tree.root, fn, value),
};

export default Quadtree;

export type { Tree };
