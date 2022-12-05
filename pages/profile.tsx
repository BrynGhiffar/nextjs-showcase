import Head from "next/head";
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import profile from "../public/profile.jpg";
import poster from "../public/poster.jpg";
import plus_sign from "../public/plus-sign.png";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, SetStateAction, useState, Dispatch, useEffect, useRef } from "react";
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from "../azureAuth.config";
import { callMsGraph } from "../azureGraph.config";
import { useIsAuthenticated } from '@azure/msal-react';
import { updateDescription, findUserByMsftProvider, UserData, EMPTY_USER_DATA } from "../clients/user_service";

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

function ProjectCard() {
    return (
        <>
            <div className={style.project_card}>
                <Image className={style.project_poster} src={poster} alt="poster"/>
                <div className={style.project_description}>
                    <h1>
                        AwesomeApp
                    </h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aut culpa illum quibusdam et tenetur? Accusantium, odit quisquam repellendus quis, iusto sapiente veniam itaque pariatur minus ipsum, quaerat porro id.</p>
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

async function getCurrentUserId(instance: IPublicClientApplication, accounts: AccountInfo[]): Promise<string> {
    const account = accounts[0];
    if (account === undefined) {
      console.log("Not logged in");
      return "";
    }
    const response = instance.acquireTokenSilent({
      ...loginRequest,
      account
    });
    const accessToken = (await response).accessToken;
    const graphResponse = await callMsGraph(accessToken);
    return graphResponse.id as string;
}

type ProfileProps = {
    userData: UserData
}

export default function Profile(profileProps: ProfileProps) {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [userData, setUserData] = useState<UserData>(EMPTY_USER_DATA);


    useEffect(() => {
        const run = async () => {
            const id = await getCurrentUserId(instance, accounts);
            const res = await findUserByMsftProvider("MSFT", id);
            setUserData(res.user);
        };
        run();
    }, []);

    return (<>
        <Head>
            <title>Project Showcase - Profile Page</title>
        </Head>
        <Navbar isAuthenticated={isAuthenticated}/>
        <div className={style.container}>
            <div className={style.profile_container}>
                <div className={style.image_profile}>
                    <Image src={profile} alt="profile picture" className={style.border_circle} width="250" height="250"/>
                </div>
                <div className={style.description_profile}>
                    <h1>{userData.name}</h1>
                    <p>Semester {userData.current_semester}. Batch {userData.graduation_year}</p>
                    <ProfileDescription user_id={userData.user_id} description={userData.description}/>
                </div>
            </div>
            <div>
                <h1>Projects</h1>
                <div className={style.separator}/>
                <div className={style.project_card_container}>
                    <ProjectCard/>
                    <ProjectCard/>
                    <ProjectCard/>
                    <ProjectCard/>
                    <ProjectCard/>
                    <ProjectCard/>
                    <CreateProjectCard/>
                </div>
            </div>
        </div>
    </>);
}