import Navbar from "../../components/navbar";
import style from "../../styles/poster.create.module.scss";
import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { Alert, ButtonGroup, Icon, Snackbar, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AddAPhotoOutlined from "@mui/icons-material/AddAPhotoOutlined"
import { AddBoxOutlined } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import { create_project, EMPTY_PROJECT_DATA_FILE, find_projects_by_user_id, ProjectData, ProjectDataFile } from "../../clients/project_service";
import { useRouter } from "next/router";
import { findAllUser, findUserByMsftProvider } from "../../clients/user_service";
import { extractBase64, toBase64 } from "../../utility/base64";
import { useMsal } from "@azure/msal-react";
import { getCurrentUserId } from "../../clients/azure_client";
import { fetch_readme } from "../../clients/github_client";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);


type Member = {
    "id": string,
    "name": string
};

type Project = {
    "name": string,
    "short_description": string,
    "description": string,
    "youtube_link": string,
    "github_link": string,
    "poster_image": ProjectDataFile | null,
    "members": Member[],
    "report": ProjectDataFile | null,
}

const contributors: Member[] = [
    {
        "id": "1",
        "name": "John Doe"
    },
    {
        "id": "2",
        "name": "Larry Doe"
    },
    {
        "id": "3",
        "name": "James Doe"
    },
    {
        "id": "4",
        "name": "Tres Doe"
    },
]

const EMPTY_PROJECT: Project = {
    "name" : "",
    "short_description": "",
    "description": "",
    "youtube_link": "",
    "github_link": "",
    "poster_image": null,
    "members": [],
    "report": null
}

type ProjectSetter = Dispatch<SetStateAction<Project>>

type ProjectInformationProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>> }

function ProjectInformation({current_project, set_project} : ProjectInformationProps) {

    const [github_link, set_github_link] = useState<string>("");

    const set_project_name = (set_project: ProjectSetter, new_name: string) => {
        set_project(project => {
            return { ...project, name: new_name };
        });
    };
    
    const set_project_description = (set_project: ProjectSetter, new_description: string | undefined) => {
        set_project(project => {
            if (new_description == undefined)
                return project;
            return { ...project, description: new_description };
        });
    };

    const set_project_short_description = (set_project: ProjectSetter, new_short_description: string | undefined) => {
        set_project(project => {
            if (new_short_description === undefined) {
                return project;
            }
            return { ...project, short_description: new_short_description};
        })
    };

    const project_name = current_project.name;
    const project_description = current_project.description;
    const project_short_description = current_project.short_description;
    const [usingReadme, setUsingReadme] = useState(false);
    return (
        <>
            <div>
                <h2>Project Information</h2>

                <div>
                    <TextField label="Project Name" variant="outlined" value={project_name} fullWidth onChange={e => {
                        const value = e.target.value;
                        set_project_name(set_project, value);
                    }}/>
                </div>
                <h3>Project Description</h3>
                <div>
                    <TextField label="One Sentence Description of Project" variant="outlined" value={project_short_description} fullWidth onChange={e => {
                        const value = e.target.value;
                        set_project_short_description(set_project, value);
                    }}/>
                </div>
                <Switch value={usingReadme} onClick={_ => setUsingReadme(uReadme => !uReadme)}/> <span>Use GitHub readme.md file</span>
                <div>
                    {
                        usingReadme ?
                        <>
                            <TextField label="GitHub Link" variant="outlined" margin="normal" fullWidth value={github_link} onChange={e => {
                                const { value } = e.target;
                                set_github_link(value);
                            }}/>
                            <Button variant="outlined" style={{marginBottom: "20px"}} onClick={async () => {
                                const readme = await fetch_readme(github_link);
                                set_project_description(set_project, readme);
                            }}>PULL</Button>
                        </> : ""
                    }

                    <MDEditor value={project_description} onChange={v => set_project_description(set_project, v)} height={500}/>
                </div>
            </div>
        </>
    )
}

type LinkUploadProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>>, set_is_loading: SetIsLoading };

