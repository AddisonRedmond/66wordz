import { AppProps, type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import Head from "next/head";
const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider dynamic {...pageProps}>
      <Head>
        <title>66 Wordz</title>
        <meta
          name="description"
          content="Join 66 Wordz, the ultimate battle royale word game! Compete with up to 66 players in real-time and test your vocabulary skills."
        />
        <meta
          name="keywords"
          content="word game, battle royale, multiplayer word game, brain games, competitive games, vocabulary game"
        />
        <meta name="author" content="Addison Redmond" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          property="og:title"
          content="66 Wordz | Battle Royale Word Game"
        />
        <meta
          property="og:description"
          content="Play 66 Wordz, the exciting battle royale word game! Compete with up to 66 players to win."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://66wordz.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="66 Wordz | Battle Royale Word Game"
        />
        <meta
          name="twitter:description"
          content="Test your vocabulary in 66 Wordz, the competitive battle royale word game!"
        />
        <meta name="twitter:image" content="/twitter-image.png" />
        <meta name="twitter:creator" content="@66wordz" />

        <link rel="canonical" href="https://66wordz.com" />

        <link rel="icon" href="/favicon.png" />

        <link rel="icon" href="/favicon.png" />
      </Head>
      <LazyMotion features={domAnimation}>
        <div className="flex h-screen flex-col">
          <Component {...pageProps} />
        </div>
      </LazyMotion>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
