import { findScopedNameConflict } from './category-hierarchy.util';

describe('findScopedNameConflict', () => {
  const rows = [
    { id: '1', name: 'Beverages', parentId: null, businessId: 'b' },
    { id: '2', name: 'Cola', parentId: '1', businessId: 'b' },
    { id: '3', name: 'Beverages', parentId: null, businessId: 'b2' },
  ];

  it('detects duplicate main categories in the same business', () => {
    expect(findScopedNameConflict(rows, 'beverages', null)).toEqual(rows[0]);
  });

  it('allows the same sub name under different parents', () => {
    const scoped = [
      ...rows,
      { id: '4', name: 'Cola', parentId: '9', businessId: 'b' },
    ];
    expect(findScopedNameConflict(scoped, 'Cola', '9')?.id).toBe('4');
    expect(findScopedNameConflict(scoped, 'Cola', '1')?.id).toBe('2');
  });
});
