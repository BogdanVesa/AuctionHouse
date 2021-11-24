import AuctionList from "./AuctionList";
import TagList from "./TagList";
import styles from "../styles/Auction.module.css"

const TagBid = ({tagList, postList}) => {
    return ( 
        <div className={styles.tagAuction}>
            <TagList tagList={tagList}/>
            <AuctionList postList={postList}/>
        </div>
     );
}
 
export default TagBid;
