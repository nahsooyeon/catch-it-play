
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={"flex flex-col h-screen"}>
      <main className={"flex flex-col justify-center h-4/5 bg-primary py-10 lg:py-14"}>
        <div
          className={"mt-auto lg:text-9xl text-8xl font-normal text-shadow"}
          style={{
            color: '#000',
            textAlign: 'center',
            WebkitTextStrokeWidth: ".625rem",
            WebkitTextStrokeColor: '#FFF',
            paintOrder: 'stroke fill',
            lineHeight: "85.938%",
            letterSpacing: "-0.10em",
          }}
        >
          WORD<br />SEARCH
        </div>
        <Link className={"h-20 mt-auto shadow-bottom  flex items-center justify-center w-1/2 mx-auto bg-white rounded-3xl text-center text-3xl"} href="/play">
          START
        </Link>
      </main>
      <footer className={"flex mt-auto p-5 items-center justify-between bg-[#EDEDED] "}>
        <div className={"md:text-lg flex *:text-2xl flex-col items-center"}>
          <p>creator</p>
          <p>NahPomme</p>
          <p>v2025.01</p>
        </div>
        <div className={"flex items-end"}>
          <div className={"bg-white rounded-l-[.625rem] flex items-center text-2xl justify-center h-8 w-16"}>CV</div>
          <Image src="/qrcode_cv.webp" className={"bg-white"} width={136} height={136} alt="QR Code" />
        </div>
      </footer>
    </div>
  );
}
