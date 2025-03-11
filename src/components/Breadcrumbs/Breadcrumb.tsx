import { Link } from 'react-router-dom';
import { getUserInfo } from '../../util/auth';
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const userInfo = getUserInfo()
  const currentRoles = userInfo?.roles || []
  function checkManagerRole() {
    return currentRoles.length > 0 && currentRoles.includes('Manager')
  }

  function checkStaffRole() {
    return currentRoles.length > 0 && currentRoles.includes('Staff')
  }

  let url = '/admin/accounts'
  if (checkManagerRole()) {
    url = '/manager/reports'
  }
  else if (checkStaffRole()) {
    url = '/staff/products'
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to={url}>
              Home /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
