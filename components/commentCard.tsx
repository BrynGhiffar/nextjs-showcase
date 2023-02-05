import { CommentData } from "../clients/comment_service";
import { useRouter } from "next/router";
import style from "../styles/commentCard.module.scss";
import { useEffect } from "react";
import { findUserById } from "../clients/user_service";
import { useState } from "react";
import { UserData } from "../clients/user_service";

type CommentCardProps = {
    USERSERVICE_HOST: string,
    commentData: CommentData
}

function relativeTimePast(date_string: string) {
    let str_date = date_string.toString().replace(" GMT+0700 (Indochina Time)", "");
    let current_date = new Date();
    const current_epoch = Math.floor(current_date.getTime() / 1000);
    let date = new Date(str_date);
    const last_epoch = Math.floor(date.getTime() / 1000) + 7 * 3600;
    let epoch = date.getTime().toString();
    const time_past = current_epoch - last_epoch;
    const one_minute = 60;
    const one_hour = 60 * one_minute;
    const one_day = 24 * one_hour;
    const one_week = 7 * one_day;
    const one_month = 4 * one_week;
    const one_year = 12 * one_month;
    if (time_past > one_year) {
        return Math.floor(time_past / one_year) + " years ago";
    } else if (time_past > one_month) {
        return Math.floor(time_past / one_month) + " months ago";
    } else if (time_past > one_week) {
        return Math.floor(time_past / one_week) + " weeks ago";
    } else if (time_past > one_day) {
        return Math.floor(time_past / one_day) + " days ago";
    } else if (time_past > one_hour) {
        return Math.floor(time_past / one_hour) + " hours ago";
    } else if (time_past > one_minute) {
        return Math.floor(time_past / one_minute) + " minutes ago";
    } else {
        return time_past + " seconds ago";
    }
}

export default function CommentCard({ USERSERVICE_HOST, commentData }: CommentCardProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserData>();


    useEffect(() => {
        const run = async () => {
            const res = await findUserById(USERSERVICE_HOST, commentData.user_id)
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
                    <p className={style.commentDate}>{relativeTimePast(commentData.date_time)}</p>
                </div>

                <p className={style.commentData}>{commentData.comment}</p>
            </div>
        </>
    )
}
