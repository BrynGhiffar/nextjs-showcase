import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import style from "../../styles/project.id.module.scss";
import { useEffect, useState } from "react";
import { EMPTY_PROJECT_DATA, find_project_by_project_id } from "../../clients/project_service";
import { useRouter } from "next/router";
import { ProjectData } from "../../clients/project_service";
import { FindUserByIdResponse, findUserById } from "../../clients/user_service";
import youtube from "../../public/Project/youtube.png";
import github from "../../public/Project/github.png";
import website from "../../public/Project/web.png";
import YouTube, { YouTubeProps } from "react-youtube";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";
import Link from "next/link";
import {find_comment_by_project_id}  from "../../clients/comment_service";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { CommentData, EMPTY_COMMENT_DATA } from "../../clients/comment_service";
import CommentCard from "../../components/commentCard";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});


const sample_comment_data = [{
  "comment_id": "4321442",
  "date_time": Date(),
  "comment": "At this point you're free to make changes, create new commits, switch branches, and perform any other Git operations; then come back and re-apply your stash when you're ready. ",
  "user_id": "63a15bdd02499a3ea3c6351d",
  "project_id": "63a142e88e0540c10a7d8b99",

},
{
  "comment_id": "4321442",
  "date_time": Date(),
  "comment": "Fake news has been a persistent and evolving problem in our society. As the spread of COVID-19 continues, the spread of fake news that is associated with it has also become much more rampant. Trying to solve this, we collected a dataset of 7,000 real news and 1,200 fake news titles on COVID-19 in Indonesia. We used three different machine learning baselines (Support Vector Machine (SVM), Logistic Regression, and Multinomial Bayes (MNB)) to create a binary classification (hoax vs real).  ",
  "user_id": "63a15bdd02499a3ea3c6351d",
  "project_id": "63a142e88e0540c10a7d8b99",

}]

export default function ProjectPage() {
  type UserNameId = {
    name: string;
    id: string;
  };

  const [project, set_project] = useState<ProjectData | null>(null);
  const [members, set_members] = useState<Array<UserNameId> | null>(null);
  const commentCard = (commentData: CommentData) => (<CommentCard key={commentData.project_id} commentData={commentData}/>)
  const [comments, set_comments] =  useState<CommentData[] | null>([])
  const router = useRouter();
  const { id: project_id } = router.query;

  useEffect(() => {
    const run = async () => {
      const final: UserNameId[] = [];

      if (typeof project_id === "string") {

        const allComments = await find_comment_by_project_id(project_id);

        if (allComments !== null) {
          set_comments( _ => allComments.comments);
          
        }
      }

      if (typeof project_id === "string") {
        const res = await find_project_by_project_id(project_id);
        if (res.project !== null) {
          set_project((_) => res.project);
          const members_id = res.project?.members!;
          const md_description = res.project?.description!;
          if (members_id !== undefined) {
            for (const id of members_id) {
              const userNameId: UserNameId = {
                name: "",
                id: "",
              };

              const response = await findUserById(id);
              if (response.user != null) {
                userNameId.id = response.user.user_id;
                userNameId.name = response.user.name;
                final.push(userNameId);
              }
            }
            set_members((_) => final);
          }
        }
      }
    };
    run();
  }, [project_id]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  var member_links = [];
  if (members !== null) {
    for (var i = 0; i < members.length; i++) {
      const item = members[i];
      member_links[i] = (
        <Button
          className={style.member_item}
          variant="outlined"
          color="info"
          onClick={(_) => {
            router.push(`/profiles/${item.id}`);
          }}
        >
          {item.name.toString()}
        </Button>
      );
    }
  }

  return (
    <div className={style.page_container}>
      <Navbar isLoading={false} />

      <div className={style.content_container}>
        <div className={style.details_container}>
          <h1 className={style.project_name}>{project?.name!}</h1>
          <h4 className={style.project_short_description}>
            {project?.short_description!}
          </h4>
          <div className={style.member_list}>
            <div>{member_links}</div>
          </div>
        </div>
        <div className={style.upper_container}>
          <div className={style.left_side}>
            <Image
              src={project?.poster_image.base64!}
              layout="fill"
              objectFit="contain"
              alt="Project Poster"
            />
          </div>
          <div className={style.right_side}>
            <YouTube
                className={style.youtube_video}
                videoId={project?.youtube_link.substring(32, 43)!}
                opts={opts}
                onReady={onPlayerReady}
            />
          </div>
        </div>
        <div className={style.lower_container}>
          <MarkdownPreview
                source={project?.description!}
                warpperElement={{ "data-color-mode": "light" }}
              />
              <h1>Description</h1>
              <div className={style.hyperlinks}>
                <a href={project?.youtube_link!} target="_blank" rel="noreferrer">
                  <div className={style.image_holder}>
                    <Image
                      src={youtube}
                      width={40}
                      height={40}
                      alt="Project Poster"
                    />
                  </div>
                </a>
                <a href={project?.github_link!} target="_blank" rel="noreferrer">
                  <div className={style.image_holder}>
                    <Image
                      src={github}
                      width={40}
                      height={40}
                      alt="Project Poster"
                    />
                  </div>
                </a>
                <a href={project?.youtube_link!} target="_blank" rel="noreferrer">
                  <div className={style.image_holder}>
                    <Image
                      src={website}
                      width={40}
                      height={40}
                      alt="Project Poster"
                    />
                  </div>
                </a>
              </div>
              <h2>Members:</h2>
          
        </div>
        <div>
            
            <div className={style.commentBox}>
              <h1 className={style.commentTitle}>Comment Section</h1>
            <div className={style.commentBar_input}>
              <div>
                <Box
                  sx={{
                    paddingTop: 10,
                    width: 900,
                    height: 150,
                  }}
                >
                  <TextField fullWidth label="Comment" id="Comment" />
                </Box>
              </div>
              <div>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    marginTop: 10,
                    marginLeft: 2,
                    paddingTop: 2,
                    paddingBottom: 2,
                  }}
                >
                  Upload
                </Button>
              </div>
            </div>
            {
                comments?.map(commentCard)
            }
            </div>
          </div>
      </div>

      <Footer />
    </div>
  );
}
