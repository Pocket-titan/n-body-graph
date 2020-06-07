import { curry } from 'ramda';
import produce from 'immer';

const max_children_per_quadrant = 1;

type Vector = number[]; // = [number, number]

type Size = {
  width: number;
  height: number;
};

interface Point {
  location: Vector;
}

type Points = Point[] & { length: 0 | 1 }; // max_children_per_quadrant = 1

type Region = {
  nw: Vector;
  se: Vector;
};

type Leaf = Region & {
  children: Points;
};

type Branch = Region & {
  children: [Quadrant, Quadrant, Quadrant, Quadrant];
};

type Quadrant = Leaf | Branch;

interface Quadtree {
  width: number;
  height: number;
  root: Quadrant;
}

const isPoint = (point_or_not: any): point_or_not is Point => {
  return (
    'location' in (point_or_not as Point) &&
    (point_or_not as Point)?.location instanceof Array &&
    (point_or_not as Point)?.location.length === 2
  );
};

const calculate_region_size = ({ nw, se }: Region): Size => ({
  width: Math.abs(se[0] - nw[0]),
  height: Math.abs(se[1] - nw[1]),
});

const region_contains_point = ({ nw, se }: Region, { location: [x, y] }: Point): Boolean =>
  nw[0] <= x && x <= se[0] && nw[1] <= y && y <= se[1];

const isLeaf = (quadrant: Quadrant): quadrant is Leaf =>
  quadrant.children.every(isPoint) && [0, 1].includes(quadrant.children.length);

const add_vectors = (location: Vector, [width, height]: Vector): Vector => [location[0] + width, location[1] + height];

const leaf_to_branch = ({ nw, se, children }: Leaf): Branch => {
  let { width, height }: Size = calculate_region_size({ nw, se });
  let [quadrant_width, quadrant_height] = [width / 2, height / 2];

  let branch: Branch = {
    nw: nw,
    se: se,
    children: [
      {
        nw: nw,
        se: add_vectors(se, [-quadrant_width, -quadrant_height]),
        children: [],
      }, // top-left
      {
        nw: add_vectors(nw, [quadrant_width, 0]),
        se: add_vectors(se, [0, -quadrant_height]),
        children: [],
      }, // top-right
      {
        nw: add_vectors(nw, [quadrant_width, quadrant_height]),
        se: se,
        children: [],
      }, // bottom-right
      {
        nw: add_vectors(nw, [0, quadrant_height]),
        se: add_vectors(se, [-quadrant_width, 0]),
        children: [],
      }, // bottom-left
    ],
  };

  for (let point of children) {
    branch = insert(point, branch) as Branch;
  }

  return branch;
};

const accumulate_points = (quadrant: Quadrant): Point[] => {
  return Quadtree.reduce(
    quadrant,
    (arr, child) => {
      if (isLeaf(child)) {
        return [...arr, ...child.children];
      }

      return arr;
    },
    [] as Point[]
  );
};

const trim_empty_branches = (branch: Branch): Branch | Leaf => {
  const { nw, se, children } = branch;

  if (children.every((child) => isLeaf(child))) {
    let points = accumulate_points(branch);

    if (points.length <= max_children_per_quadrant) {
      return {
        nw: nw,
        se: se,
        children: points as Points,
      } as Leaf;
    }

    return branch;
  }

  return {
    ...branch,
    children: children.map((child) => {
      if (isLeaf(child)) {
        return child;
      }

      return trim_empty_branches(child);
    }),
  } as Branch;
};

const build = ({ width, height, points = [] }: Size & { points?: Point[] }): Quadrant => {
  if (width <= 0 || height <= 0) {
    throw new Error(`Provided tree dimensions width: ${width}, height: ${height} should be > 0`);
  }

  let quadtree: Quadrant = {
    nw: [0, 0],
    se: [width, height],
    children: [],
  };

  for (let point of points) {
    quadtree = Quadtree.insert(point, quadtree);
  }

  return quadtree;
};

const insert = (point: Point, quadrant: Quadrant): Quadrant => {
  if (isLeaf(quadrant)) {
    if (quadrant.children.length + 1 > max_children_per_quadrant) {
      let branch: Branch = leaf_to_branch(quadrant);

      return insert(point, branch);
    }

    return {
      ...quadrant,
      children: [...quadrant.children, point],
    } as Leaf;
  }

  let new_home_index = quadrant.children.findIndex((child) => region_contains_point(child, point));

  if (new_home_index === -1) {
    throw new Error();
  }

  return {
    ...quadrant,
    // A map might not be very performant tbh
    children: quadrant.children.map((child, index) => {
      if (index === new_home_index) {
        return insert(point, child);
      }

      return child;
    }),
  } as Branch;
};

const Quadtree = {
  build: build,

  insert: insert,

  map: (quadrant: Quadrant, fn: (q: Quadrant) => Quadrant): Quadrant => {
    let result = fn(quadrant);

    if (isLeaf(result)) {
      return result as Leaf;
    }

    return {
      ...result,
      children: result.children.map((child) => Quadtree.map(child, fn)),
    } as Branch;
  },

  reduce: <T>(quadrant: Quadrant, fn: (acc: T, curr: Quadrant) => T, value: T): T => {
    let result = fn(value, quadrant);

    if (isLeaf(quadrant)) {
      return result;
    }

    return quadrant.children.reduce((child_acc, child_curr) => Quadtree.reduce(child_curr, fn, child_acc), result);
  },

  dfs: (quadrant: Quadrant) => {
    let stack = [quadrant];

    return {
      [Symbol.iterator]: function* () {
        while (stack.length > 0) {
          let element = stack.pop() as Quadrant;

          if (!isLeaf(element)) {
            stack.push(...[...element.children].reverse());
          }

          yield element;
        }
      },
    };
  },

  bfs: (quadrant: Quadrant) => {
    let queue = [quadrant];

    return {
      [Symbol.iterator]: function* () {
        while (queue.length > 0) {
          let element = queue.shift() as Quadrant;

          if (!isLeaf(element)) {
            queue.push(...[...element.children].reverse());
          }

          yield element;
        }
      },
    };
  },
};

export type { Quadrant, Leaf, Point };

export { isPoint, isLeaf, calculate_region_size };

export default Quadtree;
