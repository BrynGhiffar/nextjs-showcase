export type ClassData = {
    "class_id": string,
    "lecturer_id": string,
    "name": string,
    "semester": string,
    "year": string,
    "class_code": string,
    "course_code": string,
    "projects": string[]
};

export const EMPTY_CLASS_DATA = {
    "class_id": "",
    "lecturer_id": "",
    "name": "",
    "semester": "",
    "year": "",
    "class_code": "",
    "course_code": "",
    "projects": []
};

export type CreateClassResponse={
    message: string
    classes: ClassData | null
};

export type FindClassByIdResponse={
    message: string
    classes: ClassData | null
};

export type UpdateClassResponse={
    message: string
    classes: ClassData | null
};

export type FindClassByLecturerIdResponse={
    message: string
    classes: ClassData[] | null
};

export async function create_class(USERSERVICE_HOST: string, classData: ClassData): Promise<CreateClassResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(classData);

    var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: CreateClassResponse = 
        await fetch(`${USERSERVICE_HOST}/service/classes/v1/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as CreateClassResponse)
            .catch(error => error);
    return res;
}

export async function find_class_by_id(USERSERVICE_HOST: string, class_id: string): Promise<FindClassByIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res =
        await fetch(`${USERSERVICE_HOST}/service/classes/v1/${class_id}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindClassByIdResponse)
            .catch(error => error);
    return res;
}

export async function find_class_by_lecturer_id(USERSERVICE_HOST: string, lecturer_id: string): Promise<FindClassByLecturerIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res =
        await fetch(`${USERSERVICE_HOST}/service/classes/v1/${lecturer_id}/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindClassByLecturerIdResponse)
            .catch(error => error);
    return res;
}

export async function updateclass(USERSERVICE_HOST: string, class_id: string, classData: ClassData): Promise<UpdateClassResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(classData);
    console.log(raw);

    var requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: UpdateClassResponse =
        await fetch(`${USERSERVICE_HOST}/service/classes/v1/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as UpdateClassResponse)
            .catch(error => error);
    return res;

}