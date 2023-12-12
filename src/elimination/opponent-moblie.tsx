type OpponentMobileProps = {
  matchingIndex?: number[];
  points?: number;
  pointsGoal: number;
};

const OpponentMobile: React.FC<OpponentMobileProps> = (
  props: OpponentMobileProps,
) => {

  return (
    <div>
        <progress >75</progress>
    </div>
  );
};

export default OpponentMobile;
