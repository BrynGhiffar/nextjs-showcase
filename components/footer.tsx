import style from "./footer.module.scss";
import Link from "next/link";


type FooterItem = {
    name: string,
    link: string
}

const footerItems: FooterItem[] = [
    {
        name: "About",
        link: "/home"
    },
    {
        name: "Careers",
        link: "/home"
    },
    {
        name: "Accessibility",
        link: "/home"
    },
    {
        name: "Privacy",
        link: "/home"
    },
    {
        name: "Talent Solutions",
        link: "/home"
    },
    {
        name: "Marketing Solutions",
        link: "/home"
    },
    {
        name: "Advertising",
        link: "/home"
    },
    {
        name: "Ad Choices",
        link: "/home"
    },
    {
        name: "Sales Solutions",
        link: "/home"
    },
    {
        name: "Mobile",
        link: "/home"
    },
    {
        name: "Small Business",
        link: "/home"
    },
    {
        name: "Safety Center",
        link: "/home"
    },
];

export default function Footer() {

    const footerItemToComponent = (item: FooterItem) => (
        <div className={style.footer_item}>
            <Link key={item.name} href={item.link}>
                {item.name}
            </Link>
        </div>
    )
    return (
        <div className={style.footer}>
            <div className={style.container}>
                <h1>
                    <Link href="/home">
                        projectbinus.xyz
                    </Link>
                </h1>
                <div className={style.grid_container}>
                    {
                        footerItems.map(footerItemToComponent)
                    }
                </div>
            </div>
        </div>
    )
}