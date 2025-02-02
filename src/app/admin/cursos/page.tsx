'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Table } from 'antd';
import CursosService from '../../../services/umgService';
import { useTranslations } from 'next-intl';

import { EyeIcon } from '@heroicons/react/24/solid';
import { SiMicrosoftexcel } from "react-icons/si";
import { FaRegFilePdf, FaPlus } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import ViewDetailsModal from './ViewDetailsModal';
import InsertCoursersModal from "./InsertCousersModal";
import DeleteConfirmationModal from "../../../components/general/DeleteConfirmationModal/DeleteConfirmationModal";
import { toast } from 'react-toastify';
import { Cursos } from '../../../models/interface/Cursos';

const VDialog = dynamic(() => import("../../../components/general/VDialog/VDialog"), { ssr: false });

const MyPage = () => {
  // I18N 
  const t = useTranslations('general');
  const [cursosItems, setCursosItems] = useState<Cursos[]>([]);
  const cursosService = new CursosService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Estado para el modal de nuevo registro
  const [selectedCurso, setSelectedCurso] = useState<Cursos | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [cursoNombre, setCursoNombre] = useState('');
  const [cursoDescripcion, setCursoDescripcion] = useState('');
  const [currentCurso, setCurrentCurso] = useState<Cursos | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCursoToDelete, setSelectedCursoToDelete] = useState<Cursos | null>(null);

  const truncateDescription = (description: string, wordLimit: number = 6): string => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text: string) => truncateDescription(text),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text: any, record: Cursos) => (
        <div className='flex justify-center'>
          <button
            className=""
            onClick={() => {
              setSelectedCurso(record);
              setIsModalOpen(true);
            }}
          >
            <EyeIcon className="h-5 w-5 mr-2 text-blue-800 hover:bg-blue-200 hover:text-blue-900" />
          </button>
          <button
            className=""
            onClick={() => handleDownloadExcelID(record.id)}
          >
            <SiMicrosoftexcel className='text-emerald-700 hover:text-emerald-800 hover:bg-emerald-200' />
          </button>
          <button onClick={() => handleGeneratePdfById(record.id)}>
            <FaRegFilePdf className="h-5 w-5 mr-2 text-blue-700 hover:text-blue-800 hover:bg-blue-200" />
          </button>
          <button
            className=""
            onClick={() => handleEdit(record)}
          >
            <FaPenToSquare className="h-5 w-5 mr-2 text-yellow-500 hover:text-yellow-600" />
          </button>
          <button
            className=""
            onClick={() => handleDeleteClick(record)}
          >
            <MdDeleteOutline className="h-5 w-5 text-red-600 hover:text-red-700" />
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteClick = (curso: Cursos) => {
    setSelectedCursoToDelete(curso);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCursoToDelete) {
      await handleDeleteCurso(selectedCursoToDelete);
      setSelectedCursoToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (curso: Cursos) => {
    setCurrentCurso(curso);
    setCursoNombre(curso.nombre);
    setCursoDescripcion(curso.descripcion);
    setIsFormVisible(true);
  };

  const handleUpdateCurso = async (id: number, curso: Partial<Cursos>) => {
    try {
      await cursosService.cursosService.updateCurso(id, curso);
      fetchCursos();
      setIsFormVisible(false);
    //  toast.success('Curso actualizado'); // Muestra el toast
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCurso && currentCurso.id) {
      const updatedCurso = {
        nombre: cursoNombre,
        descripcion: cursoDescripcion,
      };
      await handleUpdateCurso(currentCurso.id, updatedCurso);
      setIsFormVisible(false);  // Cierra el modal
      fetchCursos();            // Recarga la data
    //  toast.success('Curso actualizado'); // Muestra el toast
    } else {
      console.error('Error: No se ha seleccionado ningún curso para actualizar');
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const values = useMemo(() => cursosItems, [cursosItems]); //Mapea los cursos en el formato de la interface de cursos

  const fetchCursos = async () => {
    try {
      const result = await cursosService.cursosService.getCursos();
      if (result && Array.isArray(result)) {
        setCursosItems(result);
      } else {
        console.error('Formato de respuesta inesperado:', result);
      }
    } catch (error) {
      console.error('Error al obtener cursos:', error);
    }
  };

  const handleDownloadExcelID = async (id: number) => {
    try {
      const blob = await cursosService.cursosService.getCursoExcelId(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curso_${id}.xlsx`; // Nombre del archivo con el ID del curso
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    //  toast.success('Excel del curso Generado'); // Muestra el toast
    } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await cursosService.cursosService.getCursoExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cursos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
   //   toast.success('Excel Generado Exitosamente'); // Muestra el toast
    } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
     // toast.error('Error Al Generar Excel');
    }
  };

  const handleDeleteCurso = async (curso: Cursos) => {
    try {
      await cursosService.cursosService.deleteCurso(curso.id);
      fetchCursos();
  //    toast.success('Curso Eliminado'); // Muestra el toast
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
   //   toast.error('Error Al Eliminar Curso');
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const blob = await cursosService.cursosService.getCursoPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cursos.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
   //   toast.success("Pdf Generado");
    } catch (error) {
      console.error('Error al generar el PDF:', error);
   //   toast.error("Error al generar el PDF");
    }
  };

  const handleGeneratePdfById = async (id: number) => {
    try {
      const response = await cursosService.cursosService.getCursoPdfById(id);
      const blob = await response.arrayBuffer();
      const file = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curso_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  //    toast.success('PDF del curso generado');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
   //   toast.error('Error al generar el PDF');
    }
  };

  const handleNewClick = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <div className='my-2'>
        <div className="flex justify-between">
          <div className='flex items-center'>
            {t("Courses")}
          </div>
          <div className='flex justify-end'>
            <button
              onClick={handleNewClick}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            >
              <FaPlus className="text-xl mr-2" />
              Nuevo
            </button>
            <button
              onClick={handleDownloadExcel}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            >
              <SiMicrosoftexcel className="text-xl mr-2" />
              Generar Excel
            </button>
            <button
              onClick={handleGeneratePdf}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <FaRegFilePdf className="text-xl mr-2" />
              Generar PDF
            </button>
          </div>
        </div>
      </div>
      <div className='my-8'>
        <Table
          columns={columns}
          dataSource={values}
          rowKey="id"
          pagination={{
            showSizeChanger: true, // Permite cambiar el número de filas por página
            pageSizeOptions: ['5', '10', '20', '50'], // Opciones de tamaño de página
        }}
        />
      </div>

      {/*Agregar el modal de eliminación */}
      {showDeleteModal && (
        <div className='flex justify-center'>
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            message="¿Estás seguro de que quieres eliminar este Curso?"
          />
        </div>
      )}

      {/*Modal para manejar la vista de los cursos y su información.*/}
      {isModalOpen && selectedCurso && (
        <ViewDetailsModal
          selectedCurso={selectedCurso}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/*Modal para manejar la inserción de un nuevo curso.*/}
      {isOpen && (
        <InsertCoursersModal
          fetchCursos={fetchCursos}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/*Evento para manejar el modal del formulario de actualización de los cursos.*/}
      {isFormVisible && isFormVisible === true && (
        //@ts-ignore
        <VDialog
          isOpen={isFormVisible}
          size='sm'
        >
          <form onSubmit={handleUpdate} className="p-4">
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-gray-700 text-base font-semibold mb-2">
                {t("name")}<span className='text-red-600'>(*)</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={cursoNombre}
                onChange={(e) => setCursoNombre(e.target.value)}
                className="border rounded-md w-full py-2 px-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:shadow-outline shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-gray-700 text-base font-semibold mb-2">
                {t("description")}<span className='text-red-600'>(*)</span>
              </label>
              <textarea
                id="descripcion"
                value={cursoDescripcion}
                onChange={(e) => setCursoDescripcion(e.target.value)}
                className="border rounded-md w-full py-2 px-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:shadow-outline shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mr-2"
              >
                {t('update')}<FaPenToSquare className="inline ml-2 text-xl font-extrabold" />
              </button>
            </div>
          </form>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsFormVisible(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </VDialog>
      )}
    </div>
  );
};

export default MyPage;
