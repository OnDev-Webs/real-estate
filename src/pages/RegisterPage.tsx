
import { useState } from 'react';
import Layout from '@/components/Layout';
import Register from './Register';

const RegisterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Navigate back to home page when modal is closed
    window.location.href = '/';
  };
  
  return (
    <Layout>
      <div className="container mx-auto my-8">
        <Register isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default RegisterPage;
