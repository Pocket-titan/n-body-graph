import Quadtree from './New';

describe('works', () => {
  test('does', () => {
    let points = [
      {
        location: [50, 50],
      },
      {
        location: [150, 150],
      },
    ];

    let tree = Quadtree.build({ width: 200, height: 200, points });

    console.log('tree', JSON.stringify(tree, null, 2));
  });
});
