import searchStyle from "./searchbar.module.scss";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

const Search = () => (<>
  <div className={searchStyle.container}>
    <div className={searchStyle.title}>
      <h1> All Projects </h1>
    </div>
    <div className={searchStyle.search_container}>
      <div className={searchStyle.search}>
        <TextField
          type="text"
          placeholder="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }} />


        <div className={searchStyle.search_container}>
        </div>
      </div>
      <div className={searchStyle.container}>
        <div className={searchStyle.title}>
          <FilterAltIcon></FilterAltIcon>
        </div>
      </div>



    </div>
  </div>

</>)
  
  export default Search;


