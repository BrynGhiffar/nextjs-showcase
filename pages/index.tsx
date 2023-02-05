import type { NextPage } from "next"
import { find_all_projects, ProjectData, find_project_by_name } from "../clients/project_service";
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import style from "../styles/profile.module.scss";
import { SetStateAction, useEffect, useState } from "react";
import ProjectCard from "../components/projectCard";
import { Pagination, Box } from '@mui/material';
import Search from "../components/searchbar";
import Footer from "../components/footer";

export async function getStaticProps() {
  return {
    props: {
      PROJECTSERVICE_HOST: process.env.PROJECTSERVICE_HOST!,
    }
  }
}

type HomeProps = {
  PROJECTSERVICE_HOST: string,
};

const Home = ({ 
  PROJECTSERVICE_HOST
}: HomeProps) => {

  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectToProjectCard = (projectData: ProjectData) => (<ProjectCard key={projectData.project_id} projectData={projectData}/>)
  const [totalPages, setTotalPages] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const handlePaginationChange = (_event: any, value: SetStateAction<number>) =>
  { 
    setCurrentPage(value); 
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm])
  // this is for first load
  useEffect(() => {
    const run = async () => {
      setIsLoading(_ => true);
      
      const allProjs = await find_project_by_name(PROJECTSERVICE_HOST, searchTerm, currentPage, projectsPerPage);
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

      const allProjs = await find_project_by_name(PROJECTSERVICE_HOST, searchTerm, currentPage, projectsPerPage);
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
      const page_total = Math.ceil(userProjects.length / projectsPerPage);
      setTotalPages(page_total)
    } else {
      setTotalPages(0)
    }
  }, [userProjects])

  return (
    <>
      <div className={styles.page_container}>
        <Navbar isLoading={isLoading}/>
        <div className={styles.container}>
        <Search
          projects_per_page={projectsPerPage}
          page={currentPage}
          set_project_data={setUserProjects}
          set_loading={setIsLoading}
          set_search_term={setSearchTerm}
          search_term={searchTerm}
          PROJECTSERVICE_HOST={PROJECTSERVICE_HOST}
        />
        <div className={style.separator}/>
          <div className={style.project_card_container}>
              {
                  userProjects?.map(projectToProjectCard)
              }
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
      <Footer/>
    </div>
  </>
  )
}
export default Home;