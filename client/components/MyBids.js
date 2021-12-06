import BidItem from "./BidItem";

const MyBids = ({myBids}) => {
    return (
        <div>
            {myBids.map((bid)=>(
                <BidItem key={bid.postID} post={bid}/>
            ))}
        </div>
    );
}
 
export default MyBids;