import {auth} from '@/auth.js';
import {
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT, protectedRoutes
} from '@/routes';

export default auth ((req)=>{
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const isAdmin = isLoggedIn ? (req.auth?.user?.role === 'ADMIN') : false;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAdminRoute = protectedRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if(isApiAuthRoute){
        return null;
    }
    if(isAuthRoute){
        if(isLoggedIn){
            if(isAdmin){
                return Response.redirect(new URL(protectedRoutes[0], nextUrl));
            } else return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }
    if(!isLoggedIn  && !isPublicRoute){
        return Response.redirect(new URL('/login', nextUrl));
    }
    if(!isAdmin && isAdminRoute){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
})
export const config = {
    //https://clerk.com/docs/references/nextjs/clerk-middleware#protect-routes-based-on-authentication-status
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
