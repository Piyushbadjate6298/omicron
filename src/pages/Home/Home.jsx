import Hero from '../../components/sections/Hero'
import { WhyOmicron, LuxuryExperience, TailoredTravel, HomeCTA } from '../../components/sections/HomeSections'
import CustomerReviews from '../../components/sections/CustomerReviews'
import { DestinationCarousel, PackageCarousel, JournalCarousel } from '../../components/ui/HomeCarousels'
import './Home.css'
export default function Home({onInquiry}) {
 return <div className="premium-home"><Hero onInquiry={onInquiry}/><WhyOmicron/><DestinationCarousel onInquiry={onInquiry}/><PackageCarousel onInquiry={onInquiry}/><LuxuryExperience onInquiry={onInquiry}/><TailoredTravel onInquiry={onInquiry}/><CustomerReviews /><JournalCarousel/><HomeCTA onInquiry={onInquiry}/></div>
}
