import NextAuth, { DefaultSession, Session, SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { ConnectionWithMongoose } from '@/lib/mongoose'
import { envVariables } from '@/config/config'
import UserModel from '@/lib/User'
import bcrypt from 'bcryptjs'
import { JWT } from 'next-auth/jwt'

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {label: "Email", type: "email", placeholder: "Email"},
        password: {label: "Password", type: "password", placeholder: "Password"},
      },
      async authorize(credentials): Promise<any> {
        if(!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        // console.log("Credentials: ", credentials)
        await ConnectionWithMongoose();
        try {
          const user = await UserModel.findOne({email: credentials?.email})
          if(!user) {
            throw new Error("No user found with this email id");
          }
          // console.log("User: ", user);          
          if(!user.emailVerified) {
            throw new Error("Please verify your email before login")
          }
          const isPasswordCorrect = await bcrypt.compare(
            <string>credentials?.password, user.password
          );
          // console.log(isPasswordCorrect);          
          if(!isPasswordCorrect) {
            console.log("Incorrect Password given!")
            return null;
          }
          return user;
        }
        catch(err: any) {
          console.log(err)
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24,
  },
  callbacks: {
    async session({session, token}) {
      if(token) {
        session.user._id = token._id?.toString()
        session.user.name = token.name
        session.user.email = token.email
        session.user.username = token.username
        session.user.emailVerified = token.emailVerified as boolean
        session.user.verifiedAsAdmin = token.verifiedAsAdmin
        session.user.image = token.picture
      }
      return session as Session | DefaultSession;
    },

    async jwt({token, user}) {
      if(user) {
        token._id = user._id?.toString()
        token.email = user.email
        token.name = user.name
        token.username = user.username
        token.emailVerified = user.emailVerified as boolean
        token.verifiedAsAdmin = user.verifiedAsAdmin
        token.picture = user.image
        token.sub = "sub-token"
      }
      return token as JWT;
    }
  },
  secret: envVariables.nextAuthSecretKey as string,
  pages: {
    signIn: '/auth/login',
  }
})