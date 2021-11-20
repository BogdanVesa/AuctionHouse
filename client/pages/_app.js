import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import { useEffect } from "react";
import { Navbar } from 'react-bootstrap';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
