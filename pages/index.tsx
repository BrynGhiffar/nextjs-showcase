import type { NextPage } from "next"
import { find_all_projects, ProjectData, find_project_by_name } from "../clients/project_service";
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import { SetStateAction, useEffect, useState } from "react";
import ProjectCard from "../components/projectCard";
import { CircularProgress } from "@mui/material";
import { Pagination, Box } from '@mui/material';
import Search from "../components/searchbar";


const Home: NextPage = () => {

  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)
  const [totalPages, setTotalPages] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 2;

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
    <>
  <div>
      <Navbar isLoading={isLoading}/>
      <Search/>
      {isLoading ? <CircularProgress color="inherit" className={style.progress_circle}/> : ""}
      <div className={styles.container_home}>
      </div>
      <div>
        <div className={style.separator}/>
          <div className={style.project_card_container}>
              {
                  userProjects?.map(projectToProjectCard)
              }
          </div>
      </div>
      <Box justifyContent={"center"} alignItems="center" display={"flex"}
           sx={{
              marginTop:"25px",
              marginBottom:"15px",
           }}
           >
        <Pagination
          count={totalPages}
          color='primary'
          page={currentPage}
          onChange={handlePaginationChange}
        />
      </Box>
  </div>
  </>
  )
}
export default Home;