import Navbar from "../../components/navbar"

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking"
    };
}

export async function getStaticProps(_context: any) {
    return {
        props: {

        }
    };
}

type ClassesProps = {};

export default function Classes({ }: ClassesProps) {
    return (
        <>
            <div>
                <Navbar isLoading={false} />

            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1>PAGE WORK IN PROGRESS...</h1>
        </>
    )
}