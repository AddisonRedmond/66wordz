import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Modal from "../modal";
import { useState } from "react";
import { EliminationPlayerData } from "~/custom-hooks/useEliminationData";
type MobileOpponentsProps = {
  opponents?: EliminationPlayerData;
  userId: string;
  pointsGoal: number;
};

const MobileOpponents: React.FC<MobileOpponentsProps> = (props) => {
  const [showModal, setShowModal] = useState(false);
  // need to get the top 9 opponents
  // map over to show their points and revealIndex
  const calculatePrecentage = (points: number, pointsGoal: number) => {
    return (points / pointsGoal) * 100;
  };
  return (
    <div>
      {showModal && (
        <Modal>
          <div>
            <div className="relative py-3">
              <button
                className="absolute -top-1 right-5 rounded-md border-2 border-zinc-700 p-1 font-semibold"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <p className="text-xl font-semibold">Opponents</p>
            </div>

            <div className="relative w-[90vw]">
              <div className="grid grid-cols-5 gap-y-2">
                {props.opponents &&
                  Object.entries(props.opponents).map(([playerId, player]) => {
                    if (props.userId === playerId) return;
                    return (
                      <div
                        key={playerId}
                        onClick={() => setShowModal(true)}
                        className=" m-auto size-14"
                      >
                        <CircularProgressbarWithChildren
                          value={calculatePrecentage(
                            player.points,
                            props.pointsGoal,
                          )}
                          strokeWidth={12}
                          styles={buildStyles({
                            pathColor: "#10b981",
                            strokeLinecap: "round",
                            trailColor: "#d3d3d3",
                            pathTransitionDuration: 0.5,
                          })}
                        >
                          <p className="flex items-center justify-center text-xl font-semibold">
                            {player.initials}
                          </p>
                        </CircularProgressbarWithChildren>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <p className="my-2 font-semibold">Opponents</p>
      <div className="grid grid-flow-col grid-rows-2 gap-y-4 ">
        {props.opponents &&
          Object.entries(props.opponents)
            .slice(0, 9)
            .map(([playerId, player]) => {
              return (
                <div key={playerId} className=" m-auto size-14">
                  <CircularProgressbarWithChildren
                    value={calculatePrecentage(player.points, props.pointsGoal)}
                    strokeWidth={12}
                    styles={buildStyles({
                      pathColor: "#10b981",
                      strokeLinecap: "round",
                      trailColor: "#d3d3d3",
                      pathTransitionDuration: 0.5,
                    })}
                  >
                    <p className="h-fit text-sm font-semibold">
                      {player.initials}
                    </p>
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
