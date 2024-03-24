import { ChangeEvent, useState } from "react";
import EliminationModal from "../../elimination/elimination-modal";
import { api } from "~/utils/api";
import DesktopNavbar from "./desktop";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobielNavbar from "./mobile";
import { AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [issueType, setIssueType] = useState<
    "MARATHON" | "ELIMINATION" | "OTHER"
  >("MARATHON");
  const [message, setMessage] = useState<string>("");
  const [messageNotLongEnough, setMessageNotLongEnough] =
    useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const submitIssue = api.reportIssue.reportIssue.useMutation();

  const isPremiumUser = api.getUser.isPremiumUser.useQuery();

  const isMobile = useIsMobile();

  const handleUpdateMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) return;
    if (e.target.value.length > 10) setMessageNotLongEnough(false);
    setMessage(e.target.value);
  };

  const handleUpdateType = (e: ChangeEvent<HTMLSelectElement>) => {
    setIssueType(e.target.value as "MARATHON" | "ELIMINATION" | "OTHER");
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

                <div className="mt-3">
                  <select
                    onChange={(e) => handleUpdateType(e)}
                    className="rounded-md border-2"
                  >
                    <option value="SURVIVAL">SURVIVAL</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  <label className="flex flex-row">{`Character Count ${message.length} out of 300`}</label>
                  {messageNotLongEnough && (
                    <span className="font-semibold">
                      Message not long enough
                    </span>
                  )}
                  <textarea
                    value={message}
                    onChange={(e) => handleUpdateMessage(e)}
                    className=" h-32 max-h-44 w-full rounded-sm border-2 border-gray-400 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={
                      messageNotLongEnough
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
      <AnimatePresence>
        {isMobile ? (
          <MobielNavbar menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
        ) : (
          <DesktopNavbar
            issueModalIsOpen={setShowModal}
            isPremiumUser={isPremiumUser.data?.isPremiumUser}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
