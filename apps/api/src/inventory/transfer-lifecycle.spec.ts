import { StockTransferStatus } from '../common/enums';

describe('In-transit transfer lifecycle', () => {
  it('uses explicit states from dispatch through receive or cancel', () => {
    expect(StockTransferStatus.IN_TRANSIT).toBe('in_transit');
    expect(StockTransferStatus.COMPLETED).toBe('completed');
    expect(StockTransferStatus.CANCELLED).toBe('cancelled');
  });
});
