import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import MainPage from '../components/MainPage'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import AuctionList from '../components/AuctionList'
import TagBid from '../components/TagBid'
import { useEffect } from 'react'
import { useState } from 'react'
import Axios from 'axios'

export default function Home() {

  useEffect(() => {
    getTaglist();
  }, [])

  const [tagList,setTagList] = useState([]);

  const getTaglist =() =>{
    Axios.get("http://localhost:3001/allTags").then((response =>{
      console.log(response.data);
      setTagList(response.data);
    }));
  }


  return (
    <div>
      <Navbar/>
      <br/>
      <SearchBar />
      <TagBid tagList={tagList} />
    </div>
  )
}
