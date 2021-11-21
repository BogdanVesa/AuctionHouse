import AuctionList from "./AuctionList";
import TagList from "./TagList";
import styles from "../styles/Auction.module.css"

const TagBid = ({tagList}) => {
    return ( 
        <div className={styles.tagAuction}>
            <TagList tagList={tagList}/>
            <AuctionList/>
        </div>
     );
}
 
export default TagBid;
