import Navbar from "./Navbar";
import "../styles/LayoutWrapper.css";

export default function LayoutWrapper({ children }) {
  return (
    <div className="layout-root">
      <Navbar />
      <div className="layout-content">{children}</div>
    </div>
  );
}
