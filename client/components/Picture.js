import styles from "../styles/Auction.module.css"
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";



const Picture = ({postID}) => {
    const [picture,setPicture] = useState("");

    useEffect(()=>{
        getPicture();
    },[])
    const getPicture = ()=>{
        Axios.get(`http://localhost:3001/posts/getImage/${postID}`,{ responseType: 'blob' })
        .then(async (response) =>{
            // console.log(response);
            // setPicture(URL.createObjectURL(response));
            setPicture(URL.createObjectURL(response.data));
        }).catch((err)=>{
            console.log(err);
        })
    }
    return ( 
        <div className={styles.picture}>
            <img src={picture} className={styles.image}></img>
        </div>
     );
}
 
export default Picture;