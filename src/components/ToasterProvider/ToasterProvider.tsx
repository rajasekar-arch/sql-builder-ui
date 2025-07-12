import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#4BB543',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#ff4d4f',
            color: '#fff',
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
