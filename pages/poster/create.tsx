import Navbar from "../../components/navbar";
import style from "../../styles/poster.create.module.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { PersonPinCircleOutlined } from "@mui/icons-material";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import { create_project, ProjectData } from "../../clients/project_service";
import { useRouter } from "next/router";
import { findAllUser } from "../../clients/user_service";
import { extractBase64, toBase64 } from "../../utility/base64";

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
    "poster_image": string,
    "members": Member[],
    "report": string,
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
    "poster_image": "",
    "members": [],
    "report": ""
}

type ProjectSetter = Dispatch<SetStateAction<Project>>

type ProjectInformationProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>> }

function ProjectInformation({current_project, set_project} : ProjectInformationProps) {

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
                            <TextField label="GitHub Link" variant="outlined" margin="normal" fullWidth/>
                            <Button variant="outlined" style={{marginBottom: "20px"}}>PULL</Button>
                        </> : ""
                    }

                    <MDEditor value={project_description} onChange={v => set_project_description(set_project, v)} height={350}/>
                </div>
            </div>
        </>
    )
}

type LinkUploadProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>> }

function LinkUpload({ current_project, set_project } : LinkUploadProps ) {

    
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

    const set_project_poster = (set_project: ProjectSetter, new_poster: string) => {
        set_project(project => {
            if (new_poster === undefined) {
                return project;
            }
            return { ...project, poster_image: new_poster };
        });
    };

    const set_project_report = (set_project: ProjectSetter, new_report: string) => {
        set_project(project => {
            if (new_report === undefined) {
                return project;
            }
            return { ...project, report: new_report };
        });
    };
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
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={e => {
                                const run = async () => {
                                    const files = e.target.files;
                                    if (files !== null) {
                                        const posterBase64 = await toBase64(files[0]);
                                        set_project_poster(set_project, posterBase64);
                                    } else {
                                    }
                                }
                                run();
                            }}
                        />
                        <label htmlFor="raised-button-file">
                        <Button component="span" variant="outlined">
                            Upload Poster
                        </Button>
                        </label> 
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
                                    const files = e.target.files;
                                    if (files !== null) {
                                        const reportBase64 = await toBase64(files[0]);
                                        set_project_report(set_project, reportBase64);
                                    } else {
                                    }
                                }
                                run();
                            }}
                        />
                        <label htmlFor="upload-report">
                        <Button component="span" variant="outlined">
                            Upload Report
                        </Button>
                        </label> 
                    </div>
                </div>
            </div>
        </>
    )
}

type ContributorProps = { current_project: Project, set_project: Dispatch<SetStateAction<Project>> }

function Contributor({ current_project, set_project } : ContributorProps) {
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
            const res = await findAllUser();
            if (res !== undefined) {
                const users = res.users;
                const members: Member[] = users.map(u => ({"id": u.user_id, "name": u.name}));
                set_contributor_options(members);
            }
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
                    className={style.margin20px}
                    options={contributor_option}
                    getOptionLabel={(member: Member) => `${member.id} - ${member.name}`}
                    renderInput={params => <TextField {...params} label="Contributor"/>}
                    value={contributor_selection}
                    onChange={(event, new_value) => {
                        set_selection_error(err => false);
                        if (new_value != null) {
                            // set current contributor selection

                            set_contributor_selection(new_value);
                        }
                    }}
                />
                <Button variant="outlined" color={selection_error ? "error" : undefined} className={style.margin20px} onClick={_ => {
                    if (contributor_selection != null) {
                        const found = project_contributor.find(contribr => contribr.id == contributor_selection.id);
                        if (found) {
                            set_selection_error(err => true);
                            return;
                        }
                        set_selection_error(err => false);
                        add_member(contributor_selection);
                        set_contributor_selection(null);
                    }

                    return;
                }}>Add Member</Button>
                <br />
                <Button 
                    variant="contained" 
                    color="success" 
                    className={style.margin20px}
                    onClick={async (_) => {
                        const projectData: ProjectData = {
                            "project_id": "",
                            "class_id": "",
                            "name": current_project.name,
                            "members": current_project.members.map(m => m.id),
                            "poster_image": current_project.poster_image,
                            "report": current_project.report,
                            "short_description": current_project.short_description,
                            "description": current_project.description,
                            "youtube_link": current_project.youtube_link,
                            "github_link": current_project.github_link
                        };
                        const res = await create_project(projectData);
                        console.log(res);
                        set_project(_ => EMPTY_PROJECT);
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
    set_project: Dispatch<SetStateAction<Project>>
}

function CreationFormHandler({component, current_project, set_project} : FormHandlerProps) {

    if (component == PROJECT_INFORMATION) {
        return (<ProjectInformation current_project={current_project} set_project={set_project}/>);
    }

    if (component == UPLOAD_LINK) {
        return (<LinkUpload current_project={current_project} set_project={set_project}/>);
    }

    if (component == CONTRIBUTORS) {
        return (<Contributor current_project={current_project} set_project={set_project}/>);
    }

    return (<></>);
}

export default function CreatePoster() {

    const [stage, setStage] = useState(PROJECT_INFORMATION);
    const [current_project, set_project] = useState(EMPTY_PROJECT);

    useEffect(() => {
        console.log(current_project);
    }, [current_project]);

    return ( <>
        <Navbar isAuthenticated={true}/>
        <div className={style.container}>
            <h1>
                Project Creation Page
            </h1>
            <div className={style.project_creation}>
                <div className={style.project_creation_stages}>
                    <p onClick={_ => setStage(_ => PROJECT_INFORMATION)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == PROJECT_INFORMATION) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>Project Information</p>
                    <p onClick={_ => setStage(_ => UPLOAD_LINK)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == UPLOAD_LINK) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>Upload Links</p>
                    <p onClick={_ => setStage(_ => CONTRIBUTORS)} className={(() => {
                        let className = `${style.stage} `;
                        if (stage == CONTRIBUTORS) {
                            className += style.selected_stage + " ";
                        }
                        return className;
                    })()}>Contributors/Team members</p>
                </div>
                <div className={style.project_creation_stage}>
                    <CreationFormHandler component={stage} current_project={current_project} set_project={set_project}/>
                </div>
            </div>
        </div>
    </> )
}