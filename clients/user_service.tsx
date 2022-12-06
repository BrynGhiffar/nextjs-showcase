
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

export type FindUserByIdResponse = {
    message: string,
    user: UserData
}

export type FindAllUserResponse = {
    message: string,
    users: UserData[]
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
    "current_semester": string
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
    "current_semester": ""
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
                await fetch("http://localhost:8000/service/user/v1/description", requestOptions)
                    .then(response => response.text())
                    .then(result => JSON.parse(result) as UpdateUserDescriptionResponse)
                    .catch(error => error);
    return res;
    
}

export async function findUserById(user_id: string): Promise<FindUserByIdResponse> {
    var requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindUserByIdResponse = 
        await fetch(`http://localhost:8000/service/user/v1/${user_id}`, requestOptions)
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
            await fetch(`http://localhost:8000/service/user/v1/${provider}/${providerId}`, requestOptions)
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

    const res : FindAllUserResponse = await fetch("http://localhost:8000/service/user/v1/", requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => error);
    return res;
}
