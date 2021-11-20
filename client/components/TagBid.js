import AuctionList from "./AuctionList";
import TagList from "./TagList";
import styles from "../styles/Auction.module.css"

const TagBid = () => {
    return ( 
        <div className={styles.tagAuction}>
            <TagList/>
            <AuctionList/>
        </div>
     );
}
 
export default TagBid;
