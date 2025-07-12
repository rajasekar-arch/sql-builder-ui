type CardProps = {
  title: string;
};

const Card = ({ title }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer h-full">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export default Card;