function LinkUpload({ current_project, set_project, set_is_loading } : LinkUploadProps ) {

    
    const set_project_youtube_link = (set_project: ProjectSetter, new_youtube_link: string) => {
        set_project(project => {
            return { ...project, youtube_link: new_youtube_link };
        });
    };

    const set_project_github_link = (set_project: ProjectSetter, new_github_link: string) => {
        set_project(project => {
            if (new_github_link == undefined)
                return project;
            return { ...project, github_link: new_github_link };
        });
    };

    const set_project_poster = (set_project: ProjectSetter, filename: string, base64: string, size: number) => {
        set_project(project => {
            if (base64 === undefined) {
                return project;
            }
            const splitted = filename.split(".");
            const ext = splitted[splitted.length - 1];
            const name = splitted.slice(0, splitted.length - 1).join(".");
            const kb: number = 1024;
            const mb: number = 1024 * kb;
            let fileSize: string = `0 kb`;
            if (size >= mb) {
                fileSize = `${Math.floor(size / mb * 100) / 100} mb`;
            } else if (size >= kb) {
                fileSize = `${Math.floor(size / kb * 100) / 100} kb`;
            } else {
                fileSize = `${size} b`;
            }
            return { ...project, poster_image: {name, ext, base64, size: fileSize} };
        });
    };

    const set_empty_project_poster = () => {
        set_project(project => ({ ...project, poster_image: null }));
    };

    const set_project_report = (set_project: ProjectSetter, filename: string, base64: string, size: number) => {
        set_project(project => {
            if (base64 === undefined) {
                return project;
            }
            const splitted = filename.split(".");
            const ext = splitted[splitted.length - 1];
            const name = splitted.slice(0, splitted.length - 1).join(".");
            const kb: number = 1024;
            const mb: number = 1024 * kb;
            let fileSize: string = `0 kb`;
            if (size >= mb) {
                fileSize = `${Math.floor(size / mb * 100) / 100} mb`;
            } else if (size >= kb) {
                fileSize = `${Math.floor(size / kb * 100) / 100} kb`;
            } else {
                fileSize = `${size} b`;
            }
            return { ...project, report: {name, ext, base64, size: fileSize} };
        });
    };

    const set_empty_project_report = () => {
        set_project(project => ({...project, report: null}));
    }

    const delete_poster_name = (name: string, ext: string) => {
        const full = name + "." + ext;
        const max_length = 15;
        if (full.length > max_length) {
            return full.substring(0, max_length) + "...";
        } else {
            return full;
        }
    };
    const [open_file_upload_success, set_open_file_upload_success] = useState<boolean>(false);

    const handle_file_upload_success_snackbar_close = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        };
        set_open_file_upload_success(false);
    }

    const youtube_link = current_project.youtube_link;
    const github_link = current_project.github_link;

    return (
        <>
            <div>
                <h2>Upload Links</h2>
                <div>
                    <div>
                        <TextField label="Youtube Link" variant="outlined" value={youtube_link} margin="normal" fullWidth onChange={e => {
                            const value = e.target.value;
                            set_project_youtube_link(set_project, value);
                        }}/>
                    </div>
                    <div>
                        <TextField label="GitHub Link" variant="outlined" value={github_link} margin="normal" fullWidth onChange={e => {
                            const value = e.target.value;
                            set_project_github_link(set_project, value);
                        }}/>
                    </div>
                    <div>
                        <Button variant="outlined" component="label" style={{marginRight: "10px"}} disabled={current_project.poster_image !== null}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                hidden
                                onChange={e => {
                                    const run = async () => {
                                        set_is_loading(true);
                                        const files = e.target.files;
                                        if (files !== null) {
                                            const file = files[0];
                                            const filename = file.name;
                                            const size = file.size;
                                            const posterBase64 = await toBase64(file);
                                            set_project_poster(set_project, filename, posterBase64, size);
                                        } else {
                                        }
                                        set_is_loading(false);
                                        set_open_file_upload_success(true);
                                    }
                                    run();
                                }}
                            />
                            <AddAPhotoOutlined style={{marginRight: "5px"}}></AddAPhotoOutlined>
                            Upload Poster
                        </Button>
                        <Button variant="outlined" color="error" disabled={current_project.poster_image === null} onClick={() => {
                            set_empty_project_poster();
                        }}>
                            <DeleteOutlined></DeleteOutlined>
                            {current_project.poster_image !== null ? delete_poster_name(current_project.poster_image.name, current_project.poster_image.ext) : "remove poster"} 
                        </Button>
                    </div>
                    <br />
                    <div>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="upload-report"
                            type="file"
                            onChange={e => {
                                const run = async () => {
                                        set_is_loading(true);
                                        const files = e.target.files;
                                        if (files !== null) {
                                            const file = files[0];
                                            const filename = file.name;
                                            const size = file.size;
                                            const posterBase64 = await toBase64(file);
                                            set_project_report(set_project, filename, posterBase64, size);
                                        } else {
                                        }
                                        set_is_loading(false);
                                        set_open_file_upload_success(true);
                                }
                                run();
                            }}
                        />
                        <label htmlFor="upload-report">
                        <Button component="span" variant="outlined" style={{marginRight: "10px"}} disabled={current_project.report !== null}>
                            <AddBoxOutlined style={{marginRight: "5px"}}></AddBoxOutlined>
                            Upload Report
                        </Button>
                        </label> 
                        <Button variant="outlined" color="error" disabled={current_project.report === null} onClick={() => {
                            set_empty_project_report();
                        }}>
                            <DeleteOutlined></DeleteOutlined>
                            {current_project.report !== null ? delete_poster_name(current_project.report.name, current_project.report.ext) : "remove report"} 
                        </Button>
                    </div>
                </div>
            </div>
            <Snackbar open={open_file_upload_success} autoHideDuration={6000} onClose={handle_file_upload_success_snackbar_close}>
                <Alert onClose={handle_file_upload_success_snackbar_close} severity="success" sx={{ width: '100%' }}>
                    File Successfully Uploaded
                </Alert>
            </Snackbar>
        </>
    )
}

