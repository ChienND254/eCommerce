export const NotificationTypes = {
    ORDER_001: 'ORDER-001',
    ORDER_002: 'ORDER-002',
    PROMOTION_001: 'PROMOTION-001',
    SHOP_001: 'SHOP-001'
} as const;

export type NotificationType = (typeof NotificationTypes)[keyof typeof NotificationTypes];