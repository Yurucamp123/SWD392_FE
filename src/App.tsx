import { RouterProvider } from 'react-router-dom';
import { router } from './route';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import style của Toastify

function App() {
  return (<>
    <RouterProvider router={router} />
    <ToastContainer />
  </>);
}

export default App;