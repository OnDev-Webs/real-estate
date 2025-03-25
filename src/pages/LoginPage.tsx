
import { useState } from 'react';
import Layout from '@/components/Layout';
import Login from './Login';

const LoginPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Navigate back to home page when modal is closed
    window.location.href = '/';
  };
  
  return (
    <Layout>
      <div className="container mx-auto my-8">
        <Login isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default LoginPage;
