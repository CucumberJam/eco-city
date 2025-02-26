import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import {loginAPI} from "@/app/_lib/actions/auth";
export const {auth, handlers, signIn, signOut} = NextAuth({
    session: {strategy: 'jwt'},
    providers: [
        Credentials({
        credentials: {
            email: {},
            password: {},
        },
        //https://nextjs.org/learn/dashboard-app/adding-authentication#adding-the-sign-in-functionality
        async authorize(credentials) {
            if(!credentials) return null;
            try {
                let user = null;
                const response = await loginAPI(credentials?.email, credentials?.password);
                if(response.status === 'success'){
                    user = {...response.data};
                    user.token = response.token;
                    return user;
                }else if(response.status === 'error') throw new Error(response?.message);
                else throw new Error("Пользователь не найден");
            }catch (e) {
                throw new Error(e);
            }
        },
    })],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({token, user, trigger, session}){
            if (trigger === "update" && session) {
                // Обновляем токен новыми данными пользователя
                token.user = { ...token.user, ...session };
                return token;
            }
            if (user) {
                if(!token?.accessToken) token.accessToken = user?.token || '';

                if(!token?.user) token.user = {};
                if(!token.user?.id) token.user.id = +user.id;
                if(!token.user?.website) token.user.website = user.website;
                if(!token.user?.ogrn) token.user.ogrn = user.ogrn;
                if(!token.user?.role) token.user.role = user.role;
                if(!token.user?.cityId) token.user.cityId = user.cityId;
                if(!token.user?.wastes) token.user.wastes = user.wastes;
                if(!token.user?.wasteTypes) token.user.wasteTypes = user.wasteTypes;
                if(!token.user?.address) token.user.address = user.address;
                if(!token.user?.latitude) token.user.latitude = user.latitude;
                if(!token.user?.longitude) token.user.longitude = user.longitude;
                if(!token.user?.workingHourStart) token.user.workingHourStart = user.workingHourStart;
                if(!token.user?.workingHourEnd) token.user.workingHourEnd = user.workingHourEnd;
                if(!token.user?.workingDays) token.user.workingDays = user.workingDays;
                if(!token.user?.phone) token.user.phone = user.phone;
            }

            return token;
        },
        async session({token, session}){
            if(token?.accessToken){
                session.accessToken = token?.accessToken;
            }
            if(token?.user){
                session.user = {...session.user, ...token?.user};
            }
            return session;
        }
    },
});