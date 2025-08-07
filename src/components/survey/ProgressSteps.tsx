interface ProgressStepsProps {
  step: number;                // Step hiện tại (bắt đầu từ 1)
  totalSteps: number;          // Tổng số step (4)
  onStepClick?: (step: number) => void; // Callback khi click vào step
}

export default function ProgressSteps({ step, totalSteps, onStepClick }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8 select-none">
      {[...Array(totalSteps)].map((_, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === step;
        const isDone = stepNum < step;
        // Hàm handle click
        const handleStepClick = () => {
          if (onStepClick) onStepClick(stepNum);
        };
        return (
          <div key={idx} className="flex items-center">
            {/* Circle Step */}
            <div
              className={
                "w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-200 shadow " +
                (isActive
                  ? "bg-green-600 text-white scale-110 shadow-green-300 ring-2 ring-green-400"
                  : isDone
                  ? "bg-green-200 text-green-700 hover:bg-green-400 cursor-pointer"
                  : "bg-gray-200 text-gray-400 hover:bg-gray-300 cursor-pointer")
              }
              // Cho phép bấm vào mọi step (có thể sửa lại chỉ cho phép bấm các step đã qua, tuỳ ý)
              style={{ cursor: "pointer" }}
              onClick={handleStepClick}
              title={`Go to step ${stepNum}`}
            >
              {stepNum}
            </div>
            {/* Line nối với step tiếp theo */}
            {idx < totalSteps - 1 && (
              <div
                className={
                  "h-1 w-10 sm:w-20 transition-all duration-150 " +
                  (isDone
                    ? "bg-green-600 hover:bg-green-400 cursor-pointer"
                    : isActive
                    ? "bg-green-300 hover:bg-green-400 cursor-pointer"
                    : "bg-gray-200 hover:bg-gray-300 cursor-pointer")
                }
                onClick={() => onStepClick && onStepClick(stepNum + 1)}
                style={{ cursor: "pointer" }}
                title={`Go to step ${stepNum + 1}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
