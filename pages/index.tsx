import type { NextPage } from "next"
import Head from 'next/head';
import Imag from 'next/image';
import styles from '../styles/home.module.scss';
import Navbar from "../components/navbar";

const Home: NextPage = () => {
    return (
    <div>
      <Navbar isLoading={false}/>
      <main className={styles.helloworld}>
        This page is still a work in progress...
      </main>
    </div>
    )
}
export default Home;