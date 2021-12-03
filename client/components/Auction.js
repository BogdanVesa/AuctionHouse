import styles from "../styles/Auction.module.css"
import Picture from "./Picture";
import format from 'date-fns/format'

const Auction = ({post}) => {
    return ( 
    <div className={styles.auction}>
        <Picture postID = {post.postID}/>
        <div className={styles.description}>{post.description}</div> 
        <div className={styles.priceDate}>
            <div>Ends at:</div>
            <div>{format(Date.parse(post.endTime), 'd.MM.Y H:m')}</div> 
            <div>Price: ${post.currentPrice}</div>
            </div>
    </div>
    );
}
 
export default Auction;