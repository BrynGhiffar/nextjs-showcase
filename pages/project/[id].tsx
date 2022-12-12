import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import Image from 'next/image'
import style from "../../styles/project.id.module.scss"
import { useEffect, useState } from "react"
import { find_project_by_project_id } from "../../clients/project_service"
import { useRouter } from "next/router"
import { ProjectData } from "../../clients/project_service"
import { FindUserByIdResponse, findUserById } from "../../clients/user_service"
import youtube from '../../public/Project/youtube.png'
import github from '../../public/Project/github.png'
import website from '../../public/Project/web.png'
import YouTube, { YouTubeProps } from 'react-youtube'
import dynamic from "next/dynamic"
import "@uiw/react-markdown-preview/markdown.css";
import Link from "next/link"
import { Button, CircularProgress, Skeleton } from "@mui/material";

const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview"),
    { ssr: false }
);

export default function ProjectPage() {

    const [project, set_project] = useState<ProjectData | null>(null);
    const [member_names, set_member_names] = useState<Array<string> | null>(null);
    const [member_ids, set_member_ids] = useState<Array<string> | null>(null);
    const [members, set_members] = useState<Array<Array<string>> | null>(null);
    const router = useRouter();
    const { id: project_id } = router.query;

    useEffect(() => {
        const run = async () => {
            const members: string[] = [];
            const member_ids: string[] = [];
            const final: string[][] = [];

            if (typeof project_id === "string") {
                const res = await find_project_by_project_id(project_id);
                if (res.project !== null) {
                    set_project(_ => res.project);
                    const members_id = res.project?.members!;
                    const md_description = res.project?.description!;
                    if (members_id !== undefined) {
                        for (const id of members_id) {
                            const temp: string[] = [];

                            const response = await findUserById(id);
                            if (response.user != null) {
                                members.push(response.user.name);
                                member_ids.push(response.user.user_id);
                                temp.push(response.user.user_id);
                                temp.push(response.user.name);
                                final.push(temp);

                            }
                        }
                        set_member_names(_ => members);
                        set_member_ids(_ => member_ids);
                        set_members(_ => final);
                    }
                }
            }

        };
        run();
    }, [project_id]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    var member_links = [];
    if (members !== null) {
        for (var i = 0; i < members.length; i++) {
            const item = members[i];
            member_links[i] = (
                    <Button className={style.member_item}
                    variant="outlined"
                    color="info"
                    onClick={_ => {
                        router.push(`/profiles/${item[0]}`)
                    }}>{item[1].toString() + item[0].toString()}</Button>);          
        }
    }


    return (
        <div className={style.page_container}>

            <Navbar isLoading={false} />

            <div className={style.content_container}>

                <div className={style.details_container}>
                    <h1 className={style.project_name}>{project?.name!}</h1>
                    <h4 className={style.project_short_description}>{project?.short_description!}</h4>
                    <div className={style.member_list}>

                        <div>{member_links}</div>
                    </div>
                </div>
                <div className={style.upper_container}>
                    <div className={style.left_side}>
                        <Image src={project?.poster_image.base64!} layout="fill" objectFit="contain" alt="Project Poster" />
                    </div>
                    <div className={style.right_side}>
                        <YouTube className={style.youtube_video} videoId={project?.youtube_link.substring(32, 43)!} opts={opts} onReady={onPlayerReady} />
                    </div>
                </div>
                <div className={style.lower_container}>
                    <MarkdownPreview source={project?.description!} warpperElement={{ "data-color-mode": "light" }} />
                    <div className={style.hyperlinks}>
                        <a href={project?.youtube_link!} target="_blank" rel="noreferrer"><div className={style.image_holder}><Image src={youtube} width={40} height={40} alt="Project Poster" /></div></a>
                        <a href={project?.github_link!} target="_blank" rel="noreferrer"><div className={style.image_holder}><Image src={github} width={40} height={40} alt="Project Poster" /></div></a>
                        <a href={project?.youtube_link!} target="_blank" rel="noreferrer"><div className={style.image_holder}><Image src={website} width={40} height={40} alt="Project Poster" /></div></a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>


    )
}