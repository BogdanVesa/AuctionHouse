import styles from "../styles/Auction.module.css"
import Picture from "./Picture";
import format from 'date-fns/format'

const Auction = ({post}) => {
    return ( 
    <div className={styles.auction}>
        <Picture/>
        <div className={styles.description}>{post.description}</div> 
        <div className={styles.priceDate}>{format(Date.parse(post.endTime), 'd.MM.Y H:m')} ${post.currentPrice}</div>
    </div>
    );
}
 
export default Auction;