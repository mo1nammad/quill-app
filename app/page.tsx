import { ArrowLeft } from "lucide-react";
import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
   return (
      <>
         <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
            <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
               <p className="text-sm font-semibold text-gray-700">
                  کویل اکنون در دسترس است
               </p>
            </div>
            <h4 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
               با <span className="text-violet-600 ">اسناد</span> خودت در چند
               ثانیه صحبت کن
            </h4>
            <p className="mt-5 max-w-prose text-muted-foreground sm:text-xl">
               با کوییل میتونی با پی دی اف خودت صحبت کنی. فقط کافیه فایلشو آپلود
               کنی و ازش سوال بپرسی
            </p>
            <Button size="lg" className="group mt-5 justify-between" asChild>
               <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2 translate-x-4 transition group-hover:translate-x-1.5" />
                  امتحان کن
               </Link>
            </Button>
         </MaxWidthWrapper>

         {/* value proposition section */}

         <div>
            <div className="relative isolate">
               <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
               >
                  <div
                     style={{
                        clipPath:
                           "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                     }}
                     className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                  />
               </div>
               <div>
                  <div className="mx-auto max-w-6xl px-6 lg:px-8">
                     <div className="mt-16 flow-root sm:mt-24">
                        <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                           <Image
                              src="/dashboard-preview.jpg"
                              width={1364}
                              height={866}
                              quality={100}
                              alt="product preview"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
               >
                  <div
                     style={{
                        clipPath:
                           "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                     }}
                     className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
                  />
               </div>
            </div>
         </div>

         {/* Features section */}
         <div className="mx-auto my-32 max-w-5xl sm:mt-56 ">
            <div className="mb-12 px-6 lg:px-8">
               <div className="mx-auto max-w-2xl sm:text-center ">
                  <h2 className="mt-2 font-bold text-4xl text-foreground sm:text-5xl">
                     در عرض چند دقیقه به نتیجه دلخواهت برس
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                     حالا با کویل گپ زدن با فایل PDF خودت آسون تر شده
                  </p>
               </div>
            </div>

            {/* steps */}
            <ol className="my-8 space-y-4 pt-8 md:flex md:gap-x-12 md:space-y-0">
               <li className="md:flex-1">
                  <div className="flex flex-col space-y-2 border-r-4 border-ring py-2 pr-4 md:border-r-0 md:border-t-2 md:pb-0 md:pr-0 md:pt-4">
                     <span className="text-sm font-medium text-primary">
                        قدم 1
                     </span>
                     <span className="text-xl font-semibold">
                        ساخت یک اکانت
                     </span>
                     <span className="mt-2 text-muted-foreground">
                        برای شروع دسترسی به اشتراک رایگان وجود دارد و میتوانید
                        با خرید اشتراک به{" "}
                        <Link
                           className="text-primary underline underline-offset-2"
                           href="/pricing"
                        >
                           پلن حرفه ای
                        </Link>{" "}
                        دسترسی پیدا کنید
                     </span>
                  </div>
               </li>
               <li className="md:flex-1">
                  <div className="flex flex-col space-y-2 border-r-4 border-ring py-2 pr-4 md:border-r-0 md:border-t-2 md:pb-0 md:pr-0 md:pt-4">
                     <span className="text-sm font-medium text-primary">
                        قدم 2
                     </span>
                     <span className="text-xl font-semibold">
                        اپلود کردن فایل خود
                     </span>
                     <span className="mt-2 text-muted-foreground">
                        ما پردازش فایل شما رو انجام خواهیم داد و آن را طی چند
                        ثانیه آماده گپ زدن خواهیم کرد
                     </span>
                  </div>
               </li>
               <li className="md:flex-1">
                  <div className="flex flex-col space-y-2 border-r-4 border-ring py-2 pr-4 md:border-r-0 md:border-t-2 md:pb-0 md:pr-0 md:pt-4">
                     <span className="text-sm font-medium text-primary">
                        قدم 3
                     </span>
                     <span className="text-xl font-semibold">
                        سوالات خود را بپرسید
                     </span>
                     <span className="mt-2 text-muted-foreground">
                        به همین سادگی می توانید اطلاعات خود را از فایل دریافت
                        کنید
                     </span>
                  </div>
               </li>
            </ol>

            <div className="mx-auto max-w-6xl px-6 lg:px-8">
               <div className="mt-16 flow-root sm:mt-24">
                  <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                     <Image
                        src="/file-upload-preview.jpg"
                        width={1419}
                        height={732}
                        quality={100}
                        alt="uploading preview"
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
