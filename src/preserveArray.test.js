import preserveArray from './preserveArray';

describe('.preserveArray', () => {
  test('returns diff with nested objects converted back to arrays when property is deleted', () => {
    const left = { a: [{ b: ['#', '#', '#', { hello: '' }, { hi: ''}] }, '#', { c: '', d: ['#', ''] }, '#'] };
    const right = { a: [{ b: ['#', '#', '#', { hello: 'world' }] }, '#', { c: 'hello', d: ['#', 'bob'] }] };
    const diff = {
      a: {
        0: {
          b: {
            3: {
              hello: 'world'
            },
            4: undefined
          }
        },
        2: {
          c: 'hello',
          d: {
            1: 'bob'
          }
        },
        3: undefined
      }
    };
    const expected = {
      a: [
        {
          b: [
            'empty',
            'empty',
            'empty',
            {
              hello: 'world'
            },
            undefined
          ]
        },
        'empty',
        {
          c: 'hello',
          d: ['empty', 'bob']
        },
        undefined
      ]
    };

    // Remove 'empty'
    delete expected.a[0].b[0];
    delete expected.a[0].b[1];
    delete expected.a[0].b[2];
    delete expected.a[1];
    delete expected.a[2].d[0];

    expect(preserveArray(diff, left, right)).toEqual(expected);
  });

  test('returns diff with nested objects converted back to arrays when new property is added', () => {
    const left = { a: [{ b: ['#', '#', '#', { hello: '' }] }, '#', { c: '', d: ['#', ''] }] };
    const right = { a: [{ b: ['#', '#', '#', { hello: 'world' }, {hi: ''}] }, '#', { c: 'hello', d: ['#', 'bob'] }, 'foobar'] };
    const diff = {
      a: {
        0: {
          b: {
            3: {
              hello: 'world'
            },
            4: {
              hi: ''
            }
          }
        },
        2: {
          c: 'hello',
          d: {
            1: 'bob'
          }
        },
        3: 'foobar'
      }
    };
    const expected = {
      a: [
        {
          b: [
            'empty',
            'empty',
            'empty',
            {
              hello: 'world'
            },
            {
              hi: ''
            }
          ]
        },
        'empty',
        {
          c: 'hello',
          d: ['empty', 'bob']
        },
        'foobar'
      ]
    };

    // Remove 'empty'
    delete expected.a[0].b[0];
    delete expected.a[0].b[1];
    delete expected.a[0].b[2];
    delete expected.a[1];
    delete expected.a[2].d[0];

    expect(preserveArray(diff, left, right)).toEqual(expected);
  });
});
