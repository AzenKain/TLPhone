export type UpdateCartDto = {
    cartProducts: CartItemInp[];
};

export type CartItemInp = {
    quantity: number;
    productId: number;
    productVariantId: number;
};