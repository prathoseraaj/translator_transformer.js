type Props = {
  text: string;
  percentage?: number;
};

export default function Progress({
  text,
  percentage = 0,
}: Props) {
  return (
    <div className="w-full bg-gray-200 rounded mt-2 overflow-hidden">
      <div
        className="bg-blue-500 text-white text-sm p-1"
        style={{
          width: `${percentage}%`,
        }}
      >
        {text} ({percentage.toFixed(2)}%)
      </div>
    </div>
  );
}