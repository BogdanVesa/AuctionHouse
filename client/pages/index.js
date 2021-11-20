import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import MainPage from '../components/MainPage'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import AuctionList from '../components/AuctionList'
import TagBid from '../components/TagBid'

export default function Home() {
  return (
    <div>
      <Navbar/>
      <br/>
      <SearchBar />
      <TagBid/>
    </div>
  )
}
