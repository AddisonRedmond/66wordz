import Image from "next/image";
// import profile from "../../public/PersonCircle.svg";
import bug from "../../public/bug.svg";
import { signOut } from "next-auth/react";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import EliminationModal from "../elimination/elimination-modal";
import { api } from "~/utils/api";
const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [issueType, setIssueType] = useState<
    "MARATHON" | "ELIMINATION" | "OTHER"
  >("MARATHON");
  const [message, setMessage] = useState<string>("");
  const [messagNotLongEnough, setMessageNotLongEnough] =
    useState<boolean>(false);
  const submitIssue = api.reportIssue.reportIssue.useMutation();

  const handleSignOut: MouseEventHandler = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) return;
    if (e.target.value.length > 10) setMessageNotLongEnough(false);
    setMessage(e.target.value);
  };

  const handleUpdateType = (e: ChangeEvent<HTMLSelectElement>) => {
    setIssueType(e.target.value as "MARATHON" | "ELIMINATION" | "OTHER");
  };

  const openReportBugModal = () => {
    setShowModal(true);
  };

  const handleSubmitIssue = () => {
    if (message.length < 10) {
      setMessageNotLongEnough(true);
      return;
    }
    // todo: add info saying text was too short
    submitIssue.mutate({ issueType: issueType, message: message });
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    submitIssue.reset();
    setMessage("");
    setIssueType("MARATHON");
    setMessageNotLongEnough(false);
  };

  return (
    <>
      {showModal && (
        <EliminationModal>
          <>
            {submitIssue.isSuccess && (
              <div className="rounded-md bg-green-500 p-2 text-white">
                <p>
                  Issue Submitted! We will take a look and address it as soon as
                  possible!
                </p>
                <button
                  onClick={() => {
                    closeAndResetModal();
                  }}
                  className="rounded-md border-2 p-1"
                >
                  Close
                </button>
              </div>
            )}
            {submitIssue.isError && (
              <div className="rounded-md bg-red-500 p-2 text-white">
                <p>Something went wrong! Please try again later!</p>
                <button
                  onClick={() => {
                    closeAndResetModal();
                  }}
                  className="rounded-md border-2 p-1"
                >
                  Close
                </button>
              </div>
            )}
            {!submitIssue.data && !submitIssue.isError && (
              <div className="px-2">
                <p className=" text-2xl font-semibold">Report a Bug or Issue</p>
                <p className=" text-xs">
                  Let us know the issue and <br />
                  we will fix it as soon as we can! 😊
                </p>
                <div className="mt-3">
                  <select
                    onChange={(e) => handleUpdateType(e)}
                    className="rounded-md border-2"
                  >
                    <option value="MARATHON">MARATHON</option>
                    <option value="ELIMINATION">ELIMINATION</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  <label className="flex flex-row">{`Character Count ${message.length} out of 300`}</label>
                  {messagNotLongEnough && (
                    <span className="font-semibold">
                      Message not long enough
                    </span>
                  )}
                  <textarea
                    value={message}
                    onChange={(e) => handleUpdateMessage(e)}
                    className=" h-32 w-full rounded-md border-2 border-gray-400 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={
                      messagNotLongEnough
                        ? "Summay isn't log enough"
                        : "What happened?"
                    }
                  ></textarea>
                </div>
                <div className="flex flex-row justify-around">
                  <button
                    onClick={() => handleSubmitIssue()}
                    className="rounded-md bg-neutral-950 p-1 font-semibold text-white"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      closeAndResetModal();
                    }}
                    className="rounded-md border-2 p-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        </EliminationModal>
      )}
      <div className="absolute top-0 z-10 flex h-14 w-screen flex-row items-center justify-between px-8">
        <p className="cursor-pointer text-4xl font-semibold">66</p>
        <div className="relative flex justify-center">
          {/* <Image
            onClick={handleSignOut}
            className="cursor-pointer"
            height={40}
            src={profile}
            alt="profile icon"
          /> */}
          <button
            className="rounded-md bg-black p-2 sm:text-sm font-semibold text-white text-xs"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <Image
            onClick={() => openReportBugModal()}
            title="report a bug or an issue"
            className="invisible absolute top-14 cursor-pointer sm:visible"
            src={bug}
            alt="bug icon"
            height={15}
            width={15}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
