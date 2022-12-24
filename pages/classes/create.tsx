import Navbar from "../../components/navbar";
import { TextField } from "@mui/material";
import { useState } from "react";
import style from "../../styles/poster.create.module.scss";
import Button from "@mui/material/Button";
import { ClassData, create_class } from "../../clients/class_service";

export default function Classes() {

    const [name, setName] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [classCode, setClassCode] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");


    return (
        <>
        <Navbar isLoading={false}/>
        <div className={style.container}>
            <h1> Create Class </h1>
            <div>
            <TextField label="name" variant="outlined" margin="normal" fullWidth onChange={e => {
                        const value = e.target.value;
                        setName(value);
                        console.log(value)
                    }}/>

            <TextField label="semester" variant="outlined" margin="normal" fullWidth onChange={e => {
                        const value = e.target.value;
                        setSemester(value);
                        console.log(value)
                    }}/>

            <TextField label="year" variant="outlined" margin="normal" fullWidth onChange={e => {
                        const value = e.target.value;
                        setYear(value);
                        console.log(value)
                    }}/>

            <TextField label="classCode" variant="outlined" margin="normal" fullWidth onChange={e => {
                        const value = e.target.value;
                        setClassCode(value);
                        console.log(value)
                    }}/>

            <TextField label="courseCode" variant="outlined" margin="normal" fullWidth onChange={e => {
                        const value = e.target.value;
                        setCourseCode(value);
                        console.log(value)
                    }}/>

            <Button  onClick={async (_) => {
                const classData: ClassData = {
                    "class_id": "",
                    "lecturer_id": "",
                    "name": name,
                    "semester": semester,
                    "year": year,
                    "class_code": classCode,
                    "course_code": courseCode,
                    "projects": []
                }
                
                const res = await create_class(classData)}}>
                    
                    Submit</Button>
            </div>
        </div>

        </>
    );


}