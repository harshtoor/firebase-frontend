'use client';

import { withRoleGuard } from '../../lib/routeGuard';

function AdminPage() {

  return <h1>Welcome, Admin!</h1>;
}
// export default AdminPage;

export default withRoleGuard(AdminPage, ['admin']);