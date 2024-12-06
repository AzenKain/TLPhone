import axios from 'axios';
import { Backend_URL } from "./Constants";
import { SignUpDto } from "./dtos/auth";
import {SchemaProductType, SearchProductType, TagsDetailType, UserType} from "@/types";
import {SearchUserDto, UpdateProfileDto } from "@/lib/dtos/user";
import {SearchProductDto, TagsProductDto} from "@/lib/dtos/Product";


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
                        product {
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
                                attributes {
                                    id
                                    type
                                    value
                                }
                                variants {
                                    displayPrice
                                    id
                                    stockQuantity
                                    attributes {
                                        id
                                        type
                                        value
                                    }
                                }
                            }
                        }
                        productVariant {
                            displayPrice
                            id
                            stockQuantity
                            attributes {
                                id
                                type
                                value
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
        return dataReturn;
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
                    id
                    updated_at
                    cartProducts {
                        id
                        quantity
                        product {
                            buyCount
                            category
                            created_at
                            id
                            isDisplay
                            name
                            updated_at
                        }
                        productVariant {
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
                    created_at
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

export async function getAllSchemaProductApi(dto: null, token: string) {
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