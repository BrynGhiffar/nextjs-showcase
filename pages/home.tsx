import type { NextPage } from "next"
import Head from 'next/head';
import Imag from 'next/image';
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";
import Search from "../components/searchbar";

const Home: NextPage = () => {
    return (
    <div>
      <Navbar isLoading={false}/>
      {/* <main className={styles.helloworld}> */}
      <Search/>
    </div>
    )
}
export default Home;