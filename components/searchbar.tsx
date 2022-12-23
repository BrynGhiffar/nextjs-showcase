import searchStyle from "./searchbar.module.scss";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { find_projects_by_name } from "../clients/project_service";
import React, { useState } from 'react';




export default function Search (){
  
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearchClick() {
    find_projects_by_name
  }
  
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  return (<>
  <div className={searchStyle.container}>
    <div className={searchStyle.title}>
      <h1> All Projects </h1>
    </div>
    <div className={searchStyle.search_container}>
      <div className={searchStyle.search}>
        <TextField
          onClick={handleSearchClick}
          onChange={handleSearchChange}
          value={searchTerm}
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
