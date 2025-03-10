import React from "react";
import "@/styles/globals.css";
import Layout from "../components/Layout";
import Providers from "../components/Providers";
import CurrencyPopup from "../components/CurrencyPopup";

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
        <CurrencyPopup />
      </Layout>
    </Providers>
  );
}