import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="flex-grow">
      <div className="flex items-center justify-between p-4">
        <Link href="/login" className="cursor-pointer text-4xl font-semibold">
          66
        </Link>
        <SignInButton>
          <button className="rounded-md bg-black p-2 text-2xl text-white duration-150 ease-in-out hover:bg-zinc-700">
            SIGN IN
          </button>
        </SignInButton>
      </div>
      <main className="prose mx-auto flex max-w-[1000px] flex-grow flex-col">
        <h1>66wordz - Privacy Policy</h1>
        <h2>Last Updated: 3/25/2024</h2>

        <p>
          Your privacy is important to us. This Privacy Policy explains how
          66wordz (&quot;we&quot; or &quot;us&quot;) collects, uses, and
          discloses information when you use our application, 66wordz (the
          &quot;App&quot;).
        </p>

        <h3>1. Information We Collect</h3>

        <p className="m-0">
          1.1. Information You Provide: When you use the App, you may provide us
          with certain information, including but not limited to:
        </p>

        <ul>
          <li>
            1.1. Google: Information provided by Google&apos;s OAuth2
            authentication, such as your name, email address, profile picture,
            and any other information you have made publicly available on your
            Google account.
          </li>

          <li>
            1.2. Twitch: Information provided by Twitch&apos;s OAuth2
            authentication, such as your Twitch username, display name, profile
            picture, and any other information you have made publicly available
            on your Twitch account.
          </li>

          <li>
            1.3. Twitter: Information provided by Twitter&apos;s OAuth2
            authentication, such as your Twitter handle, profile picture, and
            any other information you have made publicly available on your
            Twitter account.
          </li>
        </ul>
        <h3>2. Use of Information</h3>
        <p className="m-0">
          We use the information collected from OAuth2 providers to:
        </p>
        <p className="m-0">
          2.1. Authenticate Users: To verify your identity and allow you to
          access and use the App.
        </p>
        <p className="m-0">
          2.2. Personalize Content: To provide personalized content and
          recommendations based on the information available from the OAuth2
          providers.
        </p>
        <h3>3. Sharring of Information</h3>
        <p className="m-0">
          We do not share the information collected from OAuth2 providers with
          third parties except as necessary to operate, maintain, and improve
          the App
        </p>

        <h3>4. Data Retention</h3>
        <p className="m-0">
          We will retain the information collected from OAuth2 providers for as
          long as necessary to fulfill the purposes outlined in this Privacy
          Policy unless a longer retention period is required or permitted by
          law.
        </p>

        <h3>5. Security</h3>
        <p className="m-0">
          We take reasonable measures to protect the information collected from
          OAuth2 providers from unauthorized access, disclosure, alteration, or
          destruction. However, no method of transmission over the internet or
          electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>

        <h3>6. Children&apos;s Privacy</h3>
        <p className="m-0">
          The App is not directed to individuals under the age of 13, and we do
          not knowingly collect personal information from children.
        </p>
        <h3>7. Changes to this Privacy Policy</h3>
        <p className="m-0">
          We reserve the right to update or modify this Privacy Policy at any
          time. We will notify you of any changes by posting the new Privacy
          Policy on this page.
        </p>

        <h3>8. Contact Us</h3>
        <p className="m-0">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
          <span className="font-semibold">hosanna_golfers_0o@icloud.com</span>.
        </p>

        <p>
          By using the 66wordz application, you acknowledge that you have read,
          understood, and agree to be bound by this Privacy Policy.
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
