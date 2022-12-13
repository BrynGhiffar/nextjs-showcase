import type { NextPage } from "next"
import { find_all_projects, ProjectData } from "../clients/project_service";
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import { useEffect, useState } from "react";
import ProjectCard from "../components/projectCard";
import { CircularProgress } from "@mui/material";

const Home: NextPage = () => {

  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [shownProjects, setShownProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10;

  useEffect(() => {
    const run = async () => {
      setIsLoading(_ => true);

      const allProjs = await find_all_projects();
      console.log(allProjs.projects)
      if (allProjs.projects !== null)
      {
        const projs = allProjs.projects;
        setUserProjects(_ => projs);
      }

      const temp: ProjectData[] = [];

      if (allProjs.projects !== null)
      {
        for (var i = (currentPage - 1) * projectsPerPage; i < currentPage * projectsPerPage; i++)
        {
          if (allProjs.projects[i] !== undefined)
            temp.push(allProjs.projects[i]);
          else
            break
        }
      }
      setShownProjects(_ => temp);
      setIsLoading(_ => false);
    }
    
    run();
  }, []);

  return (
  <div>
      <Navbar isLoading={isLoading}/>
      {isLoading ? <CircularProgress color="inherit" className={style.progress_circle}/> : ""}
    <main className={styles.helloworld}>
      All of the projects, hopefully....
    </main>
    <div>
      <div className={style.separator}/>
        <div className={style.project_card_container}>
            {
                shownProjects?.map(projectToProjectCard)
            }
        </div>
    </div>
  </div>
  
  )
}
export default Home;