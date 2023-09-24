import Navbar from "./navbar";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
};

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
