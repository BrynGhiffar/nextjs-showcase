import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import style from "../../styles/project.id.module.scss";
// import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useEffect, useState } from 'react';
import { EMPTY_PROJECT_DATA, find_project_by_project_id } from '../../clients/project_service';
import { ProjectData } from '../../clients/project_service';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function PosterId() {
    const router = useRouter();
    const { id: projectId } = router.query;
    const [project, set_project] = useState<ProjectData>(EMPTY_PROJECT_DATA);

    useEffect(() => {
        const run = async () => {
            const s = "";
            if (typeof projectId === 'string') {
                const res = await find_project_by_project_id(projectId);
                if (res.project !== null) {
                    set_project(res.project);
                } else {
                    console.log(res.message);
                }
            } else {
                console.log("Type of project id is not string");
            }
        }
    }, []);

    return (
        <div className={style.page_container}>
            <Navbar isLoading={false}/>
            <div className={style.container}>
                <div className={style.project_title}>Project Title</div>
                <MarkdownPreview source={project.description} warpperElement={{'data-color-mode': 'light'}}/>
            </div>
        </div>
    )
}