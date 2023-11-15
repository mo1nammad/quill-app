import { initTRPC, TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const t = initTRPC.create();
const middleware = t.middleware;

// middleware
export const isAuth = t.middleware(async (opts) => {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

   return opts.next({
      ctx: {
         userId: user.id,
      },
   });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