type SetIsLoading = Dispatch<SetStateAction<boolean>>;
type ContributorProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>>, set_is_loading: SetIsLoading }

function Contributor({ current_project, set_project, set_is_loading } : ContributorProps) {
    const router = useRouter();
    const project_contributor = current_project.members;
    const add_member = (new_member: Member) => {
        set_project(project => {
            return {...project, members: [...project_contributor, new_member]};
        });
    };

    const remove_contributor = (member: Member) => {
        set_project(project => {
            return {...project, members: project_contributor.filter(contribr => contribr.id != member.id)};
        });
    };

    const contributor_to_component = (member: Member) => (
        <ListItem secondaryAction={
            <IconButton edge="end" aria-label="remove user" onClick={_ => {
                remove_contributor(member);
            }}>
                <DeleteIcon/>
            </IconButton>
        } key={member.id}>
        <ListItemAvatar>
            <Avatar>
                <PersonIcon/>
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${member.name} (${member.id})`}/>
        </ListItem>
    )
    const [contributor_selection, set_contributor_selection] = useState<Member | null>(null);
    const [selection_error, set_selection_error] = useState(false);
    const [contributor_option, set_contributor_options] = useState<Member[]>([]);

    useEffect(() => {
        const run = async () => {
            // find all users.
            set_is_loading(true);
            const res = await findAllUser();
            if (res !== undefined) {
                const users = res.users;
                const members: Member[] = users.map(u => ({"id": u.user_id, "name": u.name}));
                set_contributor_options(members);
            }
            set_is_loading(false);
            // then set contributor option to all users.
        };
        run();

    }, []);


    useEffect(() => {
        console.log(current_project.members);
    }, [current_project.members]);

    return (
        <>
            <div>
                <h2>Contributors</h2>
            </div>
            <div>
                <List>
                    {project_contributor.map(contributor_to_component)}
                </List>
                <Autocomplete
                    color={selection_error ? "error" : undefined} 
                    className={style.margin20px}
                    options={contributor_option}
                    getOptionLabel={(member: Member) => `${member.id} - ${member.name}`}
                    renderInput={params => <TextField {...params} label="Members"/>}
                    getOptionDisabled={(member: Member) => (project_contributor.find(contribr => contribr.id == member.id) !== undefined)}
                    value={null}
                    onChange={(event, new_value) => {
                        set_selection_error(err => false);
                        if (new_value != null) {
                            // set current contributor selection
                            const found = project_contributor.find(contribr => contribr.id == new_value.id);
                            if (found) {
                                set_selection_error(err => true);
                                return;
                            }
                            set_selection_error(err => false);
                            add_member(new_value);
                            set_contributor_selection(null);
                        }
                    }}
                />
                <Button 
                    variant="contained" 
                    color="success" 
                    className={style.margin20px}
                    onClick={async (_) => {
                        set_is_loading(true);
                        const poster_image: ProjectDataFile = current_project.poster_image === null 
                                                    ? EMPTY_PROJECT_DATA_FILE : current_project.poster_image;
                        const report: ProjectDataFile = current_project.report === null
                                                        ? EMPTY_PROJECT_DATA_FILE : current_project.report
                        const projectData: ProjectData = {
                            "project_id": "",
                            "class_id": "",
                            "name": current_project.name,
                            "members": current_project.members.map(m => m.id),
                            "poster_image": poster_image,
                            "report": report,
                            "short_description": current_project.short_description,
                            "description": current_project.description,
                            "youtube_link": current_project.youtube_link,
                            "github_link": current_project.github_link,
                            "projects_total": 0,
                            "page_projects_total": 0
                        };
                        const res = await create_project(projectData);
                        set_project(_ => EMPTY_PROJECT);
                        set_is_loading(false);
                        router.push("/profile");
                    }}
                
                >Submit</Button>
            </div>
        </>
    )
}

const PROJECT_INFORMATION = "PROJECT_INFORMATION";
const UPLOAD_LINK = "UPLOAD_LINK";
const CONTRIBUTORS = "CONTRIBUTORS";

type FormHandlerProps = {
    component: string,
    current_project: Project,
    set_project: Dispatch<SetStateAction<Project>>,
    set_is_loading: SetIsLoading
}

function CreationFormHandler({component, current_project, set_project, set_is_loading} : FormHandlerProps) {

    if (component == PROJECT_INFORMATION) {
        return (<ProjectInformation current_project={current_project} set_project={set_project}/>);
    }

    if (component == UPLOAD_LINK) {
        return (<LinkUpload current_project={current_project} set_project={set_project} set_is_loading={set_is_loading}/>);
    }

    if (component == CONTRIBUTORS) {
        return (<Contributor current_project={current_project} set_project={set_project} set_is_loading={set_is_loading}/>);
    }

    return (<></>);
}

export default function CreatePoster() {

    const { instance, accounts } = useMsal();
    const [stage, setStage] = useState(PROJECT_INFORMATION);
    const [current_project, set_project] = useState(EMPTY_PROJECT);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const run = async () => {
            const provider = "MSFT";
            const provider_id = await getCurrentUserId(instance, accounts);
            const res = await findUserByMsftProvider(provider, provider_id);
            const member: Member = { name: res.user.name, id: res.user.user_id };
            set_project(p => ({...p, members: p.members.concat(member)}));
        };

        run();
    }, []);

    useEffect(() => {
        console.log(current_project);
    }, [current_project]);

    return ( <>
        <Navbar isLoading={isLoading}/>
        <div className={style.container}>
            <h1>
                Publish
            </h1>
            <div className={style.project_creation}>
                <div className={style.project_creation_stages}>
                    <p className={style.stage_title}>Sections</p>
                    <p onClick={_ => setStage(_ => PROJECT_INFORMATION)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == PROJECT_INFORMATION) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>General</p>
                    <p onClick={_ => setStage(_ => UPLOAD_LINK)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == UPLOAD_LINK) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>Uploads</p>
                    <p onClick={_ => setStage(_ => CONTRIBUTORS)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == CONTRIBUTORS) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>Contributors/Team members</p>
                </div>
                <div className={style.project_creation_stage}>
                    <CreationFormHandler component={stage} current_project={current_project} set_project={set_project} set_is_loading={setIsLoading}/>
                </div>
            </div>
        </div>
    </> )
}