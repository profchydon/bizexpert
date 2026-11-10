import { productSearchOr } from './product-search.util';

describe('productSearchOr', () => {
  it('matches name sku barcode and category', () => {
    expect(productSearchOr('IMEI-9')).toEqual([
      { name: { contains: 'IMEI-9', mode: 'insensitive' } },
      { sku: { contains: 'IMEI-9', mode: 'insensitive' } },
      { barcode: { contains: 'IMEI-9', mode: 'insensitive' } },
      { category: { contains: 'IMEI-9', mode: 'insensitive' } },
    ]);
  });
});
