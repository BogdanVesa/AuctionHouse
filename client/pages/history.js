import Navbar from '../components/Navbar';
import {useState} from 'react';
import { useEffect } from 'react';
import Axios from "axios";
import MyPost from "../components/MyPost"
import MyBids from "../components/MyBids"
import styles from '../styles/History.module.css';

const History = () => {
    const [myBids,setMyBids] = useState([]);
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        getMyBids();
      }, [])
      
    const getMyBids =()=>{
        const config = {
            headers : {
                "x-access-token": localStorage.getItem('token'),
            }
        };
        Axios.get("http://localhost:3001/bids/history",config).then((response)=>{
            setMyBids(response.data.myBids)
            setMyPosts(response.data.myPosts)
        })
    }

    return ( 
        <div>
            <Navbar/>
            <div className={styles.history} >
            <MyPost myPosts={myPosts}/>
            <MyBids myBids={myBids}/>
            </div>
        </div>
     );
}
 
export default History;