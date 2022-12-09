import Head from "next/head";
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import profile from "../public/profile.jpg";
import noimage from "../public/no-image-icon-6.png";
import plus_sign from "../public/plus-sign.png";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { ChangeEvent, SetStateAction, useState, Dispatch, useEffect, useRef, Component } from "react";
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from "../azureAuth.config";
import { callMsGraph } from "../azureGraph.config";
import { useIsAuthenticated } from '@azure/msal-react';
import { updateDescription, findUserByMsftProvider, UserData, EMPTY_USER_DATA } from "../clients/user_service";
import { find_projects_by_user_id, ProjectData } from "../clients/project_service";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import Footer from "../components/footer";
import { getCurrentUserId } from "../clients/azure_client";
import { useRouter } from "next/router";

const full_name = "John Doe";
const semester_batch = "Semester 5, Batch 2025";
const current_description = "Hello, my name is John Doe";

function handleChangeDescription(event: ChangeEvent<HTMLTextAreaElement>, state: string, setter: Dispatch<SetStateAction<string>>) {
    const new_description = event.target.value;
    setter(oldvalue => new_description);
}

type ProfileDescriptionProps = {
    user_id: string,
    description: string,
}

function ProfileDescription(profileDescriptionProps: ProfileDescriptionProps) {
    const { user_id, description: propsDescription } = profileDescriptionProps;
    const [editting, setEditting] = useState(false);
    const [descriptionBuffer, setDescriptionBuffer] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setDescriptionBuffer(propsDescription);
        setDescription(propsDescription);
    }, [propsDescription]);

    return (<>
        {(editting ? <>
        <textarea autoFocus className={style.textarea} value={descriptionBuffer} onChange={event => handleChangeDescription(event, descriptionBuffer, setDescriptionBuffer)}/>
        <div>
            <button 
                onClick={_ => {
                    setEditting(edit => false);
                    setDescription(oldDesc => descriptionBuffer);
                    updateDescription(profileDescriptionProps.user_id, descriptionBuffer);
                }}
            >✅</button>
            <button 
                onClick={_ => {
                    setEditting(edit => false);
                    setDescriptionBuffer(oldDesc => description);
                }}
            >❌</button>
        </div>
        </> : <>
            <div 
                className={style.textarea}
            >{description}</div>
            <button onClick={_ => setEditting(edit => true)}>📝</button>
        </>)}
    </>)

}

type ProjectCardProps = {
    projectData: ProjectData
}

function ProjectCard({ projectData }: ProjectCardProps) {
    const router = useRouter();
    let poster: StaticImageData | string = noimage;
    if (projectData.poster_image.name !== "") {
        poster = projectData.poster_image.base64;
    }
    return (
        <>
            <div className={style.project_card}>
                <div className={style.project_poster}>
                    <Image style={{width: "100%", height: "100%", position: "relative"}} src={poster} layout="fill" objectFit="cover" alt="poster"/>
                </div>
                <div className={style.project_description}>
                    <h1>
                        {projectData.name ? projectData.name : "No Name"}
                    </h1>
                    <p>
                        {projectData.short_description}
                    </p>
                <Button
                    variant="outlined" 
                    color="info" 
                    className={style.margin20px} onClick = {_ => {
                        router.push(`/project/${projectData.project_id}`)
                    }}>Read More</Button>
                </div>
            </div>
        </>
    )
}

function CreateProjectCard() {
    return (<>
        <Link href="/poster/create">
            <div className={`${style.project_card} ${style.create_poster_card}`}>
                <div className={style.square}>
                    <Image src={plus_sign} alt="plus sign"/>
                </div>
            </div>
        </Link>
    </>)
}

type ProfileProps = {
    userData: UserData
}

export default function Profile(profileProps: ProfileProps) {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [userData, setUserData] = useState<UserData>(EMPTY_USER_DATA);
    const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const run = async () => {
            setIsLoading(_ => true);
            const id = await getCurrentUserId(instance, accounts);
            const res = await findUserByMsftProvider("MSFT", id);
            const isError = res.toString().includes("NetworkError");
            if (!isError) {
                setUserData(res.user);
                const resProjects = await find_projects_by_user_id(res.user.user_id);
                const isError = resProjects.toString().includes("NetworkError");
                if (!isError) {
                    if (resProjects.projects !== null) {
                        const projs = resProjects.projects;
                        
                        setUserProjects(_ => projs);
                    }
                }
            } else {
                // notify user about an error
                console.log("Error when fetching user data");
            }
            setIsLoading(_ => false);
        };
        run();
    }, []);

    const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)

    return (<div className={style.outer_container}>
        <Head>
            <title>Project Showcase - Profile Page</title>
        </Head>
        <Navbar isLoading={isLoading}/>
        {isLoading ? <CircularProgress color="inherit" className={style.progress_circle}/> : ""}
        <div className={style.container}>
                <div className={style.profile_container}>
                    {
                        isLoading ? (
                            <Skeleton variant="circular" height="250px" width="250px" animation="wave">
                            </Skeleton>
                        ) : (
                            <div className={style.image_profile}>
                                <Image src={noimage} alt="profile picture" className={style.border_circle} width="250" height="250"/>
                            </div>
                        )
                    }
                    <div className={style.description_profile}>
                        {
                            isLoading ? (
                                <Skeleton variant="rounded" height={"8vh"} width={"50%"}>
                                </Skeleton>
                            ) : (
                                <h1>{userData.name}</h1>
                            )
                        }
                        {
                            isLoading ? (
                                <Skeleton style={{marginTop: "1rem"}}variant="rounded" height={"5vh"} width={"50%"}>
                                </Skeleton>
                            ) : (
                                <p>Semester {userData.current_semester}. Batch {userData.graduation_year}</p>
                            )
                        }
                        {
                            isLoading ? (
                                <Skeleton style={{marginTop: "1rem"}}variant="rounded" height={"15vh"} width={"100%"}>
                                </Skeleton>
                            ) : (
                                <ProfileDescription user_id={userData.user_id} description={userData.description}/>
                            )
                        }
                    </div>
                </div>
            <div>
                <div className={style.separator}/>
                <div className={style.project_card_container}>
                    {
                        userProjects.map(projectToProjectCard)
                    }
                    <CreateProjectCard/>
                </div>
            </div>
        </div>
        <Footer/>
    </div>);
}