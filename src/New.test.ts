import Quadtree from './New';

describe('works', () => {
  test('does', () => {
    let points = [
      {
        location: [50, 50],
      },
      {
        location: [25, 25],
      },
      {
        location: [30, 30],
      },
      {
        location: [20, 20],
      },
      {
        location: [25, 30],
      },
    ];

    let tree = Quadtree.build({ width: 200, height: 200 }, points);

    console.log('tree', JSON.stringify(tree, null, 2));

    let new_tree = Quadtree.update(tree, (point) => {
      return {
        ...point,
        location: [point.location[0] + 100, point.location[1] - 20],
      };
    });

    console.log('new_tree', JSON.stringify(new_tree, null, 2));
  });
});
