import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  ReadOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BarChartOutlined,
  IdcardOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons';

const menuItems = [
  {
    key: '/admin/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'Pemsun',
    icon: <ReadOutlined />, // Icono de libro para representar cursos y temas
    label: 'Pensum',
    children: [
      {
        key: '/admin/cursos',
        label: 'Cursos',
      },
      {
        key: '/admin/topics',
        label: 'Temas Cursos',
      },
    ],
  },
  {
    key: '/admin/post',
    icon: <FileTextOutlined />, // Icono para representar publicaciones o posts
    label: 'Post',
    children: [
      {
        key: '/admin/views/viewPost',
        label: 'Post Visibles',
      },
      {
        key: '/admin/pending/postspendient',
        label: 'Post Pendientes',
      },
      {
        key: '/admin/post',
        label: 'Publicar Post',
      },
      {
        key: '/admin/views/viewNews',
        label: 'Noticias',
      },
      {
        key: '/admin/post/news',
        label: 'Publicar Noticias',
      },
      {
        key: '/admin/pending/newspendient',
        label: 'Noticias Pendientes',
      },
      {
        key: '/admin/views/viewEvents',
        label: 'Eventos',
      },
      {
        key: '/admin/post/events',
        label: 'Publicar Eventos',
      },
      {
        key: '/admin/pending/eventspendient',
        label: 'Eventos Pendientes',
      },
    ],
  },
  {
    key: '/admin/categories',
    icon: <TagsOutlined />, // Icono de etiquetas para representar categorías
    label: 'Categorias',
    children: [
      {
        key: '/admin/categories/post',
        label: 'Categorias Post',
      },
      {
        key: '/admin/categories/news',
        label: 'Categoria Noticias',
      },
      {
        key: '/admin/categories/events',
        label: 'Categoria Eventos',
      },
    ],
  },
  {
    key: '/admin/students',
    icon: <UsergroupAddOutlined />, // Icono de grupo para representar estudiantes
    label: 'Estudiantes',
    children: [
      {
        key: '/admin/students',
        label: 'Lista de Estudiantes',
      },
    ],
  },
  {
    key: '/admin/about',
    icon: <QuestionCircleOutlined />, 
    label: 'acerca de',
  },
];

export default menuItems;
