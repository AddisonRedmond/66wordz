import { motion } from "framer-motion";

const Qualified: React.FC = () => {
  const container = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1,
      },
    },
  };
  const tile = {
    visible: {
      rotateZ: [-360, 0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, -10, 0],
    },
  };

  return (
    <div className="border-2-600 relative w-72 p-20 text-center">
      <div className="absolute left-3 top-3">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          animate="visible"
          variants={container}
          className="flex text-2xl font-semibold justify-center"
        >
          {"QUALIFIED".split("").map((letter: string, index: number) => {
            return (
              <motion.p
                variants={tile}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  duration: 3,
                  times: [0, 0.15, 0.2, 0.65, 0.7, 0.75],
                }}
                key={`${letter}${index}`}
              >
                {letter}
              </motion.p>
            );
          })}
        </motion.div>
        <p className=" text-xs text-neutral-500">
          Congratulations! You have qualified for the next round!
        </p>
      </div>
      <div className="flex justify-center">
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            pathLength: { type: "spring", duration: 1.5, bounce: 0 },
          }}
        >
          <motion.path
            d="M15.4931 3.125C15.4931 2.2962 15.8223 1.50134 16.4084 0.915291C16.9944 0.32924 17.7893 0 18.6181 0L81.1181 0C81.9469 0 82.7418 0.32924 83.3278 0.915291C83.9139 1.50134 84.2431 2.2962 84.2431 3.125C84.2431 6.4875 84.1681 9.6875 84.0306 12.725C86.5002 13.1339 88.8629 14.0332 90.9793 15.3699C93.0958 16.7065 94.9232 18.4534 96.3538 20.5076C97.7844 22.5617 98.7892 24.8815 99.3089 27.3302C99.8286 29.7788 99.8528 32.3068 99.3799 34.7649C98.9071 37.2231 97.9468 39.5616 96.5557 41.6427C95.1646 43.7238 93.3709 45.5053 91.2804 46.8822C89.1898 48.259 86.8448 49.2033 84.3834 49.6593C81.9221 50.1154 79.3944 50.0739 76.9493 49.5375C72.0118 61.1938 65.2118 66.8938 59.2431 68.3563V81.9375L68.1493 84.1625C69.3618 84.4625 70.5056 85.0062 71.5056 85.7562L82.9931 94.375C83.5178 94.7685 83.9054 95.3172 84.1009 95.9432C84.2965 96.5693 84.2901 97.241 84.0827 97.8632C83.8753 98.4854 83.4774 99.0266 82.9453 99.4101C82.4132 99.7936 81.774 100 81.1181 100H18.6181C17.9622 100 17.323 99.7936 16.7909 99.4101C16.2588 99.0266 15.8609 98.4854 15.6535 97.8632C15.4461 97.241 15.4397 96.5693 15.6352 95.9432C15.8308 95.3172 16.2184 94.7685 16.7431 94.375L28.2306 85.7562C29.2306 85.0062 30.3743 84.4625 31.5868 84.1625L40.4931 81.9375V68.3563C34.5243 66.8938 27.7243 61.1938 22.7868 49.5313C20.3405 50.0706 17.8109 50.1142 15.3474 49.6596C12.8839 49.205 10.5365 48.2614 8.4438 46.8845C6.35109 45.5075 4.55552 43.7252 3.16313 41.6427C1.77075 39.5602 0.809777 37.2198 0.336978 34.7598C-0.135821 32.2997 -0.110864 29.7698 0.410377 27.3196C0.931618 24.8693 1.93857 22.5484 3.37177 20.4938C4.80497 18.4392 6.63535 16.6926 8.75482 15.3572C10.8743 14.0218 13.2399 13.1247 15.7118 12.7188C15.5647 9.52296 15.4918 6.32418 15.4931 3.125ZM16.1118 19C12.8505 19.5967 9.9598 21.4646 8.07565 24.1927C6.1915 26.9207 5.46823 30.2855 6.06497 33.5469C6.66171 36.8082 8.52956 39.6989 11.2576 41.5831C13.9857 43.4672 17.3505 44.1905 20.6118 43.5937C18.5306 37.0312 16.9368 28.9312 16.1118 19ZM79.1306 43.5937C82.3919 44.1905 85.7567 43.4672 88.4848 41.5831C91.2129 39.6989 93.0807 36.8082 93.6775 33.5469C94.2742 30.2855 93.5509 26.9207 91.6668 24.1927C89.7826 21.4646 86.8919 19.5967 83.6306 19C82.7993 28.9375 81.2056 37.0312 79.1306 43.5937ZM21.7681 6.25C21.8118 9.48125 21.9306 12.5375 22.1181 15.4313C22.9306 28.1063 24.9743 37.5938 27.5556 44.6C32.9556 59.25 40.3931 62.5 43.6181 62.5C44.4469 62.5 45.2418 62.8292 45.8278 63.4153C46.4139 64.0013 46.7431 64.7962 46.7431 65.625V81.9375C46.7431 83.3308 46.2775 84.6841 45.4203 85.7825C44.563 86.8809 43.3634 87.6614 42.0118 88L33.0993 90.225C32.6947 90.3257 32.3143 90.5063 31.9806 90.7562L27.9931 93.75H71.7431L67.7556 90.7562C67.4199 90.5057 67.0374 90.3251 66.6306 90.225L57.7243 88C56.3728 87.6614 55.1732 86.8809 54.3159 85.7825C53.4587 84.6841 52.9931 83.3308 52.9931 81.9375V65.625C52.9931 64.7962 53.3223 64.0013 53.9084 63.4153C54.4944 62.8292 55.2893 62.5 56.1181 62.5C59.3431 62.5 66.7806 59.25 72.1806 44.6C74.7618 37.6 76.8056 28.1 77.6181 15.4313C77.8056 12.5375 77.9243 9.48125 77.9681 6.25H21.7681Z"
            fill="black"
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default Qualified;
