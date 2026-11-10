import { applyOpeningStock } from './product-opening.util';

describe('applyOpeningStock', () => {
  it('skips zero quantity without touching balances', async () => {
    const tx = {
      inventoryBalance: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      stockMovement: { create: jest.fn() },
    };
    await applyOpeningStock(tx as never, {
      businessId: 'biz',
      locationId: 'loc',
      productId: 'prod',
      userId: 'user',
      quantity: 0,
      unitCost: 10,
    });
    expect(tx.inventoryBalance.findFirst).not.toHaveBeenCalled();
  });
});
