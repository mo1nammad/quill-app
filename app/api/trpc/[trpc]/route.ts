import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/router";

const handler = (req: Request) =>
   fetchRequestHandler({
      router: appRouter,
      req,
      endpoint: "/api/trpc",
      createContext: () => ({}),
   });

export { handler as GET, handler as POST };
