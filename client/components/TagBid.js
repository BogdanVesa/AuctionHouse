import AuctionList from "./AuctionList";
import TagList from "./TagList";
import styles from "../styles/Auction.module.css"

const TagBid = ({tagList, postList, onAdd, onRemove}) => {
    return ( 
        <div className={styles.tagAuction}>
            <TagList tagList={tagList} onAdd={onAdd} onRemove={onRemove}/>
            <AuctionList postList={postList}/>
        </div>
     );
}
 
export default TagBid;
