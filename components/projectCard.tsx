import { ProjectData } from "../clients/project_service";
import { useRouter } from "next/router";
import { StaticImageData } from "next/image";
import style from "../styles/profile.module.scss";
import noimage from "../public/no-image-icon-6.png";
import Image from "next/image";
import { Button } from "@mui/material";

type ProjectCardProps = {
    projectData: ProjectData
}

export default function ProjectCard({ projectData }: ProjectCardProps) {
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
                <Button
                    variant="outlined"
                    color="info"
                    // just need to router push to the update page for functunality
                    className={style.margin20px} >Update</Button>
                </div>
            </div>
        </>
    )
}