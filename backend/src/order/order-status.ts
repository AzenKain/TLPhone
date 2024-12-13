export enum OrderStatus {
  Created = 'Created',
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Delivery = 'Delivery',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export function getOrderStatusFromText(text: string): OrderStatus | undefined {
  const formattedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return Object.values(OrderStatus).find(status => status === formattedText);
}

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Created]: [OrderStatus.Pending, OrderStatus.Cancelled],
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],
  [OrderStatus.Confirmed]: [OrderStatus.Delivery, OrderStatus.Cancelled],
  [OrderStatus.Delivery]: [OrderStatus.Completed, OrderStatus.Cancelled],
  [OrderStatus.Completed]: [OrderStatus.Refunded],
  [OrderStatus.Cancelled]: [],
  [OrderStatus.Refunded]: []
};


export function canTransitionTo(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  return validTransitions[currentStatus]?.includes(nextStatus) || false;
}