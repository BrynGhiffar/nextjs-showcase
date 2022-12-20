import type { NextPage } from "next"
import { find_all_projects, ProjectData, find_project_by_name } from "../clients/project_service";
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import { SetStateAction, useEffect, useState } from "react";
import ProjectCard from "../components/projectCard";
import { CircularProgress } from "@mui/material";
import { Pagination } from '@mui/material';

const Home: NextPage = () => {

  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)
  const [totalPages, setTotalPages] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10;

  const handlePaginationChange = (_event: any, value: SetStateAction<number>) =>
  { 
    setCurrentPage(value); 
  };

  // this is for first load
  useEffect(() => {
    const run = async () => {
      setIsLoading(_ => true);

      const allProjs = await find_project_by_name("", currentPage, projectsPerPage);
      
      if (allProjs.projects !== null)
      {
        const projs = allProjs.projects;
        setUserProjects(_ => projs);
      }
      setIsLoading(_ => false);
    }
    
    run();
  }, []);

  // this is called when a page fucking changes
  useEffect(() => {
    const run = async () => {
      setIsLoading(_ => true);

      const allProjs = await find_project_by_name("", currentPage, projectsPerPage);
      if (allProjs.projects !== null)
      {
        const projs = allProjs.projects;
        setUserProjects(_ => projs);
      }
      
      setIsLoading(_ => false);
    }
    
    run();
  }, [currentPage]);

  // i love state changes
  useEffect(() => {
    if (userProjects.length !== 0) {
      const page_total = Math.ceil(userProjects[0].projects_total / projectsPerPage)
      setTotalPages(page_total)
    }
  }, [userProjects])

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
                  userProjects?.map(projectToProjectCard)
              }
          </div>
      </div>
      <div>
        <Pagination
          count={totalPages}
          variant='outlined'
          color='primary'
          className='pagination'
          page={currentPage}
          onChange={handlePaginationChange}
        />
      </div>
  </div>
  )
}
export default Home;