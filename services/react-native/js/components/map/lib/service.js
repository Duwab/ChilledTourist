import {Bars} from './bars'


export const getBars = () => Bars.map(formatBar)

const formatBar = (place) => {
  // console.log('format', place)
  let bar = place.info || place;
  return {
    id: bar.id,
    name: bar.name,
    types: bar.types,
    rating: bar.rating,
    place_id: bar.place_id,
    photos: bar.photos,
    coordinate: {
      latitude: bar.geometry.location.lat,
      longitude: bar.geometry.location.lng
    }
  }
}

export const fetchBars = (search) => {
  search = encodeURIComponent((search || '').toLowerCase().replace(/[éèê]/gi, "e").replace(/[àâ]/gi, "a"))
  const url = `https://demo.chilled-tourist.saasify.tech/demo/suggest?search=${search}`
  return fetch(url).then((res) => res.json()).then((body) => {
    // console.log('res', body.places)
    return body.places.map((place) => formatBar(place))
  })
}

export const locationStats = (markers) => {
  if(!markers || !markers.length) {
    return null
  }
  let latitudes = []
  let longitudes = []
  markers.map((marker) => {
    latitudes.push(marker.coordinate.latitude)
    longitudes.push(marker.coordinate.longitude)
  })

  return {
    latitude: arrayStats(latitudes),
    longitude: arrayStats(longitudes)
  }
}

export const arrayStats = (arr) => {
  // takes in input an array of floats (typically lat or lng)
  // returns an objet with misc stats
  let sum = 0
  let count = arr.length
  let min = Math.min(...arr)
  let max = Math.max(...arr)

  arr.map(x => sum += x)
  let mean = sum / count
  let delta = Math.max(max-mean, mean-min)
  return {mean, count, min, delta, initial: arr}
}

export const getVenueDetail = (placeid) => {
  let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${global.conf.GOOGLE_SEARCH_API_KEY}`
  return fetch(url).then((res) => res.json()).then((body) => body.result)
}
