import axios from 'axios';
import { Backend_URL } from "./Constants";
import {CreateOtpDto, ForgetPasswordDto, SignUpDto, VerifyOtpDto} from "./dtos/auth";
import {
    CartType,
    ColorDetailType,
    ImageDetailType, OrderType,
    ProductType, RequestType,
    SchemaProductType,
    SearchProductType,
    TagsDetailType,
    UserType
} from "@/types";
import {ChangePasswordDto, SearchUserDto, UpdateCartDto, UpdateProfileDto} from "@/lib/dtos/user";
import {ColorDetailInp, SearchProductDto, TagsProductDto} from "@/lib/dtos/Product";
import {CreateOrderDto, GenerateVnpayPaymentDto, GenerateVnpayPaymentResponse, GetOrderDto} from "@/lib/dtos/order";



async function refreshTokenApi(refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch(Backend_URL + "/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshToken}`
            },
        });

        if (response.status === 201) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.error("Failed to refresh access token:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error while refreshing access token:", error);
        return null;
    }
}

export async function makeRequestApi(callback: Function, dto: any, refreshToken: string | undefined, accessToken: string | undefined) {
    try {
        if (accessToken == undefined) return null;
        const data = await callback(dto, accessToken);

        if (data == null && refreshToken !== undefined) {
            const newAccessToken = await refreshTokenApi(refreshToken);

            if (newAccessToken) {
                return await callback(dto, newAccessToken);
            } else {
                console.log('Unauthorized!');
                return null;
            }
        } else {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}



export async function signUpApi(dto: SignUpDto) {
    const res = await fetch(Backend_URL + "/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            ...dto,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        return null;
    }
    return await res.json();
}
export async function getUserByIdApi(id: string, token: string) {
    const query = `
        query GetUserById {
            GetUserById(id: "${id}") {
                created_at
                email
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                details {
                    address
                    birthday
                    firstName
                    gender
                    id
                    imgDisplay
                    lastName
                    phoneNumber
                }
                heart
                cart {
                    created_at
                    id
                    updated_at
                    cartProducts {
                      id
                      quantity
                      productVariant {
                        displayPrice
                        id
                        attributes {
                          id
                          type
                          value
                        }
                        stockQuantity
                      }
                      product {
                        created_at
                        id
                        isDisplay
                        name
                        details {
                          id
                          brand {
                            id
                            type
                            value
                          }
                          imgDisplay {
                            id
                            link
                            url
                          }
                        }
                      }
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        let dataReturn = response.data.data.GetUserById as UserType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay =
                Backend_URL + dataReturn.details.imgDisplay;
        }
        return dataReturn ;
    } catch (error) {
        console.error("Error fetching user: ", error);
        throw error;
    }
}
export async function changePasswordApi(dto: ChangePasswordDto, token: string) {
    const query = `
        mutation ChangePassword {
            ChangePassword(ChangePassword: { 
                currentPassword: "${dto.currentPassword}", 
                newPassword: "${dto.newPassword}" 
                }
            ) {
                created_at
                email
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                details {
                    address
                    birthday
                    firstName
                    gender
                    id
                    imgDisplay
                    lastName
                    phoneNumber
                }
                heart
                cart {
                    created_at
                    id
                    updated_at
                    cartProducts {
                      id
                      quantity
                      productVariant {
                        displayPrice
                        id
                        attributes {
                          id
                          type
                          value
                        }
                        stockQuantity
                      }
                      product {
                        created_at
                        id
                        isDisplay
                        name
                        details {
                          id
                          brand {
                            id
                            type
                            value
                          }
                          imgDisplay {
                            id
                            link
                            url
                          }
                        }
                      }
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        let dataReturn = response.data.data.ChangePassword as UserType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay =
                Backend_URL + dataReturn.details.imgDisplay;
        }
        return dataReturn ;
    } catch (error) {
        console.error("Error fetching user: ", error);
        throw error;
    }
}
export async function updateUserProfileApi(
    dto: UpdateProfileDto,
    token: string,
) {
    const query = `
        mutation UpdateProfileUser {
            UpdateProfileUser(
                UpdateProfile: {
                    phoneNumber: ${dto.phoneNumber ? `"${dto.phoneNumber}"` : null}
                    lastName: ${dto.lastName ? `"${dto.lastName}"` : null}
                    gender: ${dto.gender ? `"${dto.gender}"` : null}
                    firstName: ${dto.firstName ? `"${dto.firstName}"` : null}
                    address: ${dto.address ? `"${dto.address}"` : null}
                    birthday: ${dto.birthday ? `"${dto.birthday}"` : null}
                }
            ) {
                created_at
                email
                heart
                id
                isDisplay
                role
                secretKey
                updated_at
                cart {
                    created_at
                    id
                    updated_at
                    cartProducts {
                      id
                      quantity
                      productVariant {
                        displayPrice
                        id
                        attributes {
                          id
                          type
                          value
                        }
                        stockQuantity
                      }
                      product {
                        created_at
                        id
                        isDisplay
                        name
                        details {
                          id
                          brand {
                            id
                            type
                            value
                          }
                          imgDisplay {
                            id
                            link
                            url
                          }
                        }
                      }
                    }
                }
                details {
                    address
                    birthday
                    firstName
                    gender
                    id
                    imgDisplay
                    lastName
                    phoneNumber
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        let dataReturn = response.data.data.UpdateProfileUser as UserType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay =
                Backend_URL + dataReturn.details.imgDisplay;
        }
        return dataReturn;
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw error;
    }
}

export async function searchUserWithOptionApi(
    dto: SearchUserDto,
    token: string,
) {
    const query = `
        query SearchUserWithOption {
            SearchUserWithOption(
                SearchUser: {
                    address: ${dto.address ? `"${dto.address}"` : null}
                    birthday: ${dto.birthday ? `"${dto.birthday.toISOString()}"` : null}
                    count: ${dto.count !== undefined ? dto.count : null}
                    email: ${dto.email ? `"${dto.email}"` : null}
                    firstName: ${dto.firstName ? `"${dto.firstName}"` : null}
                    gender: ${dto.gender ? `"${dto.gender}"` : null}
                    index: ${dto.index !== undefined ? dto.index : null}
                    lastName: ${dto.lastName ? `"${dto.lastName}"` : null}
                    phoneNumber: ${dto.phoneNumber ? `"${dto.phoneNumber}"` : null}
                    role: ${dto.role ? `[${dto.role.map((role) => `"${role}"`).join(", ")}]` : null}
                    sort: ${dto.sort ? `"${dto.sort}"` : null}
                }
            ) {
                maxValue
                data {
                    created_at
                    email
                    heart
                    id
                    isDisplay
                    role
                    secretKey
                    updated_at
                    details {
                        address
                        birthday
                        firstName
                        gender
                        id
                        imgDisplay
                        lastName
                        phoneNumber
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const dataReturn = response.data.data.SearchUserWithOption;
        return { maxValue: dataReturn.Maxvalue, data: dataReturn.data };
    } catch (error) {
        console.error("Error searching user: ", error);
        throw error;
    }
}

export async function getAllSchemaProductApi(dto: null, token: null) {
    const query = `
    query GetAllSchemaProduct {
      GetAllSchemaProduct {
        category
        created_at
        id
        isDisplay
        name
        updated_at
        detail {
          id
          title
          attributes {
            id
            isUseForSearch
            value
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data.data.GetAllSchemaProduct as SchemaProductType[];
    } catch (error) {
        console.error("Error fetching schema products:", error);
        throw error;
    }
}

export async function getSchemaProductByName(dto: string, token: null) {
    const query = `
    query GetSchemaProductByName {
        GetSchemaProductByName(schemaProductName: "${dto}") {
        category
        created_at
        id
        isDisplay
        name
        updated_at
        detail {
          id
          title
          attributes {
            id
            isUseForSearch
            value
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data.data.GetSchemaProductByName as SchemaProductType;
    } catch (error) {
        console.error("Error fetching schema products:", error);
        throw error;
    }
}

export async function getSchemaProductByIdApi(
    schemaProductId: number,
    token: string,
) {
    const query = `
    query GetSchemaProductById {
      GetSchemaProductById(schemaProductId: ${schemaProductId}) {
        category
        created_at
        id
        isDisplay
        name
        updated_at
        detail {
          id
          title
          attributes {
            id
            isUseForSearch
            value
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data.data.GetSchemaProductById;
    } catch (error) {
        console.error("Error fetching schema product by ID:", error);
        throw error;
    }
}

export async function searchProductWithOptionsApi(dto: SearchProductDto, token: null) {
    const query = `
        query SearchProductWithOptions {
            SearchProductWithOptions(
                SearchProduct: {
                    name: ${dto.name ? `"${dto.name}"` : null}
                    category: ${dto.category ? `"${dto.category}"` : null}
                    rangeMoney: ${dto.rangeMoney ? `[${dto.rangeMoney.join(",")}]` : null}
                    brand: ${dto.brand ? `[${dto.brand.map(brand => `{ type: "${brand.type}", value: "${brand.value}" }`).join(",")}]` : null}
                    color: ${dto.color ? `[${dto.color.map(color => `{ type: "${color.type}", value: "${color.value}" }`).join(",")}]` : null}
                    attributes: ${dto.attributes ? `[${dto.attributes.map(attr => `{ type: "${attr.type}", value: "${attr.value}" }`).join(",")}]` : null}
                    index: ${dto.index ?? null}
                    count: ${dto.count ?? null}
                    sort: ${dto.sort ? `"${dto.sort}"` : null}
                    hotSales: ${dto.hotSales ? `"${dto.hotSales}"` : null}
                }
            ) {
                data {
                    buyCount
                    category
                    created_at
                    id
                    isDisplay
                    name
                    updated_at
                    details {
                        description
                        id
                        tutorial
                        attributes {
                            id
                            type
                            value
                        }
                        brand {
                            id
                            type
                            value
                        }
                        color {
                            colorHex
                            colorName
                            id
                        }
                        imgDisplay {
                            id
                            link
                            url
                        }
                        variants {
                            displayPrice
                            hasImei
                            id
                            imeiList
                            originPrice
                            stockQuantity
                            attributes {
                                id
                                type
                                value
                            }
                        }
                    }
                    faultyProduct {
                        created_at
                        id
                        imei
                        notes
                        quantity
                        reason
                        updated_at
                    }
                    reviews {
                        content
                        created_at
                        id
                        isDisplay
                        star
                        updated_at
                    }
                }
                maxValue
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.data.SearchProductWithOptions as SearchProductType;
    } catch (error) {
        console.error("Error searching products: ", error);
        throw error;
    }
}

export async function getTagsProductApi(dto: TagsProductDto, token: null) {
    const query =`
    query GetTagsProduct($tags: String) {
    GetTagsProduct(GetTagsProduct: {tags: $tags}) {
      id
      type
        value
    }
  }`
    ;

    const variables = {
        tags: dto.tags,
    };

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.data.data.GetTagsProduct as TagsDetailType[];
    } catch (error) {
        console.error("Error fetching tags product: ", error);
        throw error;
    }
}

export async function getProductByIdApi(productId: number, token: null) {
    const query = `
        query GetProductById {
            GetProductById(productId: ${productId ? `${productId}` : null}) {
                buyCount
                category
                created_at
                id
                isDisplay
                name
                updated_at
                details {
                    description
                    id
                    tutorial
                    attributes {
                        id
                        type
                        value
                    }
                    brand {
                        id
                        type
                        value
                    }
                    color {
                        colorHex
                        colorName
                        id
                    }
                    imgDisplay {
                        id
                        link
                        url
                    }
                    variants {
                        displayPrice
                        hasImei
                        id
                        imeiList
                        originPrice
                        stockQuantity
                        attributes {
                            id
                            type
                            value
                        }
                    }
                }
                reviews {
                    content
                    created_at
                    id
                    isDisplay
                    star
                    updated_at
                    user {
                        created_at
                        email
                        id
                        isDisplay
                        updated_at
                        details {
                            address
                            birthday
                            firstName
                            gender
                            id
                            imgDisplay
                            lastName
                            phoneNumber
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        let dataReturn = response.data.data.GetProductById as ProductType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay = dataReturn.details.imgDisplay.map(
                (img: { url: string }) => ({
                    ...img,
                    url: Backend_URL + img.url,
                } as ImageDetailType),
            );
        }
        return dataReturn;
    } catch (error) {
        console.error("Error fetching product: ", error);
        throw error;
    }
}
export async function getColorProductApi(dto: ColorDetailInp, token: null) {
    const query = `
    query GetColorProduct($colorHex: String, $colorName: String) {
      GetColorProduct(GetColorProduct: { colorHex: $colorHex, colorName: $colorName }) {
        colorHex
        colorName
        id
      }
    }
  `;

    const variables = {
        colorHex: dto.colorHex || null,
        colorName: dto.colorName || null,
    };

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.data.data.GetColorProduct as ColorDetailType[];
    } catch (error) {
        console.error("Error fetching color product: ", error);
        throw error;
    }
}


export async function updateCartApi(updateCartDto: UpdateCartDto, token: string) {
    const cartProductsQuery = updateCartDto.cartProducts
        .map(
            (product) => `
        {
          quantity: ${product.quantity},
          productId: ${product.productId},
          productVariantId: ${product.productVariantId}
        }`
        )
        .join(", ");

    const mutation = `
    mutation UpdateCart {
      UpdateCart(
        UpdateCart: {
          cartProducts: [${cartProductsQuery}]
        }
      ) {
        created_at
        id
        updated_at
        cartProducts {
          id
          quantity
          productVariant {
            displayPrice
            id
            attributes {
              id
              type
              value
            }
            stockQuantity
          }
          product {
            created_at
            id
            isDisplay
            name
            details {
              id
              brand {
                id
                type
                value
              }
              imgDisplay {
                id
                link
                url
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: mutation },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );


        return response.data.data.UpdateCart as CartType;
    } catch (error) {
        console.error("Error updating cart: ", error);
        throw error;
    }
}

export async function createOrderApi(createOrderDto: CreateOrderDto, token: string) {
    const customerInfoQuery = `
        email: ${createOrderDto.customerInfo.email ? `"${createOrderDto.customerInfo.email}"` : null},
        firstName: ${createOrderDto.customerInfo.firstName ? `"${createOrderDto.customerInfo.firstName}"` : null},
        lastName: ${createOrderDto.customerInfo.lastName ? `"${createOrderDto.customerInfo.lastName}"` : null},
        phoneNumber: ${createOrderDto.customerInfo.phoneNumber ? `"${createOrderDto.customerInfo.phoneNumber}"` : null}
    `;

    const deliveryInfoQuery = `
        deliveryType: ${createOrderDto.deliveryInfo.deliveryType ? `"${createOrderDto.deliveryInfo.deliveryType}"` : null},
        city: ${createOrderDto.deliveryInfo.city ? `"${createOrderDto.deliveryInfo.city}"` : null},
        district: ${createOrderDto.deliveryInfo.district ? `"${createOrderDto.deliveryInfo.district}"` : null},
        address: ${createOrderDto.deliveryInfo.address ? `"${createOrderDto.deliveryInfo.address}"` : null}
    `;

    const notesQuery = createOrderDto.notes ? `"${createOrderDto.notes}"` : null;

    const mutation = `
    mutation CreateOrder {
      CreateOrder(
        CreateOrder: {
          customerInfo: {
            ${customerInfoQuery}
          }
          deliveryInfo: {
            ${deliveryInfoQuery}
          }
          paymentType: "${createOrderDto.paymentType}"
          notes: ${notesQuery}
        }
      ) {
        created_at
        id
        isDisplay
        notes
        status
        totalAmount
        updated_at
        customerInfo {
          email
          firstName
          id
          lastName
          phoneNumber
          userId
        }
        deliveryInfo {
          address
          city
          deliveryFee
          deliveryType
          discount
          district
          id
        }
        paymentInfo {
          bank
          createdAt
          id
          isPaid
          paymentType
          updateAt
          trackId
        }
        orderProducts {
          discount
          id
          originPrice
          quantity
          unitPrice
          variantAttributes {
            id
            type
            value
          }
          product {
            isDisplay
            name
            updated_at
            created_at
            id
            details {
              id
              imgDisplay {
                id
                link
                url
              }
            }
          }
        }
        orderUid
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: mutation },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data.data.CreateOrder;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw error;
    }
}

export async function generateVnpayPaymentApi(
    dto: GenerateVnpayPaymentDto,
    token: string
) {

    const res = await fetch(Backend_URL + "/payment/create", {
        method: "POST",
        body: JSON.stringify({
            ...dto,
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status == 401) {
        return;
    }
    return await res.json() as GenerateVnpayPaymentResponse;
}
export async function createOtpApi(
    dto: CreateOtpDto,
    token: null
) {

    const res = await fetch(Backend_URL + "/auth/create-otp", {
        method: "POST",
        body: JSON.stringify({
            ...dto,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        return;
    }
    return await res.json() as RequestType;
}
export async function validateOtpApi(
    dto: VerifyOtpDto,
    token: null
) {

    const res = await fetch(Backend_URL + "/auth/validate-otp", {
        method: "POST",
        body: JSON.stringify({
            ...dto,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        return;
    }
    return await res.json() as RequestType;
}
export async function forgetPasswordApi(
    dto: ForgetPasswordDto,
    token: null
) {

    const res = await fetch(Backend_URL + "/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({
            ...dto,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        return;
    }
    return await res.json() as RequestType;
}
export async function getOrderApi(dto: GetOrderDto, token: null): Promise<OrderType> {
    const query = `
    query GetOrderById {
        GetOrderById(GetOrderById: { authId: "${dto.authId}", orderId: "${dto.orderId}" }) {
            created_at
            id
            isDisplay
            notes
            status
            totalAmount
            updated_at
            customerInfo {
              email
              firstName
              id
              lastName
              phoneNumber
              userId
            }
            deliveryInfo {
              address
              city
              deliveryFee
              deliveryType
              discount
              district
              id
            }
            paymentInfo {
              bank
              createdAt
              id
              isPaid
              paymentType
              updateAt
              trackId
            }
            orderProducts {
              discount
              id
              originPrice
              quantity
              unitPrice
              variantAttributes {
                id
                type
                value
              }
              product {
                isDisplay
                name
                updated_at
                created_at
                id
                details {
                  id
                  imgDisplay {
                    id
                    link
                    url
                  }
                }
              }
            }
            orderUid
        }
    }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data.data.GetOrderById as OrderType;
    } catch (error) {
        console.error("Error fetching order list by user: ", error);
        throw error;
    }
}

export async function getOrderListByUserApi(dto: null, token: string): Promise<OrderType[]> {
    const query = `
    query GetOrderListByUser {
        GetOrderListByUser {
            created_at
            id
            isDisplay
            notes
            status
            totalAmount
            updated_at
            customerInfo {
              email
              firstName
              id
              lastName
              phoneNumber
              userId
            }
            deliveryInfo {
              address
              city
              deliveryFee
              deliveryType
              discount
              district
              id
            }
            paymentInfo {
              bank
              createdAt
              id
              isPaid
              paymentType
              updateAt
              trackId
            }
            orderProducts {
              discount
              id
              originPrice
              quantity
              unitPrice
              variantAttributes {
                id
                type
                value
              }
              product {
                isDisplay
                name
                updated_at
                created_at
                id
                details {
                  id
                  imgDisplay {
                    id
                    link
                    url
                  }
                }
              }
            }
            orderUid
        }
    }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data.data.GetOrderListByUser as OrderType[];
    } catch (error) {
        console.error("Error fetching order list by user: ", error);
        throw error;
    }
}

export async function updateHeartApi(heartArray: number[], token: string) {
    const mutation = `
    mutation UpdateHeart($heart: [Float!]!) {
      UpdateHeart(UpdateHeart: { heart: $heart }) {
        created_at
        email
        id
        isDisplay
        refreshToken
        role
        secretKey
        updated_at
        details {
            address
            birthday
            firstName
            gender
            id
            imgDisplay
            lastName
            phoneNumber
        }
        heart
        cart {
            created_at
            id
            updated_at
            cartProducts {
              id
              quantity
              productVariant {
                displayPrice
                id
                attributes {
                  id
                  type
                  value
                }
                stockQuantity
              }
              product {
                created_at
                id
                isDisplay
                name
                details {
                  id
                  brand {
                    id
                    type
                    value
                  }
                  imgDisplay {
                    id
                    link
                    url
                  }
                }
              }
            }
        }
      }
    }
  `;

    const variables = {
        heart: heartArray,
    };

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: mutation,
                variables,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data.data.UpdateHeart as UserType;
    } catch (error) {
        console.error("Error updating heart: ", error);
        throw error;
    }
}
export async function getListProductByIdApi(productIds: number[], token: null) {
    const query = `
    query GetListProductById($products: [Float!]!) {
      GetListProductById(GetListProductById: { products: $products }) {
        buyCount
        category
        created_at
        id
        isDisplay
        name
        updated_at
        details {
            description
            id
            tutorial
            attributes {
                id
                type
                value
            }
            brand {
                id
                type
                value
            }
            color {
                colorHex
                colorName
                id
            }
            imgDisplay {
                id
                link
                url
            }
            variants {
                displayPrice
                hasImei
                id
                imeiList
                originPrice
                stockQuantity
                attributes {
                    id
                    type
                    value
                }
            }
        }
        faultyProduct {
            created_at
            id
            imei
            notes
            quantity
            reason
            updated_at
        }
        reviews {
            content
            created_at
            id
            isDisplay
            star
            updated_at
        }
      }
    }
  `;

    const variables = {
        products: productIds,
    };

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query,
                variables,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data.data.GetListProductById as ProductType[];
    } catch (error) {
        console.error("Error fetching product list: ", error);
        throw error;
    }
}
