import styles from "../styles/Auction.module.css"
import Auction from "./Auction";

const AuctionList = () => {
    return ( 
        <div className={styles.auctionList}>
            <Auction/>
        </div>
     );
}
 
export default AuctionList;