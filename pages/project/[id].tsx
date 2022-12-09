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

export default function ProjectPage() {

    const [project, set_project] = useState<ProjectData | null>(null)
    const [youtube_link, set_youtube_link] = useState<string | null>(null)
    const [github_link, set_github_link] = useState<string | null>(null)
    const [website_link, set_website_link] = useState<string | null>(null)
    const [member_names, set_member_names] = useState<Array<string> | null>(null)

    const router = useRouter();
    const { id: project_id } = router.query;

    useEffect(() => {
        const run = async () => {
            const members: string[] = [];
            if (typeof project_id === "string") {
                const res = await find_project_by_project_id(project_id);
                console.log(res, project_id)
                if (res.project !== null) {
                    set_project(_ => res.project);
                    const members_id = res.project?.members!

                    if (members_id !== undefined) {
                        for (const id of members_id) {
                            console.log("members", id)
                            const response = await findUserById(id);
                            if (response.user != null) {
                                members.push(response.user.name);
                            }
                        }
                        set_member_names(_ => members);
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
            autoplay: 1,
        },
    };

    return (
        <div>

            <Navbar isLoading={false} />

            <div className={style.upper_container}>

                <div className={style.left_side}>
                    <Image src={project?.poster_image.base64!} layout="fill" objectFit="cover" alt="Project Poster" style={{ width: "100%", height: "100%", position: "relative" }} />
                </div>

                <div className={style.right_side}>
                    <h1>{project?.name!}</h1>
                    <h4>{project?.short_description!}</h4>
                    <p>{project?.description!}</p>
                    <div className={style.hyperlinks}>
                        <a href={project?.youtube_link!}><div className={style.image_holder}><Image src={youtube} width={40} height={40} alt="Project Poster" style={{ position: "relative" }} /></div></a>
                        <a href={project?.github_link!}><div className={style.image_holder}><Image src={github} width={40} height={40} alt="Project Poster" style={{ position: "relative" }} /></div></a>
                        <a href={project?.youtube_link!}><div className={style.image_holder}><Image src={website} width={40} height={40} alt="Project Poster" style={{ position: "relative" }} /></div></a>
                    </div>
                    <p>Members:</p>
                    <ul>
                        {member_names?.map((member) => {
                            return (
                                <li>{member.toString()}</li>
                            )
                        })}
                    </ul>
                </div>

                

            </div>
            <div className={style.youtube_embed}>
                <YouTube className={style.youtube_video} videoId={project?.youtube_link.substring(32, 43)!} opts={opts} onReady={onPlayerReady} />
            </div>

            <Footer />
        </div>


    )
}