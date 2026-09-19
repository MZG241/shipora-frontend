import React from 'react'
import { Navbar } from '../(landing)/components/Navbar'
import { TrackHero } from './components/TrackHero'
import { TrackSearch } from './components/TrackSearch'

const page = () => {
  return (
 <div>
<Navbar/>
<TrackHero/>
<TrackSearch/>
    </div>
  )
}

export default page