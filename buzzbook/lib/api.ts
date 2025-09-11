const api = process.env.NEXT_PUBLIC_API 
export const route = {
    'register' : api + 'auth/register',
    'login' : api + 'auth/login',
    'forgot_password' : api + 'auth/sendpasswordLink',
    'logout' : api + 'auth/logout',
    'validUser':api+'auth/validUser',
    'location' : api + 'location/',
    'movie': api + 'movie/getMovie/',
    'movieDetails' : api + 'movie/movieDetails/',
    'theatre' : api +'theater/get_theater/',
    'comingSoon' : api + 'movie/comingSoon'
    
}