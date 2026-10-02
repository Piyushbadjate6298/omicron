export const serviceOptions = {
  'Vehicle Rental': [
    'Outstation Rides',
    'City Rides',
    'Airport Transfers',
    'One-Way Rentals',
  ],
  'Luxury Vehicles': [
    'Corporate Travel',
    'Wedding Transportation',
    'Birthday & Celebration Transportation',
    'Party & Event Transportation',
    'Luxury Car Rental',
    'Group / Convoy Transportation',
  ],
  'Customized Domestic Tours': [
    'Corporate Tours & Events',
    'Religious Tours',
    'Adventure Tours',
    'Pilgrimage Tours',
    'Goa Tours',
    'Educational Tours',
    'Honeymoon Packages',
    'Family Trips',
    'Group Trips',
    'Trekking & Adventure Packages',
  ],
  'Tour Packages': [
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Uttarakhand',
    'Rajasthan',
    'Goa',
    'Kerala',
    'Maharashtra',
    'Gujarat',
    'Karnataka',
    'Tamil Nadu',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'North-East India',
    'Other Destination',
  ],
}

export const serviceNames = Object.keys(serviceOptions)

export const services = [
  { title: 'Vehicle Rental', text: 'Flexible city, airport, outstation and one-way rentals for journeys of every size.', icon: 'car' },
  { title: 'Luxury Vehicles', text: 'Premium vehicles for corporate travel, weddings, celebrations and group movements.', icon: 'crown' },
  { title: 'Customized Domestic Tours', text: 'Tailor-made corporate, family, pilgrimage, educational and adventure experiences.', icon: 'route' },
  { title: 'Tour Packages', text: 'Curated packages across India, from the Himalayas and North-East to coastal escapes.', icon: 'map' },
]
