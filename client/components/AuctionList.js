import { Card } from "react-bootstrap";
import styles from "../styles/Auction.module.css"
import Auction from "./Auction";

const AuctionList = ({postList}) => {
    return ( 
        <div className={styles.auctionList}>
            {postList.map((post)=>(
                <Auction key={post.postID} post={post}></Auction>
            ))}
        </div>
     );
}
 
export default AuctionList;