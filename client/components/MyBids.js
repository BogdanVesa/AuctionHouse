import BidItem from "./BidItem";
import styles from '../styles/History.module.css'

const MyBids = ({myBids}) => {
    return (
        <div className={styles.postList}>
            <div className={styles.title}>Your bids</div>
            {myBids.map((bid)=>(
                <BidItem key={bid.postID} bid={bid}/>
            ))}
        </div>
    );
}
 
export default MyBids;