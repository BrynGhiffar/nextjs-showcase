import type { NextPage } from "next"
import { find_all_projects, ProjectData } from "../clients/project_service";
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import { useEffect, useState } from "react";
import ProjectCard from "../components/projectCard";

const Home: NextPage = () => {

  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)

  useEffect(() => {
    

    const run = async () => {
      setIsLoading(_ => true);
      const allProjs = await find_all_projects();
      if (allProjs.projects !== null)
      {
        const projs = allProjs.projects;
        setUserProjects(_ => projs);
      }
      setIsLoading(_ => false);
  };
  run();
  }, []);

    return (
    <div>
      <Navbar isLoading={false}/>
      <main className={styles.helloworld}>
        All of the projects, hopefully....
      </main>
      <div>
        <div className={style.separator}/>
          <div className={style.project_card_container}>
              {
                  userProjects?.map(projectToProjectCard)
              }
          </div>
      </div>
    </div>
    
    )
}
export default Home;