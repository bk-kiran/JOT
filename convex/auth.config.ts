export default {
  providers: [
    {
      // Clerk acts as the JWT provider.
      // Replace with your actual Clerk Frontend API URL.
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
