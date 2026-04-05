import Sidebar from "./Sidebar";


export default function Layout({children}) {
  return (
    <>
      <Sidebar />
      <div>
        {children}
      </div>
    </>
  );
}