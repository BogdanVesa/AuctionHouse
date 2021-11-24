import styles from "../styles/Auction.module.css"
import Auction from "./Auction";

const AuctionList = ({postList}) => {
    return ( 
        <div className={styles.auctionList}>
            {postList.map((post)=>(
                <Auction post={post}></Auction>
            ))}
        </div>
     );
}
 
export default AuctionList;