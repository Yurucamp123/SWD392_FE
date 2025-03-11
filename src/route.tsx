import { createBrowserRouter } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import ScrollToTop from './components/ScrollToTop';
import DefaultLayout from './layout/DefaultLayout';
import AddAccount from './pages/Admin/AddAccount';
import EditAccount from './pages/Admin/EditAccount';
import ListAccount from './pages/Admin/ListAccount';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import { action as logoutAction } from './pages/Authentication/Logout';
import RecoverPassword from './pages/Authentication/RecoverPassword';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ErrorPage from './pages/Error/ErrorPage';
import Lots from './pages/Lots';
import ExportProduct from './pages/Manager/ExportProduct';
import ImportProduct from './pages/Manager/ImportProduct';
import InventoryTracking from './pages/Manager/InventoryTracking';
import Report from './pages/Manager/Report';
import TransactionManagement from './pages/Manager/TransactionManagement';
import OrderHistory from './pages/OrderHistory';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Shelfs from './pages/Shelfs';
import { accountListLoader } from './fetch/account';
import CreateOrder from './pages/CreateOrder';
import SuppliersPage from './pages/SuppliersPage';
import Platforms from './pages/Platform';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <>
            <ScrollToTop />
            <DefaultLayout />
        </>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'staff',
                children: [
                    {
                        path: "shelfs",
                        element: (
                            <>
                                <PageTitle title="Shelfs Manage" />
                                <Shelfs />
                            </>
                        )
                    }, {
                        path: "lots",
                        element: (
                            <>
                                <PageTitle title="Lots Manage" />
                                <Lots />
                            </>
                        )
                    }
                    ,
                    {
                        path: 'products',
                        element: (
                            <>
                                <PageTitle title="Product Manage" />
                                <Products />
                            </>
                        )
                    },
                    {
                        path: 'import-product',
                        element: (
                            <>
                                <PageTitle title="Import Product" />
                                <ImportProduct />
                            </>
                        )
                    },
                    {
                        path: 'export-product',
                        element: (
                            <>
                                <PageTitle title="Export Product" />
                                <ExportProduct />
                            </>
                        )
                    },
                    {
                        path: 'confirm-stock-daily',
                        element: (
                            <>
                                <PageTitle title="Confirm Stock Daily" />
                                <InventoryTracking />
                            </>
                        )
                    },
                    {
                        path: 'order-history',
                        element: (
                            <>
                                <PageTitle title="Order History" />
                                <OrderHistory />
                            </>
                        )
                    },
                    {
                        path: 'create-order',
                        element: (
                            <>
                                <PageTitle title="Create Order" />
                                <CreateOrder />
                            </>
                        )
                    },
                    {
                        path: 'suppliers-page',
                        element: (
                            <>
                                <PageTitle title="Suppliers Page" />
                                <SuppliersPage />
                            </>
                        )
                    },
                    {
                        path: 'platforms',
                        element: (
                            <>
                                <PageTitle title="platforms" />
                                <Platforms />
                            </>
                        )
                    }
                ]
            }, {
                path: 'admin',
                children: [
                    {
                        id: 'accountList',
                        path: 'accounts',
                        loader: accountListLoader,
                        element: (
                            <>
                                <PageTitle title="Account List" />
                                <ListAccount />
                            </>
                        )
                    },
                    {
                        path: 'add-account',
                        element: (
                            <>
                                <PageTitle title="Add new Account" />
                                <AddAccount />
                            </>
                        )
                    },
                    {
                        path: 'edit-account/:id',
                        loader: accountListLoader,
                        element: (
                            <>
                                <PageTitle title="Edit Account" />
                                <EditAccount />
                            </>
                        )
                    },
                ]
            }, {
                path: 'manager',
                children: [
                    {
                        path: "shelfs",
                        element: (
                            <>
                                <PageTitle title="Shelfs Manage" />
                                <Shelfs />
                            </>
                        )
                    }, {
                        path: "lots",
                        element: (
                            <>
                                <PageTitle title="Lots Manage" />
                                <Lots />
                            </>
                        )
                    }
                    , {
                        path: 'products',
                        element: (
                            <>
                                <PageTitle title="Product Manage" />
                                <Products />
                            </>
                        )
                    },
                    {
                        path: 'reports',
                        element: (
                            <>
                                <PageTitle title="Reports" />
                                <Report />
                            </>
                        )
                    },
                    {
                        path: 'import-product',
                        element: (
                            <>
                                <PageTitle title="Import Product" />
                                <ImportProduct />
                            </>
                        )
                    },
                    {
                        path: 'export-product',
                        element: (
                            <>
                                <PageTitle title="Export Product" />
                                <ExportProduct />
                            </>
                        )
                    },
                    {
                        path: 'transaction-management',
                        element: (
                            <>
                                <PageTitle title="Transaction Management" />
                                <TransactionManagement />
                            </>
                        )
                    },
                    {
                        path: 'confirm-stock-daily',
                        element: (
                            <>
                                <PageTitle title="Confirm Stock Daily" />
                                <InventoryTracking />
                            </>
                        )
                    },
                    {
                        path: 'order-history',
                        element: (
                            <>
                                <PageTitle title="Order History" />
                                <OrderHistory />
                            </>
                        )
                    },
                    {
                        path: 'create-order',
                        element: (
                            <>
                                <PageTitle title="Order History" />
                                <CreateOrder />
                            </>
                        )
                    }
                ]
            }
            // other roles here...
        ]
    }, {
        path: '/auth',
        errorElement: <ErrorPage />,
        children: [
            {
                path: "signin",
                element: (<>
                    <PageTitle title="Signin | Warehouse management" />
                    <SignIn />
                </>)
            }, {
                path: "signup",
                element: (<>
                    <PageTitle title="Sign Up | Warehouse management" />
                    <SignUp />
                </>)
            }, {
                path: 'logout',
                action: logoutAction,
            }, {
                path: 'forgot-password',
                element: (<>
                    <PageTitle title="Forgot Password | Warehouse management" />
                    <ForgotPassword />
                </>)
            }
            , {
                path: 'recover-password',
                element: (<>
                    <PageTitle title="Recover Password | Warehouse management" />
                    <RecoverPassword />
                </>)
            }
        ]
    }
])