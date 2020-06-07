// import {
//   Region,
//   Quadrant,
//   Leaf,
//   Point,
//   calculate_region_size,
//   find_quadrant_for_point,
//   region_contains_point,
//   subdivide,
//   bfs,
// } from './Quadtree';
import Quadtree, { Quadrant, Point } from './Quadtree';

describe('works', () => {
  test('tree', () => {
    let points = [
      {
        location: [100, 100],
      },
      {
        location: [50, 50],
      },
    ] as Point[];

    let tree = Quadtree.build({ width: 500, height: 500, points });

    console.log('JSON.stringify(tree)', JSON.stringify(tree, null, 2));
  });
});

// describe('', () => {
//   test('', () => {
//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [
//         {
//           nw: [0, 0],
//           se: [50, 50],
//           children: [],
//         }, // north-west
//         {
//           nw: [50, 50],
//           se: [100, 100],
//           children: [
//             {
//               nw: [50, 50],
//               se: [75, 75],
//               children: [],
//             },
//             {
//               nw: [75, 50],
//               se: [100, 75],
//               children: [],
//             },
//             {
//               nw: [75, 75],
//               se: [100, 100],
//               children: [],
//             },
//             {
//               nw: [50, 75],
//               se: [75, 100],
//               children: [],
//             },
//           ],
//         }, // south-east
//         {
//           nw: [50, 0],
//           se: [100, 50],
//           children: [],
//         }, // north-east
//         {
//           nw: [0, 50],
//           se: [50, 100],
//           children: [],
//         }, // south-west
//       ],
//     };

//     // let elements = Quadtree.dfs(quadrant);

//     // for (let element of elements) {
//     //   console.log('element', element);
//     // }

//     let res = Quadtree.reduce(
//       quadrant,
//       (acc, curr) => {
//         return acc + curr.nw[0];
//       },
//       0
//     );

//     console.log('res', res);
//   });
// });
// describe('calculate_region_size', () => {
//   test('normal coordinates', () => {
//     let region: Region = {
//       nw: [0, 0],
//       se: [150, 150],
//     };

//     expect(calculate_region_size(region)).toMatchObject({
//       width: 150,
//       height: 150,
//     });
//   });

//   test('handles negative dimensions correctly', () => {
//     let region: Region = {
//       nw: [0, 0],
//       se: [-150, -150],
//     };

//     expect(calculate_region_size(region)).toMatchObject({
//       width: 150,
//       height: 150,
//     });
//   });

//   test('handles negative origins', () => {
//     let region: Region = {
//       nw: [-50, -50],
//       se: [-150, -150],
//     };

//     expect(calculate_region_size(region)).toMatchObject({
//       width: 100,
//       height: 100,
//     });
//   });

//   test('handles complex dimensions', () => {
//     let region: Region = {
//       nw: [-50, 50],
//       se: [150, -150],
//     };

//     expect(calculate_region_size(region)).toMatchObject({
//       width: 200,
//       height: 200,
//     });
//   });
// });

// describe('find_quadrant_for_point', () => {
//   test('simple', () => {
//     let point: Point = {
//       location: [50, 50],
//     };

//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [],
//     };

//     let result = find_quadrant_for_point(point, quadrant);

//     expect(result).toMatchObject([]);
//   });

//   test('nested once', () => {
//     let point: Point = {
//       location: [75, 25],
//     };

//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [
//         {
//           nw: [0, 0],
//           se: [50, 50],
//           children: [],
//         }, // north-west
//         {
//           nw: [50, 50],
//           se: [100, 100],
//           children: [],
//         }, // south-east
//         {
//           nw: [50, 0],
//           se: [100, 50],
//           children: [],
//         }, // north-east
//         {
//           nw: [0, 50],
//           se: [50, 100],
//           children: [],
//         }, // south-west
//       ],
//     };

//     let result = find_quadrant_for_point(point, quadrant);

//     expect(result).toMatchObject([2]);
//   });

//   test('nested twice', () => {
//     let point: Point = {
//       location: [30, 30],
//     };

//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [
//         {
//           nw: [0, 0],
//           se: [50, 50],
//           children: [
//             {
//               nw: [0, 0],
//               se: [25, 25],
//               children: [],
//             },
//             {
//               nw: [25, 25],
//               se: [50, 50],
//               children: [],
//             },
//             {
//               nw: [25, 0],
//               se: [50, 25],
//               children: [],
//             },
//             {
//               nw: [0, 25],
//               se: [25, 50],
//               children: [],
//             },
//           ],
//         }, // north-west
//         {
//           nw: [50, 50],
//           se: [100, 100],
//           children: [],
//         }, // south-east
//         {
//           nw: [50, 0],
//           se: [100, 50],
//           children: [],
//         }, // north-east
//         {
//           nw: [0, 50],
//           se: [50, 100],
//           children: [],
//         }, // south-west
//       ],
//     };

//     let result = find_quadrant_for_point(point, quadrant);

//     expect(result).toMatchObject([0, 1]);
//   });

//   test('false when out of bounds', () => {
//     let point: Point = {
//       location: [200, 200],
//     };

//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [
//         {
//           nw: [0, 0],
//           se: [50, 50],
//           children: [],
//         }, // north-west
//         {
//           nw: [50, 50],
//           se: [100, 100],
//           children: [],
//         }, // south-east
//         {
//           nw: [50, 0],
//           se: [100, 50],
//           children: [],
//         }, // north-east
//         {
//           nw: [0, 50],
//           se: [50, 100],
//           children: [],
//         }, // south-west
//       ],
//     };

//     let result = find_quadrant_for_point(point, quadrant);

//     expect(result).toBe(false);
//   });
// });

// // describe('subdivide', () => {
// //   test('works', () => {
// //     let leaf: Leaf = {
// //       nw: [0, 0],
// //       se: [100, 100],
// //       children: [
// //         {
// //           location: [30, 30],
// //         },
// //       ],
// //     };

// //     let quadrants = subdivide(leaf);
// //     console.log('quadrants', quadrants);
// //   });
// // });

// describe('bfs', () => {
//   test('hmm', () => {
//     let quadrant: Quadrant = {
//       nw: [0, 0],
//       se: [100, 100],
//       children: [
//         {
//           nw: [0, 0],
//           se: [50, 50],
//           children: [
//             {
//               nw: [0, 0],
//               se: [25, 25],
//               children: [],
//             },
//             {
//               nw: [25, 25],
//               se: [50, 50],
//               children: [],
//             },
//             {
//               nw: [25, 0],
//               se: [50, 25],
//               children: [],
//             },
//             {
//               nw: [0, 25],
//               se: [25, 50],
//               children: [],
//             },
//           ],
//         }, // north-west
//         {
//           nw: [50, 50],
//           se: [100, 100],
//           children: [],
//         }, // south-east
//         {
//           nw: [50, 0],
//           se: [100, 50],
//           children: [],
//         }, // north-east
//         {
//           nw: [0, 50],
//           se: [50, 100],
//           children: [],
//         }, // south-west
//       ],
//     };

//     let testPoint: Point = {
//       location: [40, 75],
//     };

//     let result = bfs(quadrant, (q) => region_contains_point(q, testPoint));
//     console.log('result', result);
//   });
// });
