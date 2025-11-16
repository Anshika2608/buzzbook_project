const api = process.env.NEXT_PUBLIC_API 
export const route = {
    'register' : api + 'auth/register',
    'login' : api + 'auth/login',
    'forgot_password' : api + 'auth/sendpasswordLink',
    'logout' : api + 'auth/logout',
    'validUser':api+'auth/validUser',
    'refreshToken':api+'auth/refresh-token',
    'location' : api + 'location/',
    'movie': api + 'movie/getMovie/',
    'movieDetails' : api + 'movie/movieDetails/',
    'theatre' : api +'theater/get_theater/',
    'comingSoon' : api + 'movie/comingSoon',
    'showtime':api + 'showtime/get_Showtime',
    'priceRange': api + 'theater/prices',
    'theatreByPrice': api + 'theater/filterTheaters',
    'uniqueTime': api + 'showtime/filterShowtime',
    'seat' : api + 'theater/seat_Layout',
    'hold' : api + 'booking/hold-seats',
    'snacks' : api + 'snack/snack_list/',
    'createPayment':api+'payment/create-order',
    'verifyPayment':api+'payment/capture-order',
    'wishlist':api + 'wishlist'

}