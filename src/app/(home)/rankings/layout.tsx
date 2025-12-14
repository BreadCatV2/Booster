import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    return (
        <HomeLayout defaultOpen={true}>
            {children}
        </HomeLayout>
    )
}

export default Layout;
