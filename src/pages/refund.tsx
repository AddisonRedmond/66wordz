import { signIn } from "next-auth/react";
import Link from "next/link";

const Refund = () => {
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
        <h1>66wordz - Refund Policy</h1>
        <h2>Last Updated: 3/25/2024</h2>
        <p>
          Thank you for upgrading to the Gold account on 66wordz. We strive to
          provide you with the best possible experience. If you are not entirely
          satisfied with your Gold account purchase, we're here to help.
        </p>

        <h3>Refunds</h3>
        <p>
          We offer refunds on a case-by-case basis for purchases of the Gold
          account made directly through the 66wordz application. If you would
          like to request a refund, please contact us within [insert number]
          days of your purchase with details of your request.
        </p>

        <h3>Refund Eligibility</h3>
        <p className="m-0">
          To be eligible for a refund, the following conditions must be met:
        </p>
        <ul className="m-0">
          <li>
            Your request for a refund must be made within [insert number] days
            of the original purchase date.
          </li>
          <li>
            The reason for the refund request must be valid and compliant with
            our refund policy.
          </li>
        </ul>
        <h3>Gold Account Features</h3>
        <p>
          Please note that the Gold account provides access to additional
          features and benefits beyond those available with a free account.
          Refunds will only be considered for the Gold account subscription fee,
          not for any benefits or features already accessed or utilized during
          the subscription period.
        </p>
        <h3>Non-refundable Items</h3>
        <p className="m-0">
          Certain items are not eligible for refunds. These include, but are not
          limited to:
        </p>
        <ul className="m-0">
          <li>
            Services provided through the Gold account that have been fully
            utilized or accessed.
          </li>
          <li>Benefits or features accessed during the subscription period.</li>
        </ul>

        <h3>Refund Process</h3>
        <p>
          Once your refund request is received and approved, we will initiate a
          refund of the Gold account subscription fee to your original method of
          payment. The time it takes for the refund to be processed may vary
          depending on your payment provider.
        </p>

        <h3>Contact Us</h3>
        <p>
          If you have any questions about our Gold account refund policy or
          would like to request a refund, please contact us at{" "}
          <span className="font-semibold">hosanna_golfers_0o@icloud.com</span>.
          .
        </p>
      </main>
    </div>
  );
};

export default Refund;
