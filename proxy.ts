import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/saved/:path*",
    "/collections/:path*",
    "/billing/:path*",
    "/pro/:path*"
  ],
};
