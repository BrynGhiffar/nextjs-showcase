export type ProjectDataFile = {
    name: string,
    base64: string,
    ext: string,
    size: string
};

export type ProjectData = {
    "project_id": string,
    "class_id": string,
    "name": string,
    "members": string[],
    "poster_image": ProjectDataFile,
    "report": ProjectDataFile,
    "short_description": string,
    "description": string,
    "youtube_link": string,
    "github_link": string,
    "grade": number,
    "lecturer_id": string,
    "lecturer_comment": string
};

export const EMPTY_PROJECT_DATA_FILE = {
    name: "",
    base64: "",
    ext: "",
    size: ""
};

export const EMPTY_PROJECT_DATA = {
    "project_id": "",
    "class_id": "",
    "name": "",
    "members": [],
    "poster_image": EMPTY_PROJECT_DATA_FILE,
    "report": EMPTY_PROJECT_DATA_FILE,
    "short_description": "",
    "description": "",
    "youtube_link": "",
    "github_link": "",
    "grade": 0,
    "lecturer_id": "",
    "lecturer_comment": ""
};

export type CreateProjectResponse = {
    message: string,
    project: ProjectData | null
};

export type FindProjectsByUserIdResponse = {
    message: string,
    projects: ProjectData[] | null
};

export type FindProjectByProjectIdResponse = {
    message: string,
    project: ProjectData | null
};

export type FindAllProjectsResponse = {
    message: string,
    projects: ProjectData[] | null
};

export type FindProjectsByNameResponse = {
    messaeg: string,
    projects: ProjectData[] | null
}


export async function create_project(PROJECRSERVICE_HOST: string, projectData: ProjectData): Promise<CreateProjectResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(projectData);

    var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: CreateProjectResponse = 
        await fetch(`${PROJECRSERVICE_HOST}/service/project/v1/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as CreateProjectResponse)
            .catch(error => error);
    return res;
}

export async function find_projects_by_user_id(PROJECRSERVICE_HOST: string, user_id: string): Promise<FindProjectsByUserIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res =
        await fetch(`${PROJECRSERVICE_HOST}/service/project/v1/user/${user_id}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindProjectsByUserIdResponse)
            .catch(error => error);
    return res;
}

export async function find_project_by_project_id(PROJECTSERVICE_HOST: string, project_id: string): Promise<FindProjectByProjectIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindProjectByProjectIdResponse = await fetch(`${PROJECTSERVICE_HOST}/service/project/v1/${project_id}`, requestOptions)
                    .then(response => response.text())
                    .then(result => JSON.parse(result))
                    .catch(error => error);
    return res;
}

export async function find_all_projects(PROJECTSERVICE_HOST: string): Promise<FindAllProjectsResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res: FindAllProjectsResponse = await fetch(`${PROJECTSERVICE_HOST}/service/project/v1/`, requestOptions)
                    .then(response => response.text())
                    .then(result => JSON.parse(result))
                    .catch(error => error);
    return res;
}


export async function find_project_by_name(PROJECTSERVICE_HOST: string, project_title: string, page: number, projects_per_page: number): Promise<FindProjectsByNameResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const name: string = encodeURIComponent(project_title);

    const res: FindProjectsByNameResponse = await fetch(`${PROJECTSERVICE_HOST}/service/project/v1/project/?project_title=${name}&page=${page}&projects_per_page=${projects_per_page}`, requestOptions)
                    .then(response => response.text())
                    .then(result => JSON.parse(result))
                    .catch(error => error);
    return res;
}