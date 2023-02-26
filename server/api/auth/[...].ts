import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  pages: {
    signIn: "/login",
  },

  // secret needed to run nuxt-auth in production mode (used to encrypt data)
  secret: "$iAmtheSect",
  providers: [
    CredentialsProvider.default({
      name: "Credentials",
      async authorize(credentials: any) {
        // Set the authorization
        // create and return users data
        console.log(credentials);
        return {
          email: credentials.email,
          id: credentials.id,
          token: credentials.token,
        };
      },
    }),
  ],
});
