import Head from "next/head";
import Navbar from "../components/navbar";
import ProjectCard from "../components/projectCard"
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
import { find_class_by_lecturer_id, ClassData } from "../clients/class_service";
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
    USERSERVICE_HOST: string,
}

function ProfileDescription(profileDescriptionProps: ProfileDescriptionProps) {

    const { user_id, description: propsDescription } = profileDescriptionProps;
    const [ editting, setEditting ] = useState(false);
    const [ descriptionBuffer, setDescriptionBuffer ] = useState("");
    const [ description, setDescription ] = useState("");


    useEffect(() => {
        setDescriptionBuffer(propsDescription);
        setDescription(propsDescription);
    }, [ propsDescription ]);

    return (<>
        {(editting ? <>
            <textarea autoFocus className={style.textarea} value={descriptionBuffer} onChange={event => handleChangeDescription(event, descriptionBuffer, setDescriptionBuffer)} />
            <div>
                <button
                    onClick={_ => {
                        setEditting(edit => false);
                        setDescription(oldDesc => descriptionBuffer);
                        updateDescription(profileDescriptionProps.USERSERVICE_HOST, profileDescriptionProps.user_id, descriptionBuffer);
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

function CreateProjectCard() {
    return (<>
        <Link href="/poster/create">
            <div className={`${style.project_card} ${style.create_poster_card}`}>
                <div className={style.square}>
                    <Image src={plus_sign} alt="plus sign" />
                </div>
            </div>
        </Link>
    </>)
}

function CreateClassCard() {
    return (<>
        <Link href="/class/create">
            <div className={`${style.project_card} ${style.create_poster_card}`}>
                <div className={style.square}>
                    <Image src={plus_sign} alt="plus sign" />
                </div>
            </div>
        </Link>
    </>)
}

export async function getStaticProps() {
    return {
        props: {
            USERSERVICE_HOST: process.env.USERSERVICE_HOST!,
            PROJECTSERVICE_HOST: process.env.PROJECTSERVICE_HOST!
        }
    };
}

type ProfileProps = {
    USERSERVICE_HOST: string,
    PROJECTSERVICE_HOST: string
};

export default function Profile({ USERSERVICE_HOST, PROJECTSERVICE_HOST }: ProfileProps) {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [ userData, setUserData ] = useState<UserData>(EMPTY_USER_DATA);
    const [ userProjects, setUserProjects ] = useState<ProjectData[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ classes, setClasses ] = useState<ClassData[]>([]);
    const router = useRouter();
    const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData} />)

    useEffect(() => {
        const run = async () => {
            setIsLoading(_ => true);
            const id = await getCurrentUserId(instance, accounts);
            const res = await findUserByMsftProvider(USERSERVICE_HOST, "MSFT", id);
            const isError = res.toString().includes("NetworkError");
            if (!isError) {
                setUserData(res.user);
                const resProjects = await find_projects_by_user_id(PROJECTSERVICE_HOST, res.user.user_id);
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

    useEffect(() => {
        const run = async () => {
            setIsLoading(_ => true)
            const classres = await find_class_by_lecturer_id(USERSERVICE_HOST, userData.user_id)
            const isError = classres.toString().includes("NetworkError");
            if (!isError) {
                if (classres.classes !== null) {
                    const temp = classres.classes
                    setClasses(_ => temp)
                }
            } else {
                // notify user about an error
                console.log("Error when fetching classes data")
            }
            setIsLoading(_ => false)
        }
        run();
    }, [ userData ])

    var class_links = [];
    if (classes !== null && classes !== undefined) {
        console.log(classes)
        for (var i = 0; i < classes.length; i++) {
            const item = classes[ i ];
            class_links[ i ] = (
                <Button
                    className={style.class_item}
                    variant="outlined"
                    color="info"
                    onClick={(_) => {
                        router.push(`/classes/${item.class_id}`);
                    }}
                >
                    {item.name.toString()}
                </Button>
            );
        }
    }

    if (userData.role === "Student") {
        return (<div className={style.outer_container}>
            <Head>
                <title>Project Showcase - Profile Page</title>
            </Head>
            <Navbar isLoading={isLoading} />
            <div className={style.container}>
                <div className={style.profile_container}>
                    {
                        isLoading ? (
                            <Skeleton variant="circular" height="250px" width="250px" animation="wave">
                            </Skeleton>
                        ) : (
                            <div className={style.image_profile}>
                                <Image src={noimage} alt="profile picture" className={style.border_circle} width="250" height="250" />
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
                                <Skeleton style={{ marginTop: "1rem" }} variant="rounded" height={"5vh"} width={"50%"}>
                                </Skeleton>
                            ) : (
                                <p>Semester {userData.current_semester}. Batch {userData.graduation_year}</p>
                            )
                        }
                        {
                            isLoading ? (
                                <Skeleton style={{ marginTop: "1rem" }} variant="rounded" height={"15vh"} width={"100%"}>
                                </Skeleton>
                            ) : (
                                <ProfileDescription user_id={userData.user_id} description={userData.description} USERSERVICE_HOST={USERSERVICE_HOST}/>
                            )
                        }
                    </div>
                </div>
                <div className={style.separator} />
                <div className={style.project_card_container}>
                    {
                        userProjects.map(projectToProjectCard)
                    }
                    <CreateProjectCard />
                </div>
            </div>
            <Footer />
        </div>
        );
    }
    else if (userData.role === "Lecturer") {
        return (
            <div className={style.outer_container}>
                <Head>
                    <title>Lecturer Classes - Profile Page</title>
                </Head>
                <Navbar isLoading={isLoading} />
                <div className={style.container}>
                    <div className={style.profile_container}>
                        {
                            isLoading ? (
                                <Skeleton variant="circular" height="250px" width="250px" animation="wave">
                                </Skeleton>
                            ) : (
                                <div className={style.image_profile}>
                                    <Image src={noimage} alt="profile picture" className={style.border_circle} width="250" height="250" />
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
                                    <Skeleton style={{ marginTop: "1rem" }} variant="rounded" height={"5vh"} width={"50%"}>
                                    </Skeleton>
                                ) : (
                                    <p>Binus International Lecturer</p>
                                )
                            }
                            {
                                isLoading ? (
                                    <Skeleton style={{ marginTop: "1rem" }} variant="rounded" height={"15vh"} width={"100%"}>
                                    </Skeleton>
                                ) : (
                                    <ProfileDescription user_id={userData.user_id} description={userData.description} USERSERVICE_HOST={USERSERVICE_HOST} />
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <div className={style.separator} />
                        <div className={style.class_list}>
                            <div>{class_links}</div>
                            <Button
                                className={style.class_item}
                                variant="outlined"
                                color="info"
                                onClick={(_) => {
                                    router.push(`/classes/create`);
                                }}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}