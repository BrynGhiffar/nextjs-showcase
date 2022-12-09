import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import Image from 'next/image'
import style from "../../styles/project.id.module.scss"
import { useEffect, useState } from "react"
import { find_project_by_project_id } from "../../clients/project_service"
import { useRouter } from "next/router"
import { ProjectData } from "../../clients/project_service"



export default function ProjectPage() {

    const [project, set_project] = useState<ProjectData | null>(null)
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
                
                }
            }


        };
        run();
    }, [project_id]);

    return (
        <div>
            <Navbar isLoading={false} />
            <div className={style.upper_container}>

                <div className={style.left_side}>
                    
                    <Image src={project?.poster_image.base64!} layout="fill" objectFit="cover" alt="Project Poster" style={{ width: "100%", height: "100%", position: "relative" }} />

                
                </div>

            </div>


            <Footer />

        </div>
        
    )
}