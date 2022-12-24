import Navbar from "../../components/navbar";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import style from "../../styles/poster.create.module.scss";
import Button from "@mui/material/Button";
import { ClassData, create_class } from "../../clients/class_service";
import { getCurrentUserId } from "../../clients/azure_client";
import { useMsal } from '@azure/msal-react';
import { findUserByMsftProvider } from "../../clients/user_service";
import { useRouter } from "next/router";

export default function Classes() {

    const { instance, accounts } = useMsal();
    const [name, setName] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [classCode, setClassCode] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");
    const [user_id, set_user_id] = useState<string>();
    const router = useRouter();
    const [isLoading, set_is_loading] = useState<boolean>(false);

    useEffect(() => {
        const run = async () => {
          const id = await getCurrentUserId(instance, accounts);
          const res = await findUserByMsftProvider("MSFT", id);
          if (res !== null){
            set_user_id( _ => res.user.user_id);
          }
          
              
        }
        run();
    }, []);


    return (
        <>
        <Navbar isLoading={isLoading}/>
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
                    set_is_loading(true);
                    if(user_id !== undefined) {
                    const classData: ClassData = {
                        "class_id": "",
                        "lecturer_id": user_id,
                        "name": name,
                        "semester": semester,
                        "year": year,
                        "class_code": classCode,
                        "course_code": courseCode,
                        "projects": []
                    }
                    const res = await create_class(classData);
                    router.push("/profile");
                    set_is_loading(false);}}}>
                    Submit
                </Button>
            </div>
        </div>

        </>
    );


}