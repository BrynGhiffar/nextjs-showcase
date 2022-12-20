import { type } from "os";
import { COMMENTSERVICE_HOST } from "../env";
const HOST = COMMENTSERVICE_HOST;

export type CommentData = {
    "comment_id": string,
    "date_time": Date,
    "comment" : string,
    "user_id": string,
    "project_id": string,

}

export type EMPTY_COMMENT_DATA = {
    "comment_id": "",
    "date_time": "",
    "comment" : "",
    "user_id": "",
    "project_id":"",

}

export type CreateCommentResponse = {
    message: string,
    comment: CommentData | null
};

export type FindCommentByProjectIdResponse = {
    message: string,
    comments: CommentData[] | null
};

export async function create_comment(commentData: CommentData): Promise<CreateCommentResponse> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(commentData);

    var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res: CreateCommentResponse = 
        await fetch(`${HOST}/service/comment/v1/`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as CreateCommentResponse)
            .catch(error => error);
    return res;
}

export async function find_comment_by_project_id(project_id: string): Promise<FindCommentByProjectIdResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const res =
        await fetch(`${HOST}/service/comment/v1/project/${project_id}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result) as FindCommentByProjectIdResponse)
            .catch(error => error);
    return res;
}
