import axios from "axios";
import {
  ColorDetailType, OrderType,
  ProductType,
  SchemaProductType,
  SearchOrderResponse,
  SearchProductType,
  TagsDetailType,
  UserType
} from "@/types";
import { Backend_URL } from "./Constants";
import { SignUpDto } from "./dtos/auth";
import { SearchUserDto, UpdateProfileDto, UpdateRoleDto } from "./dtos/user";
import {
  CreateSchemaProductDto,
  DeleteSchemaProductDto,
  UpdateSchemaProductDto,
} from "@/lib/dtos/schema";
import {
  ColorDetailInp,
  CreateProductDto,
  DeleteProductDto,
  SearchProductDto,
  TagsProductDto,
  UpdateProductDto
} from "@/lib/dtos/Product";
import { ConfirmOrderDto, SearchOrderDto, UpdateOrderDto } from "@/lib/dtos/order";

async function refreshTokenApi(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(Backend_URL + "/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
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

export async function makeRequestApi(
  callback: Function,
  dto: any,
  refreshToken: string | undefined,
  accessToken: string | undefined,
) {
  try {
    if (accessToken == undefined) return null;
    const data = await callback(dto, accessToken);

    if (data == null && refreshToken !== undefined) {
      const newAccessToken = await refreshTokenApi(refreshToken);

      if (newAccessToken) {
        return await callback(dto, newAccessToken);
      } else {
        console.log("Unauthorized!");
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
export async function updateRoleUserApi(dto: UpdateRoleDto, token: string) {
  const query = `
        mutation UpdateRoleUser {
            UpdateRoleUser(
                UpdateRole: { 
                    role: ${dto.role ? `[${dto.role.map((role) => `"${role}"`).join(", ")}]` : null}, 
                    userId: ${dto.userId ? `"${dto.userId}"` : null} 
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
    return response.data.data.UpdateRoleUser as UserType;
  } catch (error) {
    console.error("Error searching user: ", error);
    throw error;
  }
}

export async function createSchemaProductApi(
  dto: CreateSchemaProductDto,
  token: string,
) {
  const query = `
  mutation CreateSchemaProduct {
    CreateSchemaProduct(
      CreateSchemaProduct: { 
        category: ${dto.category ? `"${dto.category}"` : null}, 
        name: ${dto.name ? `"${dto.name}"` : null}, 
        detail: ${
          Array.isArray(dto.detail) && dto.detail.length > 0
            ? `[${dto.detail
                .map(
                  (detailItem) => `{
          title: "${detailItem.title}",
          attributes: ${
            Array.isArray(detailItem.attributes) &&
            detailItem.attributes.length > 0
              ? `[${detailItem.attributes
                  .map(
                    (attr) => `{
            isUseForSearch: ${attr.isUseForSearch},
            value: "${attr.value}"
          }`,
                  )
                  .join(", ")}]`
              : null
          }
        }`,
                )
                .join(", ")}]`
            : null
        }
      }
    ) {
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
    return response.data.data.CreateSchemaProduct as SchemaProductType;
  } catch (error) {
    console.error("Error creating schema product:", error);
    throw error;
  }
}

export async function updateSchemaProductApi(
  dto: UpdateSchemaProductDto,
  token: string,
) {
  const query = `
  mutation UpdateSchemaProduct {
    UpdateSchemaProduct(
      UpdateSchemaProduct: { 
        category: ${dto.category ? `"${dto.category}"` : null}, 
        name: ${dto.name ? `"${dto.name}"` : null}, 
        schemaId: ${dto.schemaId ? `${dto.schemaId}` : null}, 
        detail: ${
          Array.isArray(dto.detail) && dto.detail.length > 0
            ? `[${dto.detail
                .map(
                  (detailItem) => `{
          title: "${detailItem.title}",
          attributes: ${
            Array.isArray(detailItem.attributes) &&
            detailItem.attributes.length > 0
              ? `[${detailItem.attributes
                  .map(
                    (attr) => `{
            isUseForSearch: ${attr.isUseForSearch},
            value: "${attr.value}"
          }`,
                  )
                  .join(", ")}]`
              : null
          }
        }`,
                )
                .join(", ")}]`
            : null
        }
      }
    ) {
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
    return response.data.data.UpdateSchemaProduct as SchemaProductType;
  } catch (error) {
    console.error("Error updating schema product:", error);
    throw error;
  }
}

export async function deleteSchemaProductApi(
  dto: DeleteSchemaProductDto,
  token: string,
) {
  const query = `
    mutation DeleteSchemaProduct {
      DeleteSchemaProduct(
        DeleteSchemaProduct: { 
          schemaId: ${dto.schemaId ? dto.schemaId : null} 
        }
      ) {
        message
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
    return response.data.data.DeleteSchemaProduct.message as string;
  } catch (error) {
    console.error("Error deleting schema product:", error);
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
  token: null,
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

export async function createProductApi(
  dto: CreateProductDto,
  token: string,
) {
  const query = `
    mutation CreateProduct {
      CreateProduct(
        CreateProduct: {
          name: ${dto.name ? `"${dto.name}"` : null}
          category: ${dto.category ? `"${dto.category}"` : null}
          details: {
            description: ${dto.details?.description ? `"${dto.details.description}"` : null}
            tutorial: ${dto.details?.tutorial ? `"${dto.details.tutorial}"` : null}
            color: ${dto.details?.color ? `[${dto.details.color.map(c => `{ colorName: "${c.colorName}", colorHex: "${c.colorHex}" }`).join(", ")}]` : null}
            imgDisplay: ${dto.details?.imgDisplay ? `[${dto.details.imgDisplay.map(i => `{ url: "${i.url || ''}", link: [${i.link?.map(l => `"${l}"`).join(", ") || ''}] }`).join(", ")}]` : null}
            variants: ${dto.details?.variants ? `[${dto.details.variants.map(v => `{
              originPrice: ${v.originPrice}
              displayPrice: ${v.displayPrice}
              stockQuantity: ${v.stockQuantity}
              hasImei: ${v.hasImei}
              imeiList: ${v.imeiList ? `[${v.imeiList.map(i => `"${i}"`).join(", ")}]` : null}
              attributes: ${v.attributes ? `[${v.attributes.map(a => `{ type: "${a.type}", value: "${a.value}" }`).join(", ")}]` : null}
            }`).join(", ")}]` : null}
            brand: ${dto.details?.brand ? `{ type: "${dto.details.brand.type}", value: "${dto.details.brand.value}" }` : null}
            attributes: ${dto.details?.attributes ? `[${dto.details.attributes.map(a => `{ type: "${a.type}", value: "${a.value}" }`).join(", ")}]` : null}
          }
        }
      ) {
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
    return response.data.data.CreateProduct as ProductType;
  } catch (error) {
    console.error("Error creating product: ", error);
    throw error;
  }
}


export async function updateProductApi(
  dto: UpdateProductDto,
  token: string,
) {
  const query = `
    mutation UpdateProduct {
      UpdateProduct(
        UpdateProduct: {
          productId: ${dto.productId ? dto.productId : null}
          name: ${dto.name ? `"${dto.name}"` : null}
          category: ${dto.category ? `"${dto.category}"` : null}
          buyCount: ${dto.buyCount ? dto.buyCount : null}
          details: {
            description: ${dto.details?.description ? `"${dto.details.description}"` : null}
            tutorial: ${dto.details?.tutorial ? `"${dto.details.tutorial}"` : null}
            color: ${dto.details?.color ? `[${dto.details.color.map(c => `{ colorName: "${c.colorName}", colorHex: "${c.colorHex}" }`).join(", ")}]` : null}
            imgDisplay: ${dto.details?.imgDisplay ? `[${dto.details.imgDisplay.map(i => `{ url: "${i.url}", link: [${i.link ? i.link.map(l => `"${l}"`).join(", ") : ""}] }`).join(", ")}]` : null}
            variants: ${dto.details?.variants ? `[${dto.details.variants.map(v => `{
              originPrice: ${v.originPrice}
              displayPrice: ${v.displayPrice}
              stockQuantity: ${v.stockQuantity}
              hasImei: ${v.hasImei}
              imeiList: ${v.imeiList ? `[${v.imeiList.map(i => `"${i}"`).join(", ")}]` : null}
              attributes: ${v.attributes ? `[${v.attributes.map(a => `{ type: "${a.type}", value: "${a.value}" }`).join(", ")}]` : null}
            }`).join(", ")}]` : null}
            brand: ${dto.details?.brand ? `{ type: "${dto.details.brand.type}", value: "${dto.details.brand.value}" }` : null}
            attributes: ${dto.details?.attributes ? `[${dto.details.attributes.map(a => `{ type: "${a.type}", value: "${a.value}" }`).join(", ")}]` : null}
          }
        }
      ) {
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
    return response.data.data.UpdateProduct as ProductType;
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
}
export async function deleteProductApi(
  dto: DeleteProductDto,
  token: string,
) {
  const query = `
    mutation DeleteProduct {
      DeleteProduct(DeleteProduct: { productId: ${dto.productId ? dto.productId : null} }) {
        message
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
    return response.data.data.DeleteProduct as ResponseType;
  } catch (error) {
    console.error("Error deleting product: ", error);
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
export async function uploadFile(data: File, token: string) {
  try {
    const formData = new FormData();
    formData.append('file', data);
    const response = await axios.post(Backend_URL + '/media/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status != 201) {
      return null
    }

    return '/media' + response.data['url'];

  } catch (error: any) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}


export async function searchOrderWithOptionApi(
  searchOrderDto: SearchOrderDto,
  token: string
): Promise<SearchOrderResponse> {

  const query = `
    query SearchOrderWithOption {
      SearchOrderWithOption(
        SearchOrder: {
            index: ${searchOrderDto.index ?? null}
            count: ${searchOrderDto.count ?? null}
            orderId: ${searchOrderDto.orderId ? `"${searchOrderDto.orderId}"` : null}
            lastName: ${searchOrderDto.lastName ? `"${searchOrderDto.lastName}"` : null}
            phoneNumber: ${searchOrderDto.phoneNumber ? `"${searchOrderDto.phoneNumber}"` : null}
            rangeMoney: ${searchOrderDto.rangeMoney ? `[${searchOrderDto.rangeMoney.join(", ")}]` : null}
            sort: ${searchOrderDto.sort ? `"${searchOrderDto.sort}"` : null}
            status: ${searchOrderDto.status ? `"${searchOrderDto.status}"` : null}
            firstName: ${searchOrderDto.firstName ? `"${searchOrderDto.firstName}"` : null}
            email: ${searchOrderDto.email ? `"${searchOrderDto.email}"` : null}
        }
      ) {
        maxValue
        data {
            created_at
            id
            isDisplay
            notes
            orderUid
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
            statusHistory {
                createdAt
                id
                newStatus
                previousStatus
                user {
                    created_at
                    refreshToken
                    role
                    updated_at
                    id
                    isDisplay
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
            paymentInfo {
                bank
                createdAt
                id
                isPaid
                paymentType
                trackId
                updateAt
            }
            orderProducts {
                discount
                hasImei
                id
                imei
                originPrice
                quantity
                unitPrice
                variantAttributes {
                    id
                    type
                    value
                }
                productVariant {
                    displayPrice
                    hasImei
                    id
                    imeiList
                    originPrice
                    stockQuantity
                }
                product {
                    buyCount
                    category
                    created_at
                    id
                    isDisplay
                    name
                    updated_at

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
      }
    );

    return response.data.data.SearchOrderWithOption as SearchOrderResponse;
  } catch (error) {
    console.error("Error searching order with option: ", error);
    throw error;
  }
}

export async function confirmOrderApi(
  confirmOrderDto: ConfirmOrderDto,
  token: string
): Promise<OrderType> {
  const orderListQuery = confirmOrderDto.orderList
    .map(
      (order) => `
        {
          imei: ${order.imei ? `[${order.imei.map((i) => `"${i}"`).join(", ")}]` : null},
          orderProductId: ${order.orderProductId ?? null}
        }`
    )
    .join(", ");

  const query = `
    mutation ConfirmOrder {
      ConfirmOrder(
        ConfirmOrder: {
          orderList: [${orderListQuery}],
          orderId: ${confirmOrderDto.orderId ?? null}
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
            statusHistory {
                createdAt
                id
                newStatus
                previousStatus
                user {
                    created_at
                    refreshToken
                    role
                    updated_at
                    id
                    isDisplay
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
      }
    );

    return response.data.data.ConfirmOrder as OrderType;
  } catch (error) {
    console.error("Error confirming order: ", error);
    throw error;
  }
}

export async function updateOrderApi(
  updateOrderDto: UpdateOrderDto,
  token: string
): Promise<OrderType> {
  const query = `
    mutation UpdateOrder {
      UpdateOrder(
        UpdateOrder: {
          isPaid: ${updateOrderDto.isPaid ?? null},
          orderId: ${updateOrderDto.orderId ?? null}
          status: ${updateOrderDto.status ? `"${updateOrderDto.status}"` : null}
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
            statusHistory {
                createdAt
                id
                newStatus
                previousStatus
                user {
                    created_at
                    refreshToken
                    role
                    updated_at
                    id
                    isDisplay
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
      }
    );

    return response.data.data.UpdateOrder as OrderType;
  } catch (error) {
    console.error("Error updating order: ", error);
    throw error;
  }
}