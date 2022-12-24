import { USERSERVICE_HOST } from "../env";

const HOST = USERSERVICE_HOST;

export type UpdateUserDescriptionRequest = {
    user_id: string,
    description: string
};

export type UpdateUserDescriptionResponse = {
    message: string,
    user: UserData
};

export type FindUserByProviderResponse = {
    message: string,
    user: UserData
};

export type CreateMsftUserResponse = {
    message: string,
    user: UserData
}

export type FindUserByIdResponse = {
    message: string,
    user: UserData
}

export type FindAllUserResponse = {
    message: string,
    users: UserData[]
}

export type UpdateUserResponse = {
    message: string,
    user: UserData
}

export type UserData = {
    "user_id": string,
    "provider_id": string,
    "provider": string,
    "name": string,
    "email": string,
    "description": string,
    "profile_pic": string,
    "graduation_year": string,
    "current_semester": string,
    "role": string,
    "classes": string[]
    
};

export const EMPTY_USER_DATA: UserData = {
    "user_id": "",
    "provider_id": "",
    "provider": "",
    "name": "",
    "email": "",
    "description": "",
    "profile_pic": "",
    "graduation_year": "",
    "current_semester": "",
    "role": "",
    "classes": []
};

export async function updateDescription(user_id: string, new_description: string): Promise<UpdateUserDescriptionResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "user_id": user_id,
        "description": new_description
    });
    console.log(raw);

    var requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: UpdateUserDescriptionResponse =
        await fetch(`${HOST}/service/user/v1/description`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as UpdateUserDescriptionResponse)
            .catch(error => error);
    return res;

}

export async function createUser(providerId: string, useremail: string, username: string): Promise<CreateMsftUserResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "provider_id": providerId,
        "provider": "MSFT",
        "name": username,
        "email": useremail,
        "profile_pic": "",
        "graduation_year": "2025",
        "current_semester": "3",
        "role": "",
        "classes": []
    });

    var requestOptions : RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res : CreateMsftUserResponse = await fetch(`${HOST}/service/user/v1`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => error);
    return res;
}

export async function findCreateUserMsftProviderId(providerId: string, username: string, useremail: string): Promise<FindUserByIdResponse>{
    const res = await findUserByMsftProvider("MSFT", providerId);
    console.log("find result", res);
    if (res.user === null){
        const res_create = await createUser(providerId, useremail, username);
        console.log("create result", res_create);
        return res_create;
    }
    else{
        return res;
    }

}
export async function findUserById(user_id: string): Promise<FindUserByIdResponse> {
    var requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindUserByIdResponse =
        await fetch(`${HOST}/service/user/v1/${user_id}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindUserByIdResponse)
            .catch(error => error);
    return res;

}

export async function findUserByMsftProvider(provider: string, providerId: string): Promise<FindUserByProviderResponse> {

    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindUserByProviderResponse =
        await fetch(`${HOST}/service/user/v1/${provider}/${providerId}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as UserData)
            .catch(error => error);
    return res;
}

export async function findAllUser(): Promise<FindAllUserResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindAllUserResponse = await fetch(`${HOST}/service/user/v1/`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => error);
    return res;
}

export async function updateUser(userData:UserData): Promise<UpdateUserResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(userData);

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: UpdateUserResponse = await fetch(`${HOST}/service/user/v1/`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => error);
    return res;
}

