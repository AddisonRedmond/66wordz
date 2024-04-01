import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Modal from "../modal";
import { useState } from "react";
import { EliminationPlayerData } from "~/custom-hooks/useEliminationData";
type MobileOpponentsProps = {
  opponents?: EliminationPlayerData;
};

const MobileOpponents: React.FC<MobileOpponentsProps> = (props) => {
  const [showModal, setShowModal] = useState(false);
  // need to get the top 9 opponents
  // map over to show their points and revealIndex
  return (
    <div>
      {showModal && (
        <Modal>
          <div>
            <p>Opponents</p>
            <div className="relative w-[90vw]">
              <button className="absolute " onClick={() => setShowModal(false)}>
                Close
              </button>

              {props.opponents &&
                Object.entries(props.opponents).map(([playerId, player]) => {
                  return (
                    <div key={playerId}>
                      <p>{playerId}</p>
                      <p>{player.points}</p>
                      <p>{player.revealIndex}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </Modal>
      )}
      <p className="my-2 font-semibold">Opponents</p>
      <div className="grid grid-flow-col grid-rows-2 gap-y-4 ">
        {Array.from({ length: 9 }).map((_, index) => {
          return (
            <div key={index} className=" m-auto size-14">
              <CircularProgressbarWithChildren
                value={75}
                strokeWidth={12}
                styles={buildStyles({
                  pathColor: "#10b981",
                  strokeLinecap: "round",
                  trailColor: "#d3d3d3",
                  pathTransitionDuration: 0.5,
                })}
              >
                <p className="h-fit text-sm font-semibold">AR</p>
                {/* <div className="flex gap-1">
                  <div className="size-1 bg-green-600"></div>
                  <div className="size-1 bg-green-600"></div>
                  <div className="size-1 bg-green-600"></div>
                  <div className="size-1 bg-green-600"></div>
                  <div className="size-1 bg-green-600"></div>
                </div> */}
              </CircularProgressbarWithChildren>
            </div>
          );
        })}
        <div onClick={() => setShowModal(true)} className=" m-auto size-14">
          <CircularProgressbarWithChildren
            value={0}
            strokeWidth={12}
            styles={buildStyles({
              pathColor: "#10b981",
              strokeLinecap: "round",
              trailColor: "#d3d3d3",
              pathTransitionDuration: 0.5,
            })}
          >
            <p className="flex items-center justify-center text-xl font-semibold">
              ...
            </p>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
};

export default MobileOpponents;
