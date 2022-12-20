import { CommentData } from "../clients/comment_service";
import { useRouter } from "next/router";
import style from "../styles/commentCard.module.scss";
import { useEffect } from "react";
import { findUserById } from "../clients/user_service";
import { useState } from "react";
import { UserData } from "../clients/user_service";

type CommentCardProps = {
    commentData: CommentData
}

export default function CommentCard({ commentData }: CommentCardProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserData>();


    useEffect(() => {
        const run = async () => {
            const res = await findUserById(commentData.user_id)
            if (res !== null) {
                const user = res.user;
                setUser(_ => user);
            }
        }
        run();
    }, []);

    return (
        <>
            <div className={style.commentCard}>
                <div className={style.commentHeader}>
                    <p className={style.commentName}>{user?.name}</p>
                    <p className={style.commentDate}>{commentData.date_time.toString().replace(" GMT+0700 (Indochina Time)", "")}</p>
                </div>

                <p className={style.commentData}>{commentData.comment}</p>
            </div>
        </>
    )
}
