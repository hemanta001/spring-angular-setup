import {User} from '@modules/auth/models';
import {UserRole} from '@modules/auth/models/UserRole';

export {User};

export class MockUser implements User {
  id = 'TEST_ID';
  firstName = 'TEST_FIRST_NAME';
  lastName = 'TEST_LAST_NAME';
  email = 'TEST_EMAIL';
  roles = [UserRole.SUPERADMIN, UserRole.TENANTADMIN];
  username = 'TEST_USERNAME';
}
