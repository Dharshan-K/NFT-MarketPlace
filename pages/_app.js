/** @format */

import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT MarketPlace</p>
        <div className="flex mt-4 hover:mt-8">
          <Link href="/">
            <a className="mr-6 text-blue-500">Home</a>
          </Link>
          <Link href="/">
            <a className="mr-6 text-blue-500">Sell</a>
          </Link>
          <Link href="/">
            <a className="mr-6 text-blue-500">My asset</a>
          </Link>
          <Link href="/">
            <a className="mr-6 text-blue-500">Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
