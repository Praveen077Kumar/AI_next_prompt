import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase  from '@utils/database';
import User from "@models/user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks:{
        async session( {session} ) {
    const sessionUser = await User.findOne({
        email: session.user.email
    })
    session.user.id = sessionUser._id.toString()
    return session;
    },

    async signIn({ profile }) {
    try {
        // Ensure the database is connected
        await connectToDatabase();

        // Check if the user already exists
        const userExist = await User.findOne({ email: profile.email });

        if (!userExist) {
            // Create a new user if not found
            await User.create({
                email: profile.email,
                username: profile.name.replace(/\s+/g, "").toLowerCase(),
                image: profile.picture,
            });
            console.log(`✅ New user created: ${profile.email}`);
        } else {
            console.log(`✅ User exists: ${profile.email}`);
        }

        // Allow sign-in
        return true;
    } catch (error) {
        // Log error details
        console.error('❌ Error in signIn callback:', error.message);
        return false; // Deny sign-in on error
    }
}


    }

    
})

export {handler as GET, handler as POST};