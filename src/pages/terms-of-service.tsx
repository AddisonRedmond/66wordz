import { signIn } from "next-auth/react";
import Link from "next/link";

const TermsOfService = () => {
  return (
    <div className="flex-grow">
      <div className="flex items-center justify-between p-4">
        <Link href="/login" className="cursor-pointer text-4xl font-semibold">
          66
        </Link>
        <button
          onClick={() => signIn()}
          className=" rounded-md bg-black p-2 text-2xl text-white duration-150 ease-in-out hover:bg-zinc-700"
        >
          SIGN IN
        </button>
      </div>
      <main className="prose mx-auto flex max-w-[1000px] flex-grow flex-col">
        <h1>66wordz - Terms of Service</h1>
        <h2>Last Updated: 3/25/2024</h2>
        <h3>Welcome to 66wordz!</h3>
        <p>
          These Terms of Service  (&quot;Terms&quot;) govern your access to and use of the
          66wordz application (&quot;App&quot;), including any content, functionality, and
          services offered through the App. By accessing or using the App, you
          agree to be bound by these Terms. If you do not agree to these Terms,
          please do not access or use the App.
        </p>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using the App, you agree to comply with these Terms
          and any additional terms and conditions that may apply to specific
          features of the App.
        </p>
        <h3>2. Use of the App</h3>
        <p className="m-0">
          2.1. You must be at least 13 years old to use the App.
        </p>
        <p className="m-0">
          2.2. You are responsible for all activities conducted through your
          account.
        </p>
        <p className="m-0">
          2.3. You agree not to use the App for any illegal or unauthorized
          purpose.
        </p>
        <p className="m-0">
          2.4. You agree not to modify, adapt, or hack the App or its servers.
        </p>
        <h3>3. User Content</h3>
        <p className="m-0">
          3.1. You retain ownership of any content you submit, post, or display
          on or through the App (&quot;User Content&quot;).
        </p>
        <p className="m-0">
          3.2. By submitting User Content, you grant 66wordz a worldwide,
          non-exclusive, royalty-free license to use, reproduce, modify, adapt,
          publish, translate, distribute, and display such User Content.
        </p>
        <h3>4. Intellectual Property</h3>
        <p className="m-0">
          4.1. All intellectual property rights in the App and its content
          belong to 66wordz or its licensors.
        </p>
        <p className="m-0">
          4.2. You agree not to infringe upon the intellectual property rights
          of 66wordz or any third party.
        </p>
        <h3>5. Privacy</h3>
        <p className="m-0">
          5.1. Our Privacy Policy governs the collection, use, and disclosure of
          your personal information. By using the App, you consent to the
          collection and use of your information as described in the Privacy
          Policy.
        </p>
        <h3>6. Termination</h3>
        <p className="m-0">
          66wordz may terminate or suspend your access to the App at any time,
          with or without cause, and without prior notice.
        </p>
        <h3>7. Disclaimer of Warranties</h3>
        <p className="m-0">
          THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES
          OF ANY KIND, EXPRESS OR IMPLIED. 66WORDZ DISCLAIMS ALL WARRANTIES,
          INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <h3>8. Limitation of Liability</h3>
        <p className="m-0">
          IN NO EVENT SHALL 66WORDZ BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, ARISING OUT OF OR IN
          CONNECTION WITH THE USE OF THE APP, WHETHER BASED ON WARRANTY,
          CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY.
        </p>
        <h3>9. Governing Law</h3>
        <p className="m-0">
          These Terms shall be governed by and construed in accordance with the
          laws of [Your Jurisdiction], without regard to its conflict of law
          principles.
        </p>
        <h3>10. Changes to Terms</h3>
        <p className="m-0">
          66wordz reserves the right to update or modify these Terms at any time
          without prior notice. Your continued use of the App after any such
          changes constitutes your acceptance of the new Terms.
        </p>

        <h3>11. Contact Us</h3>
        <p className="m-0">
          If you have any questions or concerns about these Terms, please
          contact us at{" "}
          <span className="font-semibold">hosanna_golfers_0o@icloud.com</span>.
        </p>

        <p>
          By using the 66wordz application, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service.
        </p>
      </main>
    </div>
  );
};

export default TermsOfService;
