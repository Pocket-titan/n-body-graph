import React from 'react';
import Quadtree, { Quadrant, isPoint, Point, isLeaf, Leaf, calculate_region_size } from './Quadtree';

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

let tree = Quadtree.build({ width: 500, height: 500, points });

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
    <div style={{ width, height, position: 'absolute', left: nw[0], top: nw[1], border: '1px solid red' }}>
      {isLeaf(quadrant)
        ? (quadrant.children as Point[]).map((point) => <Circle point={point} />)
        : (quadrant.children as Quadrant[]).map((child) => <Quad quadrant={child} />)}
    </div>
  );
};

const QuadTree = ({ quadtree }: { quadtree: Quadrant }) => {
  let { width, height } = calculate_region_size(quadtree);

  return (
    <div style={{ width, height, position: 'relative', border: '1px solid red' }}>
      {isLeaf(quadtree)
        ? (quadtree.children as Point[]).map((point) => null)
        : (quadtree.children as Quadrant[]).map((child) => <Quad quadrant={child} />)}
    </div>
  );
};

const App = () => {
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
