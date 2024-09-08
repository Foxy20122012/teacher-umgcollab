import React, { useState, useEffect } from 'react';
import ModalBase from '../../../../components/templates/ModalBase/index';
import { useTranslations } from 'next-intl';
import { PostCategory } from '@/models/interface/categories/PostCategory';
import PostCategoryService from '../../../../services/umgService/collabAdmin/categories/postCategoryService';


interface Props {
    onClose: () => void;
    fetchPostCategory: () => void; // Función para actualizar la lista de temas después de insertar uno nuevo
  }

  const InsertPostCategoryModal: React.FC<Props> = ({ onClose, fetchPostCategory }) => {
    const t = useTranslations('general');
    const [postCategory, setPostCategory] = useState<PostCategory[]>([]);
    const postCategoryService = new PostCategoryService();

    return(
    <ModalBase onClose={onClose} title={t('details')} width={800} className="bg-white rounded-lg shadow-xl">
         <form onSubmit={} className="p-4">
            <div>

            </div>
         </form>
    </ModalBase>
)
}

export default InsertPostCategoryModal;






