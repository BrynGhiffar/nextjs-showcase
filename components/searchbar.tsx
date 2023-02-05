import searchStyle from "./searchbar.module.scss";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { ProjectData, find_project_by_name } from "../clients/project_service";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

type SearchProps = {
  PROJECTSERVICE_HOST: string,
  set_project_data: Dispatch<SetStateAction<ProjectData[]>>
  page: number,
  projects_per_page: number,
  set_loading: Dispatch<SetStateAction<boolean>>,
  search_term: string,
  set_search_term: Dispatch<SetStateAction<string>>
};

export default function Search ({
  set_project_data,
  page, projects_per_page,
  set_loading,
  search_term,
  set_search_term,
  PROJECTSERVICE_HOST,
}: SearchProps){

  async function handleSearchClick() {
    set_loading(true);
    const res = await find_project_by_name(PROJECTSERVICE_HOST, search_term, page, projects_per_page);
    if (res.projects !== null) {
      set_project_data(res.projects);
    }
    set_loading(false);
  }

  useEffect(() => {
    const run = async () => {
      const res = await find_project_by_name(PROJECTSERVICE_HOST, search_term, page, projects_per_page);
      if (res.projects !== null) {
        set_project_data(res.projects);
      }
    }
    run();
  }, [search_term, page]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    set_search_term(event.target.value);
  }

  return (<>
  <div className={searchStyle.container}>
    <div className={searchStyle.title}>
      <h1>Projects</h1>
    </div>
    <div className={searchStyle.search_container}>
      <div className={searchStyle.search}>
        <TextField
          onClick={handleSearchClick}
          onChange={handleSearchChange}
          value={search_term}
          type="text"
          variant="standard"
          placeholder="Search"
          sx ={{
            input:{
              border:"none",
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                <SearchIcon/>
                </IconButton>
              </InputAdornment>
            )
          }} />
        <div className={searchStyle.search_container}>
        </div>
      </div>
      <div className={searchStyle.container}>
        <div className={searchStyle.title}>
        </div>
      </div>
    </div>
  </div>

</>)
}
