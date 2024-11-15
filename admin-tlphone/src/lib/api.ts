import axios from 'axios';
import { UserType } from "@/types";
import { Backend_URL } from "./Constants";
import { SignUpDto } from "./dtos/auth";
import { UpdateProfileDto } from "./dtos/user";


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
            ...dto
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        console.log(res.statusText);
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
          }
        );

        let dataReturn = response.data.data.GetUserById as UserType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay = Backend_URL + dataReturn.details.imgDisplay;
        }
        return dataReturn;
    } catch (error) {
        console.error('Error fetching user: ', error);
        throw error;
    }
}



export async function updateUserProfileApi(dto: UpdateProfileDto, token: string) {
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
          }
        );
        let dataReturn = response.data.data.UpdateProfileUser as UserType;
        if (dataReturn?.details?.imgDisplay) {
            dataReturn.details.imgDisplay = Backend_URL + dataReturn.details.imgDisplay;
        }
        return dataReturn
    } catch (error) {
        console.error('Error updating user profile: ', error);
        throw error;
    }
}
