const HOST = "http://localhost:8001";

export type ProjectData = {
    "project_id": string,
    "class_id": string,
    "name": string,
    "members": string[],
    "poster_image": string,
    "report": string,
    "short_description": string,
    "description": string,
    "youtube_link": string,
    "github_link": string
};

export type CreateProjectResponse = {
    message: string,
    project: ProjectData | null
};

export type FindProjectsByUserIdResponse = {
    message: string,
    projects: ProjectData[] | null
};

export async function create_project(projectData: ProjectData): Promise<CreateProjectResponse> {
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
        await fetch(`${HOST}/service/project/v1/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as CreateProjectResponse)
            .catch(error => error);
    return res;
}

export async function find_projects_by_user_id(user_id: string): Promise<FindProjectsByUserIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res =
        await fetch(`${HOST}/service/project/v1/user/${user_id}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindProjectsByUserIdResponse)
            .catch(error => error);
    return res;
    
}