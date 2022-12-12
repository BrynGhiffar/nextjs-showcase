import searchStyle from "./searchbar.module.scss";
import SearchIcon from "@mui/material";
import {TextField, InputAdornment} from "@mui/material";

const Search = () => {


    return (<>
      <div className={searchStyle.container}>
        <div className={searchStyle.title}>
          <h1> All Projects </h1>
          </div>
          <div className={searchStyle.search_container}>
                <div className={searchStyle.search}>
                    <input
                    className={searchStyle.search}
                    type = "text"
                    placeholder="Search">
                    </input>
                
                </div>
                </div>
        </div>

        </>)
  }
  
  export default Search;


