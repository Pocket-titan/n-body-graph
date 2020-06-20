import React, { useState, useEffect } from 'react';
import Quadtree, { Tree, Quadrant, isPoint, Point, isLeaf, Leaf, calculate_region_size } from './Quadtree';

const Circle = ({ point }: { point: Point }) => {
  const { location } = point;

  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#f06',
        position: 'absolute',
        left: location[0],
        top: location[1],
      }}
    />
  );
};

const Quad = ({ quadrant }: { quadrant: Quadrant }) => {
  const { nw, se } = quadrant;
  let { width, height } = calculate_region_size(quadrant);

  return (
    <>
      <div style={{ width, height, position: 'absolute', left: nw[0], top: nw[1], border: '1px solid red' }} />
      {isLeaf(quadrant)
        ? (quadrant.children as Point[]).map((point) => <Circle point={point} />)
        : (quadrant.children as Quadrant[]).map((child) => <Quad quadrant={child} />)}
    </>
  );
};

const QuadTree = ({ quadtree: { width, height, root } }: { quadtree: Tree }) => {
  return (
    <div style={{ width, height, position: 'relative', border: '1px solid red' }}>
      <Quad quadrant={root} />
    </div>
  );
};

let points = [
  {
    location: [100, 100],
  },
  {
    location: [50, 50],
  },
  {
    location: [25, 25],
  },
  {
    location: [300, 300],
  },
];

let initial_tree = Quadtree.build({ width: 500, height: 500 }, points);

const App = () => {
  const [tree, setTree] = useState(initial_tree);

  useEffect(() => {
    const schedule = () =>
      setTimeout(() => {
        update();
        schedule();
      }, 16.6);

    schedule();
  }, []);

  const update = () => {
    setTree((old_tree) => {
      return Quadtree.update(old_tree, (point) => {
        return {
          ...point,
          location: [point.location[0] + 1, point.location[1] + 1],
        };
      });
    });
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'hsl(0, 0%, 20%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <QuadTree quadtree={tree} />
    </div>
  );
};

export default App;
